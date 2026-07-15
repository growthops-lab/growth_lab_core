import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const algorithm = "aes-256-gcm";

export function canEncryptGoogleTokens() {
  return Boolean(process.env.GOOGLE_TOKEN_ENCRYPTION_KEY);
}

function getKey() {
  const secret = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY is required for real Google OAuth tokens.",
    );
  }
  return scryptSync(secret, "growth-lab-google", 32);
}

export function encryptGoogleToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptGoogleToken(value: string) {
  const [iv, tag, encrypted] = value.split(".");
  if (!iv || !tag || !encrypted)
    throw new Error("Invalid encrypted Google token format.");
  const decipher = createDecipheriv(
    algorithm,
    getKey(),
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
