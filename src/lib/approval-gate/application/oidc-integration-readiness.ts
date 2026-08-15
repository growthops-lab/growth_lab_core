const ALLOWED_INPUT_KEYS = new Set([
  "issuer",
  "clientId",
  "redirectUri",
  "requiredClaims",
]);

const SECRET_INDICATING_KEYS = new Set([
  "clientsecret",
  "token",
  "privatekey",
  "credential",
  "password",
  "authorization",
]);

const PUBLIC_CLIENT_IDENTIFIER_PATTERN = /^[A-Za-z0-9._-]{1,255}$/;
const REQUIRED_CLAIM_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;

export type OidcIntegrationReadinessFailureCode =
  | "OIDC_INTEGRATION_READINESS_INVALID"
  | "OIDC_INTEGRATION_READINESS_SECRET_KEY_REJECTED";

export type OidcIntegrationReadinessResult =
  { ok: true } | { ok: false; code: OidcIntegrationReadinessFailureCode };

type SecretKeyInspection = "clean" | "secret-key" | "invalid";

function invalid(): OidcIntegrationReadinessResult {
  return { ok: false, code: "OIDC_INTEGRATION_READINESS_INVALID" };
}

function secretKeyRejected(): OidcIntegrationReadinessResult {
  return {
    ok: false,
    code: "OIDC_INTEGRATION_READINESS_SECRET_KEY_REJECTED",
  };
}

function normalizeKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function inspectSecretIndicatingKeys(
  value: unknown,
  visited = new WeakSet<object>(),
): SecretKeyInspection {
  if (value === null || typeof value !== "object") {
    return "clean";
  }

  if (visited.has(value)) {
    return "invalid";
  }
  visited.add(value);

  try {
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== "string") {
        return "invalid";
      }
      if (SECRET_INDICATING_KEYS.has(normalizeKey(key))) {
        return "secret-key";
      }

      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !("value" in descriptor)) {
        return "invalid";
      }

      const nested = inspectSecretIndicatingKeys(descriptor.value, visited);
      if (nested !== "clean") {
        return nested;
      }
    }
  } catch {
    return "invalid";
  }

  return "clean";
}

function readPlainDataRecord(value: unknown): Map<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  try {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return null;
    }

    const keys = Reflect.ownKeys(value);
    if (
      keys.length !== ALLOWED_INPUT_KEYS.size ||
      keys.some(
        (key) => typeof key !== "string" || !ALLOWED_INPUT_KEYS.has(key),
      )
    ) {
      return null;
    }

    const properties = new Map<string, unknown>();
    for (const key of keys) {
      if (typeof key !== "string") {
        return null;
      }

      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !("value" in descriptor)) {
        return null;
      }
      properties.set(key, descriptor.value);
    }

    return properties.size === ALLOWED_INPUT_KEYS.size ? properties : null;
  } catch {
    return null;
  }
}

function isDenseStringArray(value: unknown): value is readonly string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  try {
    const keys = Reflect.ownKeys(value);
    if (
      keys.length !== value.length + 1 ||
      !keys.includes("length") ||
      keys.some(
        (key) =>
          typeof key !== "string" ||
          (key !== "length" && !/^(0|[1-9][0-9]*)$/.test(key)),
      )
    ) {
      return false;
    }

    for (let index = 0; index < value.length; index += 1) {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (
        !descriptor ||
        !("value" in descriptor) ||
        typeof descriptor.value !== "string"
      ) {
        return false;
      }
    }
  } catch {
    return false;
  }

  return true;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
    return false;
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.length > 0 &&
      url.username.length === 0 &&
      url.password.length === 0
    );
  } catch {
    return false;
  }
}

function hasValidRequiredClaims(value: readonly string[]): boolean {
  if (value.length === 0) {
    return false;
  }

  const uniqueClaims = new Set<string>();
  for (const claim of value) {
    if (!REQUIRED_CLAIM_PATTERN.test(claim) || uniqueClaims.has(claim)) {
      return false;
    }
    uniqueClaims.add(claim);
  }

  return true;
}

export function validateOidcIntegrationReadiness(
  input: unknown,
): OidcIntegrationReadinessResult {
  const secretKeyInspection = inspectSecretIndicatingKeys(input);
  if (secretKeyInspection === "secret-key") {
    return secretKeyRejected();
  }
  if (secretKeyInspection === "invalid") {
    return invalid();
  }

  const properties = readPlainDataRecord(input);
  if (!properties) {
    return invalid();
  }

  const issuer = properties.get("issuer");
  const clientId = properties.get("clientId");
  const redirectUri = properties.get("redirectUri");
  const requiredClaims = properties.get("requiredClaims");

  if (
    !isHttpsUrl(issuer) ||
    typeof clientId !== "string" ||
    !PUBLIC_CLIENT_IDENTIFIER_PATTERN.test(clientId) ||
    !isHttpsUrl(redirectUri) ||
    !isDenseStringArray(requiredClaims) ||
    !hasValidRequiredClaims(requiredClaims)
  ) {
    return invalid();
  }

  return { ok: true };
}
