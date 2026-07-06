import crypto from "node:crypto";
import { CanvaConfigError } from "@/src/lib/canva/errors";

const algorithm = "aes-256-gcm";

export function canEncryptCanvaSecrets() {
  return Boolean(process.env.CANVA_ENCRYPTION_KEY && process.env.CANVA_ENCRYPTION_KEY.length >= 32);
}

function keyBuffer() {
  const key = process.env.CANVA_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new CanvaConfigError("CANVA_ENCRYPTION_KEY is required for real Canva connections.");
  }
  return crypto.createHash("sha256").update(key).digest();
}

export function encryptCanvaToken(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}
