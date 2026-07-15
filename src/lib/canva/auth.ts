import crypto from "node:crypto";

export function createCanvaPkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}

export function createCanvaOAuthState() {
  return crypto.randomBytes(24).toString("base64url");
}
