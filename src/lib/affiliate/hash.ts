import crypto from "node:crypto";

export function hashIdentifier(value: string | null | undefined) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return null;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
