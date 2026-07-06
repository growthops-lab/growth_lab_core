import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { WordPressConfigError } from "@/src/lib/wordpress/errors";

const algorithm = "aes-256-gcm";

function getKey() {
  const secret = process.env.WORDPRESS_ENCRYPTION_KEY;
  if (!secret) {
    throw new WordPressConfigError("WORDPRESS_ENCRYPTION_KEYが未設定です。実WordPress接続は無効です。");
  }
  return scryptSync(secret, "growth-lab-wordpress", 32);
}

export function canEncryptWordPressSecrets() {
  return Boolean(process.env.WORDPRESS_ENCRYPTION_KEY);
}

export function encryptApplicationPassword(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptApplicationPassword(value: string) {
  const [iv, tag, encrypted] = value.split(".");
  if (!iv || !tag || !encrypted) {
    throw new WordPressConfigError("Application Passwordの暗号化形式が不正です。");
  }
  const decipher = createDecipheriv(algorithm, getKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final()
  ]).toString("utf8");
}
