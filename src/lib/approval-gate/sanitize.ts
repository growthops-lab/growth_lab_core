const FORBIDDEN_KEY_FRAGMENTS = [
  "token",
  "password",
  "secret",
  "apikey",
  "clientsecret",
  "accesstoken",
  "refreshtoken",
  "authorizationheader",
  "bearertoken",
  "cookie",
  "recoverycode",
  "totp",
] as const;

export const MAX_APPROVAL_REFERENCE_LENGTH = 128;

const SAFE_APPROVAL_REFERENCE_PATTERN =
  /^[A-Za-z][A-Za-z0-9_]{0,31}-[A-Za-z0-9][A-Za-z0-9._-]{0,94}$/;

function normalizeKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function isSafeApprovalReference(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_APPROVAL_REFERENCE_LENGTH &&
    SAFE_APPROVAL_REFERENCE_PATTERN.test(value)
  );
}

export function findForbiddenKeys(value: unknown): string[] {
  const forbiddenKeys = new Set<string>();
  const visited = new WeakSet<object>();

  const visit = (candidate: unknown): void => {
    if (candidate === null || typeof candidate !== "object") {
      return;
    }

    if (visited.has(candidate)) {
      return;
    }

    visited.add(candidate);

    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }

    for (const [key, nestedValue] of Object.entries(candidate)) {
      const normalizedKey = normalizeKey(key);
      if (
        FORBIDDEN_KEY_FRAGMENTS.some((fragment) =>
          normalizedKey.includes(fragment),
        )
      ) {
        forbiddenKeys.add(key);
      }
      visit(nestedValue);
    }
  };

  visit(value);
  return [...forbiddenKeys].sort((left, right) => left.localeCompare(right));
}
