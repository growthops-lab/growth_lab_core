import { randomBytes } from "node:crypto";

import { describe, expect, it } from "vitest";

import { resolveTrustedHumanOwnerActor } from "./approval-gate-actor-context-provider";
import {
  deriveExternalSubjectHmac,
  hashHumanIdentitySession,
  HumanIdentityApprovalGateActorContextProvider,
  HumanIdentityProviderService,
  type ActiveHumanIdentity,
  type ActiveHumanIdentitySession,
  type EncryptedLoginTransaction,
  type HumanIdentityOidcClient,
  type HumanIdentityProviderConfig,
  type HumanIdentityStore,
  type HumanIdentityTransactionStore,
  type VerifiedGoogleWorkspaceIdentity,
} from "./human-identity-provider";

const ISSUER = "https://accounts.google.com";

function opaque(): string {
  return randomBytes(32).toString("base64url");
}

function opaqueSubjectReference(): string {
  return `AUTH_SUBJECT-owner_${opaque()}`;
}

function config(): HumanIdentityProviderConfig {
  return {
    clientId: "human-owner-client",
    clientSecret: opaque(),
    redirectUri: "https://growth-lab.example.test/api/human-identity/callback",
    workspaceDomain: "workspace.example.test",
    subjectHmacKey: opaque(),
    transactionEncryptionKey: opaque(),
    transactionStateHmacKey: opaque(),
    sessionHashKey: opaque(),
  };
}

class TransactionStore implements HumanIdentityTransactionStore {
  records = new Map<string, EncryptedLoginTransaction>();

  async create(transaction: EncryptedLoginTransaction): Promise<void> {
    this.records.set(transaction.stateHash, { ...transaction });
  }

  async consume(stateHash: string): Promise<EncryptedLoginTransaction | null> {
    const transaction = this.records.get(stateHash);
    this.records.delete(stateHash);
    return transaction ? { ...transaction } : null;
  }

  expire(): void {
    for (const transaction of this.records.values()) {
      transaction.expiresAt = new Date(0);
    }
  }

  tamper(): void {
    for (const transaction of this.records.values()) {
      transaction.secretCiphertext = "not-a-valid-ciphertext";
    }
  }
}

class IdentityStore implements HumanIdentityStore {
  identity: ActiveHumanIdentity | null = null;
  sessions = new Map<string, ActiveHumanIdentitySession>();
  audit: string[] = [];

  async findIdentityByExternalSubjectHmac(
    externalSubjectHmac: string,
  ): Promise<ActiveHumanIdentity | null> {
    return this.identity?.id === externalSubjectHmac ? this.identity : null;
  }

  async createSession(input: {
    humanIdentityId: string;
    sessionTokenHash: string;
    expiresAt: Date;
  }): Promise<ActiveHumanIdentitySession> {
    if (!this.identity || input.humanIdentityId !== this.identity.id) {
      throw new Error("identity unavailable");
    }
    const session = {
      id: opaque(),
      humanIdentity: this.identity,
      expiresAt: input.expiresAt,
      revokedAt: null,
    } satisfies ActiveHumanIdentitySession;
    this.sessions.set(input.sessionTokenHash, session);
    return session;
  }

  async findSessionByTokenHash(
    sessionTokenHash: string,
  ): Promise<ActiveHumanIdentitySession | null> {
    return this.sessions.get(sessionTokenHash) ?? null;
  }

  async revokeSessionByTokenHash(sessionTokenHash: string): Promise<boolean> {
    const session = this.sessions.get(sessionTokenHash);
    if (!session || session.revokedAt) {
      return false;
    }
    session.revokedAt = new Date();
    return true;
  }

  async recordAudit(input: {
    humanIdentityId: string;
    sessionId?: string;
    eventType: "LOGIN_SUCCEEDED" | "SESSION_REVOKED" | "LOGGED_OUT";
  }): Promise<void> {
    this.audit.push(input.eventType);
  }
}

class OidcClient implements HumanIdentityOidcClient {
  lastBegin:
    | {
        redirectUri: string;
        state: string;
        nonce: string;
        codeChallenge: string;
      }
    | undefined;
  response: Partial<VerifiedGoogleWorkspaceIdentity> = {};

  async buildAuthorizationUrl(input: {
    redirectUri: string;
    state: string;
    nonce: string;
    codeChallenge: string;
  }): Promise<URL> {
    this.lastBegin = input;
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("scope", "openid email");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("state", input.state);
    url.searchParams.set("nonce", input.nonce);
    url.searchParams.set("code_challenge", input.codeChallenge);
    return url;
  }

  async exchangeAuthorizationCode(input: {
    callbackUrl: URL;
    redirectUri: string;
    state: string;
    nonce: string;
    codeVerifier: string;
  }): Promise<VerifiedGoogleWorkspaceIdentity> {
    return {
      issuer: ISSUER,
      audience: "human-owner-client",
      expiresAt: Math.floor(Date.now() / 1000) + 300,
      nonce: input.nonce,
      workspaceDomain: "workspace.example.test",
      providerSubject: opaque(),
      signatureVerified: true,
      ...this.response,
    };
  }
}

function callbackUrl(authorizationUrl: URL): URL {
  const state = authorizationUrl.searchParams.get("state");
  if (!state) {
    throw new Error("missing state");
  }
  const url = new URL(
    "https://growth-lab.example.test/api/human-identity/callback",
  );
  url.searchParams.set("state", state);
  url.searchParams.set("code", opaque());
  return url;
}

function prepared(): {
  service: HumanIdentityProviderService;
  oidc: OidcClient;
  transactions: TransactionStore;
  identities: IdentityStore;
  configuration: HumanIdentityProviderConfig;
} {
  const configuration = config();
  const oidc = new OidcClient();
  const transactions = new TransactionStore();
  const identities = new IdentityStore();
  const service = new HumanIdentityProviderService(
    configuration,
    oidc,
    transactions,
    identities,
  );
  return { service, oidc, transactions, identities, configuration };
}

async function begin(service: HumanIdentityProviderService): Promise<URL> {
  const result = await service.begin();
  if (!result.ok) {
    throw new Error("expected authorization request");
  }
  return result.value.authorizationUrl;
}

function allowIdentity(
  identities: IdentityStore,
  configuration: HumanIdentityProviderConfig,
  providerSubject: string,
): void {
  identities.identity = {
    id: deriveExternalSubjectHmac(
      configuration.subjectHmacKey,
      ISSUER,
      providerSubject,
    ),
    opaqueSubjectReference: opaqueSubjectReference(),
    disabledAt: null,
    hasActiveHumanOwnerGrant: true,
  };
}

describe("HumanIdentityProviderService", () => {
  it("uses Authorization Code, PKCE, state, nonce, and an opaque session", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);

    const authorizationUrl = await begin(service);
    expect(authorizationUrl.searchParams.get("scope")).toBe("openid email");
    expect(authorizationUrl.searchParams.get("response_type")).toBe("code");
    expect(authorizationUrl.searchParams.get("code_challenge_method")).toBe(
      "S256",
    );
    expect(oidc.lastBegin?.state).toHaveLength(43);
    expect(oidc.lastBegin?.nonce).toHaveLength(43);

    const result = await service.complete(callbackUrl(authorizationUrl));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.sessionCookie).toMatchObject({
      name: "__Host-growth-lab-human-session",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    expect(result.value.sessionCookie.value).not.toContain(providerSubject);
    expect(
      identities.sessions.has(
        hashHumanIdentitySession(
          configuration.sessionHashKey,
          result.value.sessionCookie.value,
        ),
      ),
    ).toBe(true);
    expect(identities.audit).toEqual(["LOGIN_SUCCEEDED"]);
  });

  it.each([
    ["issuer", { issuer: "https://invalid.example.test" }],
    ["audience", { audience: "other-client" }],
    ["signature", { signatureVerified: false }],
    ["expiry", { expiresAt: 0 }],
    ["nonce", { nonce: opaque() }],
  ])("fails closed for invalid %s", async (_caseName, response) => {
    const { service, oidc } = prepared();
    oidc.response = response;

    const result = await service.complete(callbackUrl(await begin(service)));

    expect(result).toEqual({ ok: false, kind: "UPSTREAM_IDENTITY_INVALID" });
  });

  it("fails closed for a non-Workspace identity", async () => {
    const { service, oidc } = prepared();
    oidc.response.workspaceDomain = "other.example.test";

    await expect(
      service.complete(callbackUrl(await begin(service))),
    ).resolves.toEqual({ ok: false, kind: "UPSTREAM_IDENTITY_INVALID" });
  });

  it("fails closed when configuration is incomplete", async () => {
    const setup = prepared();
    const incomplete = { ...setup.configuration, clientSecret: "" };
    const service = new HumanIdentityProviderService(
      incomplete,
      setup.oidc,
      setup.transactions,
      setup.identities,
    );

    await expect(service.begin()).resolves.toEqual({
      ok: false,
      kind: "CONFIGURATION_INVALID",
    });
  });

  it("requires a pre-existing Human Owner grant without inferring a role", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    if (identities.identity) {
      identities.identity.hasActiveHumanOwnerGrant = false;
    }

    await expect(
      service.complete(callbackUrl(await begin(service))),
    ).resolves.toEqual({ ok: false, kind: "HUMAN_OWNER_GRANT_REQUIRED" });
  });

  it("rejects a disabled identity", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    if (identities.identity) {
      identities.identity.disabledAt = new Date();
    }

    await expect(
      service.complete(callbackUrl(await begin(service))),
    ).resolves.toEqual({ ok: false, kind: "IDENTITY_DISABLED" });
  });

  it.each(["tampered", "expired"])("rejects a %s transaction", async (kind) => {
    const { service, transactions } = prepared();
    const authorizationUrl = await begin(service);
    if (kind === "tampered") {
      transactions.tamper();
    } else {
      transactions.expire();
    }

    await expect(
      service.complete(callbackUrl(authorizationUrl)),
    ).resolves.toEqual({
      ok: false,
      kind: "TRANSACTION_INVALID",
    });
  });

  it("rejects a revoked or expired session", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    const login = await service.complete(callbackUrl(await begin(service)));
    if (!login.ok) {
      throw new Error("expected login");
    }

    await service.revoke(login.value.sessionCookie.value);
    await expect(
      service.resolveActorContext(login.value.sessionCookie.value),
    ).resolves.toBeUndefined();

    const session = identities.sessions.get(
      hashHumanIdentitySession(
        configuration.sessionHashKey,
        login.value.sessionCookie.value,
      ),
    );
    if (session) {
      session.revokedAt = null;
      session.expiresAt = new Date(0);
    }
    await expect(
      service.resolveActorContext(login.value.sessionCookie.value),
    ).resolves.toBeUndefined();
    expect(identities.audit).toContain("SESSION_REVOKED");
  });

  it("revokes and clears the cookie on logout", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    const login = await service.complete(callbackUrl(await begin(service)));
    if (!login.ok) {
      throw new Error("expected login");
    }

    const cookie = await service.logout(login.value.sessionCookie.value);

    expect(cookie).toEqual({
      name: "__Host-growth-lab-human-session",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    await expect(
      service.resolveActorContext(login.value.sessionCookie.value),
    ).resolves.toBeUndefined();
    expect(identities.audit).toContain("LOGGED_OUT");
  });

  it("feeds only the verified Human Owner actor shape into the B1A boundary", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    const login = await service.complete(callbackUrl(await begin(service)));
    if (!login.ok) {
      throw new Error("expected login");
    }
    const provider = new HumanIdentityApprovalGateActorContextProvider(
      service,
      () => login.value.sessionCookie.value,
    );

    await expect(resolveTrustedHumanOwnerActor(provider)).resolves.toEqual({
      ok: true,
      actor: {
        actorRole: "HUMAN_OWNER",
        authorizationContext: {
          trustStatus: "VERIFIED_UPSTREAM",
          subjectReference: identities.identity?.opaqueSubjectReference,
          permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
        },
      },
    });
  });

  it("fails closed at the B1A boundary for an invalid opaque subject reference", async () => {
    const { service, oidc, identities, configuration } = prepared();
    const providerSubject = opaque();
    oidc.response.providerSubject = providerSubject;
    allowIdentity(identities, configuration, providerSubject);
    if (!identities.identity) {
      throw new Error("expected identity");
    }
    identities.identity.opaqueSubjectReference = "AUTH_SUBJECT-_invalid";

    const login = await service.complete(callbackUrl(await begin(service)));
    if (!login.ok) {
      throw new Error("expected login");
    }
    const provider = new HumanIdentityApprovalGateActorContextProvider(
      service,
      () => login.value.sessionCookie.value,
    );

    await expect(resolveTrustedHumanOwnerActor(provider)).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });
});
