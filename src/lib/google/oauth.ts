import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export function isGoogleRealConnectionEnabled() {
  return process.env.GOOGLE_API_REAL_CONNECTION_ENABLED === "true";
}

export function googleScopes() {
  return (
    process.env.GOOGLE_OAUTH_SCOPES ??
    "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly"
  )
    .split(/\s+/)
    .filter(Boolean);
}

export function assertGoogleOAuthConfigured() {
  if (!isGoogleRealConnectionEnabled())
    throw new Error("Google real connection is disabled.");
  if (!process.env.GOOGLE_OAUTH_CLIENT_ID)
    throw new Error("GOOGLE_OAUTH_CLIENT_ID is not configured.");
  if (!process.env.GOOGLE_OAUTH_CLIENT_SECRET)
    throw new Error("GOOGLE_OAUTH_CLIENT_SECRET is not configured.");
  if (!process.env.GOOGLE_OAUTH_REDIRECT_URI)
    throw new Error("GOOGLE_OAUTH_REDIRECT_URI is not configured.");
  if (!process.env.GOOGLE_TOKEN_ENCRYPTION_KEY)
    throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY is not configured.");
}

function oauthStateSecret() {
  const secret =
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ??
    process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!secret) throw new Error("Google OAuth state secret is not configured.");
  return secret;
}

export function createGoogleOAuthState(mediaId: string) {
  const nonce = randomBytes(16).toString("hex");
  const payload = Buffer.from(
    JSON.stringify({ mediaId, nonce, issuedAt: Date.now() }),
    "utf8",
  ).toString("base64url");
  const signature = createHmac("sha256", oauthStateSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function parseGoogleOAuthState(value: string) {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) throw new Error("Invalid OAuth state.");
  const expectedSignature = createHmac("sha256", oauthStateSecret())
    .update(payload)
    .digest("base64url");
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
    throw new Error("Invalid OAuth state signature.");
  const parsed = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as {
    mediaId?: string;
    nonce?: string;
    issuedAt?: number;
  };
  if (!parsed.mediaId || !parsed.nonce || !parsed.issuedAt)
    throw new Error("Invalid OAuth state.");
  if (Date.now() - parsed.issuedAt > 15 * 60 * 1000)
    throw new Error("OAuth state expired.");
  return {
    mediaId: parsed.mediaId,
    nonce: parsed.nonce,
    issuedAt: parsed.issuedAt,
  };
}

export function buildGoogleOAuthUrl(mediaId: string) {
  assertGoogleOAuthConfigured();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "",
    response_type: "code",
    scope: googleScopes().join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: createGoogleOAuthState(mediaId),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
