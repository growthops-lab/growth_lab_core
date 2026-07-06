import { decryptApplicationPassword } from "@/src/lib/wordpress/encryption";
import { WordPressConfigError } from "@/src/lib/wordpress/errors";
import type { WordPressClientSite } from "@/src/lib/wordpress/types";

export function buildWordPressAuthHeader(site: WordPressClientSite) {
  if (!site.applicationPasswordEncrypted) {
    throw new WordPressConfigError("Application Passwordが未登録です。");
  }
  const password = decryptApplicationPassword(site.applicationPasswordEncrypted);
  const token = Buffer.from(`${site.username}:${password}`, "utf8").toString("base64");
  return `Basic ${token}`;
}
