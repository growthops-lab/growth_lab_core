import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import * as oidc from "openid-client";

import type { ApprovalGateActorContextProvider } from "./approval-gate-actor-context-provider";

const GOOGLE_WORKSPACE_ISSUER = "https://accounts.google.com";
const HUMAN_OWNER_PERMISSION = "APPROVAL_GATE_HUMAN_OWNER_DECIDE";
const TRANSACTION_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export type HumanIdentityProviderFailureKind =
  | "CONFIGURATION_INVALID"
  | "TRANSACTION_INVALID"
  | "UPSTREAM_IDENTITY_INVALID"
  | "IDENTITY_DISABLED"
  | "HUMAN_OWNER_GRANT_REQUIRED"
  | "SESSION_INVALID";

export type HumanIdentityProviderResult<T> =
  | { ok: true; value: T }
  | { ok: false; kind: HumanIdentityProviderFailureKind };

export interface HumanIdentityProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  workspaceDomain: string;
  subjectHmacKey: string;
  transactionEncryptionKey: string;
  transactionStateHmacKey: string;
  sessionHashKey: string;
}

export interface EncryptedLoginTransaction {
  stateHash: string;
  secretCiphertext: string;
  expiresAt: Date;
}

export interface HumanIdentityTransactionStore {
  create(transaction: EncryptedLoginTransaction): Promise<void>;
  consume(stateHash: string): Promise<EncryptedLoginTransaction | null>;
}

export interface ActiveHumanIdentity {
  id: string;
  opaqueSubjectReference: string;
  disabledAt: Date | null;
  hasActiveHumanOwnerGrant: boolean;
}

export interface ActiveHumanIdentitySession {
  id: string;
  humanIdentity: ActiveHumanIdentity;
  expiresAt: Date;
  revokedAt: Date | null;
}

export type HumanIdentityAuditEvent =
  "LOGIN_SUCCEEDED" | "SESSION_REVOKED" | "LOGGED_OUT";

export interface HumanIdentityStore {
  findIdentityByExternalSubjectHmac(
    externalSubjectHmac: string,
  ): Promise<ActiveHumanIdentity | null>;
  createSession(input: {
    humanIdentityId: string;
    sessionTokenHash: string;
    expiresAt: Date;
  }): Promise<ActiveHumanIdentitySession>;
  findSessionByTokenHash(
    sessionTokenHash: string,
  ): Promise<ActiveHumanIdentitySession | null>;
  revokeSessionByTokenHash(sessionTokenHash: string): Promise<boolean>;
  recordAudit(input: {
    humanIdentityId: string;
    sessionId?: string;
    eventType: HumanIdentityAuditEvent;
  }): Promise<void>;
}

export interface VerifiedGoogleWorkspaceIdentity {
  issuer: string;
  audience: string | readonly string[];
  expiresAt: number;
  nonce: string;
  workspaceDomain: string;
  providerSubject: string;
  signatureVerified: boolean;
}

export interface HumanIdentityOidcClient {
  buildAuthorizationUrl(input: {
    redirectUri: string;
    state: string;
    nonce: string;
    codeChallenge: string;
  }): Promise<URL>;
  exchangeAuthorizationCode(input: {
    callbackUrl: URL;
    redirectUri: string;
    state: string;
    nonce: string;
    codeVerifier: string;
  }): Promise<VerifiedGoogleWorkspaceIdentity>;
}

export interface HumanIdentitySessionCookie {
  name: "__Host-growth-lab-human-session";
  value: string;
  httpOnly: true;
  secure: true;
  sameSite: "lax";
  path: "/";
  maxAge: number;
}

type TransactionSecret = {
  codeVerifier: string;
  nonce: string;
  state: string;
};

function failure<T>(
  kind: HumanIdentityProviderFailureKind,
): HumanIdentityProviderResult<T> {
  return { ok: false, kind };
}

function hmac(key: string, value: string): string {
  return createHmac("sha256", key).update(value, "utf8").digest("base64url");
}

function secureEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function sealTransaction(
  keyMaterial: string,
  secret: TransactionSecret,
): string {
  const key = createHash("sha256").update(keyMaterial, "utf8").digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(secret), "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

function isTransactionSecret(value: unknown): value is TransactionSecret {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const keys = Object.keys(candidate);
  return (
    keys.length === 3 &&
    keys.every((key) => ["codeVerifier", "nonce", "state"].includes(key)) &&
    typeof candidate.codeVerifier === "string" &&
    typeof candidate.nonce === "string" &&
    typeof candidate.state === "string" &&
    candidate.codeVerifier.length >= 43 &&
    candidate.nonce.length >= 32 &&
    candidate.state.length >= 32
  );
}

function openTransaction(
  keyMaterial: string,
  ciphertextValue: string,
): TransactionSecret | null {
  try {
    const [iv, authTag, ciphertext] = ciphertextValue.split(".");
    if (!iv || !authTag || !ciphertext) {
      return null;
    }

    const key = createHash("sha256").update(keyMaterial, "utf8").digest();
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(authTag, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed: unknown = JSON.parse(plaintext);

    return isTransactionSecret(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function hasValidConfig(config: HumanIdentityProviderConfig): boolean {
  if (
    !config.clientId ||
    !config.clientSecret ||
    !config.workspaceDomain ||
    !config.subjectHmacKey ||
    !config.transactionEncryptionKey ||
    !config.transactionStateHmacKey ||
    !config.sessionHashKey
  ) {
    return false;
  }

  try {
    return new URL(config.redirectUri).protocol === "https:";
  } catch {
    return false;
  }
}

function audienceIncludes(
  audience: string | readonly string[],
  clientId: string,
): boolean {
  return typeof audience === "string"
    ? secureEquals(audience, clientId)
    : audience.some((value) => secureEquals(value, clientId));
}

function claimsAreValid(
  identity: VerifiedGoogleWorkspaceIdentity,
  config: HumanIdentityProviderConfig,
  expectedNonce: string,
  now: number,
): boolean {
  return (
    identity.signatureVerified &&
    secureEquals(identity.issuer, GOOGLE_WORKSPACE_ISSUER) &&
    audienceIncludes(identity.audience, config.clientId) &&
    Number.isSafeInteger(identity.expiresAt) &&
    identity.expiresAt * 1000 > now &&
    secureEquals(identity.nonce, expectedNonce) &&
    secureEquals(identity.workspaceDomain, config.workspaceDomain) &&
    identity.providerSubject.length > 0
  );
}

export function deriveExternalSubjectHmac(
  subjectHmacKey: string,
  issuer: string,
  providerSubject: string,
): string {
  return hmac(subjectHmacKey, `${issuer}\u0000${providerSubject}`);
}

export function hashHumanIdentitySession(
  sessionHashKey: string,
  sessionToken: string,
): string {
  return hmac(sessionHashKey, sessionToken);
}

export class GoogleWorkspaceOidcClient implements HumanIdentityOidcClient {
  #configuration: Promise<oidc.Configuration> | undefined;

  constructor(private readonly config: HumanIdentityProviderConfig) {}

  async buildAuthorizationUrl(input: {
    redirectUri: string;
    state: string;
    nonce: string;
    codeChallenge: string;
  }): Promise<URL> {
    return oidc.buildAuthorizationUrl(await this.configuration(), {
      redirect_uri: input.redirectUri,
      response_type: "code",
      scope: "openid email",
      state: input.state,
      nonce: input.nonce,
      code_challenge: input.codeChallenge,
      code_challenge_method: "S256",
    });
  }

  async exchangeAuthorizationCode(input: {
    callbackUrl: URL;
    redirectUri: string;
    state: string;
    nonce: string;
    codeVerifier: string;
  }): Promise<VerifiedGoogleWorkspaceIdentity> {
    const tokens = await oidc.authorizationCodeGrant(
      await this.configuration(),
      input.callbackUrl,
      {
        pkceCodeVerifier: input.codeVerifier,
        expectedState: input.state,
        expectedNonce: input.nonce,
        idTokenExpected: true,
      },
      { redirect_uri: input.redirectUri },
    );
    const claims = tokens.claims();

    if (
      !claims ||
      typeof claims.hd !== "string" ||
      typeof claims.iss !== "string" ||
      typeof claims.sub !== "string" ||
      typeof claims.exp !== "number" ||
      typeof claims.nonce !== "string"
    ) {
      throw new Error("OIDC identity claims are invalid.");
    }

    return {
      issuer: claims.iss,
      audience: claims.aud,
      expiresAt: claims.exp,
      nonce: claims.nonce,
      workspaceDomain: claims.hd,
      providerSubject: claims.sub,
      signatureVerified: true,
    };
  }

  private configuration(): Promise<oidc.Configuration> {
    if (!this.#configuration) {
      this.#configuration = oidc.discovery(
        new URL(GOOGLE_WORKSPACE_ISSUER),
        this.config.clientId,
        {
          redirect_uris: [this.config.redirectUri],
          response_types: ["code"],
          token_endpoint_auth_method: "client_secret_post",
        },
        oidc.ClientSecretPost(this.config.clientSecret),
      );
    }

    return this.#configuration;
  }
}

export class HumanIdentityProviderService {
  constructor(
    private readonly config: HumanIdentityProviderConfig,
    private readonly oidcClient: HumanIdentityOidcClient,
    private readonly transactionStore: HumanIdentityTransactionStore,
    private readonly identityStore: HumanIdentityStore,
    private readonly now: () => number = Date.now,
  ) {}

  async begin(): Promise<
    HumanIdentityProviderResult<{ authorizationUrl: URL }>
  > {
    if (!hasValidConfig(this.config)) {
      return failure("CONFIGURATION_INVALID");
    }

    const state = randomBytes(32).toString("base64url");
    const nonce = randomBytes(32).toString("base64url");
    const codeVerifier = randomBytes(48).toString("base64url");
    const codeChallenge = createHash("sha256")
      .update(codeVerifier, "utf8")
      .digest("base64url");

    try {
      await this.transactionStore.create({
        stateHash: hmac(this.config.transactionStateHmacKey, state),
        secretCiphertext: sealTransaction(
          this.config.transactionEncryptionKey,
          {
            state,
            nonce,
            codeVerifier,
          },
        ),
        expiresAt: new Date(this.now() + TRANSACTION_TTL_MS),
      });
      const authorizationUrl = await this.oidcClient.buildAuthorizationUrl({
        redirectUri: this.config.redirectUri,
        state,
        nonce,
        codeChallenge,
      });

      return { ok: true, value: { authorizationUrl } };
    } catch {
      return failure("UPSTREAM_IDENTITY_INVALID");
    }
  }

  async complete(
    callbackUrl: URL,
  ): Promise<
    HumanIdentityProviderResult<{ sessionCookie: HumanIdentitySessionCookie }>
  > {
    if (!hasValidConfig(this.config)) {
      return failure("CONFIGURATION_INVALID");
    }

    const state = callbackUrl.searchParams.get("state");
    if (!state) {
      return failure("TRANSACTION_INVALID");
    }

    let transaction: EncryptedLoginTransaction | null;
    try {
      transaction = await this.transactionStore.consume(
        hmac(this.config.transactionStateHmacKey, state),
      );
    } catch {
      return failure("TRANSACTION_INVALID");
    }

    if (!transaction || transaction.expiresAt.getTime() <= this.now()) {
      return failure("TRANSACTION_INVALID");
    }

    const secret = openTransaction(
      this.config.transactionEncryptionKey,
      transaction.secretCiphertext,
    );
    if (!secret || !secureEquals(secret.state, state)) {
      return failure("TRANSACTION_INVALID");
    }

    let verifiedIdentity: VerifiedGoogleWorkspaceIdentity;
    try {
      verifiedIdentity = await this.oidcClient.exchangeAuthorizationCode({
        callbackUrl,
        redirectUri: this.config.redirectUri,
        state: secret.state,
        nonce: secret.nonce,
        codeVerifier: secret.codeVerifier,
      });
    } catch {
      return failure("UPSTREAM_IDENTITY_INVALID");
    }

    if (
      !claimsAreValid(verifiedIdentity, this.config, secret.nonce, this.now())
    ) {
      return failure("UPSTREAM_IDENTITY_INVALID");
    }

    const externalSubjectHmac = deriveExternalSubjectHmac(
      this.config.subjectHmacKey,
      verifiedIdentity.issuer,
      verifiedIdentity.providerSubject,
    );
    let identity: ActiveHumanIdentity | null;
    try {
      identity =
        await this.identityStore.findIdentityByExternalSubjectHmac(
          externalSubjectHmac,
        );
    } catch {
      return failure("UPSTREAM_IDENTITY_INVALID");
    }

    if (!identity || identity.disabledAt) {
      return failure(
        identity ? "IDENTITY_DISABLED" : "HUMAN_OWNER_GRANT_REQUIRED",
      );
    }
    if (!identity.hasActiveHumanOwnerGrant) {
      return failure("HUMAN_OWNER_GRANT_REQUIRED");
    }

    const sessionToken = randomBytes(32).toString("base64url");
    const sessionTokenHash = hashHumanIdentitySession(
      this.config.sessionHashKey,
      sessionToken,
    );
    const expiresAt = new Date(this.now() + SESSION_TTL_MS);
    try {
      const session = await this.identityStore.createSession({
        humanIdentityId: identity.id,
        sessionTokenHash,
        expiresAt,
      });
      await this.identityStore.recordAudit({
        humanIdentityId: identity.id,
        sessionId: session.id,
        eventType: "LOGIN_SUCCEEDED",
      });
    } catch {
      return failure("UPSTREAM_IDENTITY_INVALID");
    }

    return {
      ok: true,
      value: {
        sessionCookie: {
          name: "__Host-growth-lab-human-session",
          value: sessionToken,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: Math.floor(SESSION_TTL_MS / 1000),
        },
      },
    };
  }

  async resolveActorContext(
    sessionToken: string | undefined,
  ): Promise<unknown> {
    if (!hasValidConfig(this.config) || !sessionToken) {
      return undefined;
    }

    try {
      const session = await this.identityStore.findSessionByTokenHash(
        hashHumanIdentitySession(this.config.sessionHashKey, sessionToken),
      );
      if (
        !session ||
        session.revokedAt ||
        session.expiresAt.getTime() <= this.now() ||
        session.humanIdentity.disabledAt ||
        !session.humanIdentity.hasActiveHumanOwnerGrant
      ) {
        return undefined;
      }

      return {
        actorRole: "HUMAN_OWNER",
        authorizationContext: {
          trustStatus: "VERIFIED_UPSTREAM",
          subjectReference: session.humanIdentity.opaqueSubjectReference,
          permissions: [HUMAN_OWNER_PERMISSION],
        },
      };
    } catch {
      return undefined;
    }
  }

  async logout(
    sessionToken: string | undefined,
  ): Promise<HumanIdentitySessionCookie> {
    if (hasValidConfig(this.config) && sessionToken) {
      try {
        const sessionTokenHash = hashHumanIdentitySession(
          this.config.sessionHashKey,
          sessionToken,
        );
        const session =
          await this.identityStore.findSessionByTokenHash(sessionTokenHash);
        if (session) {
          const revoked =
            await this.identityStore.revokeSessionByTokenHash(sessionTokenHash);
          if (revoked) {
            await this.identityStore.recordAudit({
              humanIdentityId: session.humanIdentity.id,
              sessionId: session.id,
              eventType: "LOGGED_OUT",
            });
          }
        }
      } catch {
        // Logout always clears the browser cookie without exposing failures.
      }
    }

    return {
      name: "__Host-growth-lab-human-session",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    };
  }

  async revoke(sessionToken: string | undefined): Promise<void> {
    if (!hasValidConfig(this.config) || !sessionToken) {
      return;
    }

    try {
      const sessionTokenHash = hashHumanIdentitySession(
        this.config.sessionHashKey,
        sessionToken,
      );
      const session =
        await this.identityStore.findSessionByTokenHash(sessionTokenHash);
      const revoked =
        await this.identityStore.revokeSessionByTokenHash(sessionTokenHash);
      if (session && revoked) {
        await this.identityStore.recordAudit({
          humanIdentityId: session.humanIdentity.id,
          sessionId: session.id,
          eventType: "SESSION_REVOKED",
        });
      }
    } catch {
      // Revocation remains fail-closed because the session resolver rejects failures.
    }
  }
}

export class HumanIdentityApprovalGateActorContextProvider implements ApprovalGateActorContextProvider {
  constructor(
    private readonly service: HumanIdentityProviderService,
    private readonly readSessionToken: () => string | undefined,
  ) {}

  async resolveActorContext(): Promise<unknown> {
    try {
      return await this.service.resolveActorContext(this.readSessionToken());
    } catch {
      return undefined;
    }
  }
}
