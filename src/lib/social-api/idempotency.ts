import crypto from "node:crypto";
import type { Platform } from "@prisma/client";

export function createSocialPostIdempotencyKey(input: {
  platform: Platform;
  socialAccountId: string;
  postText: string;
  linkUrl?: string | null;
  scheduledAt?: Date | null;
}) {
  const normalized = [
    input.platform,
    input.socialAccountId,
    input.postText.trim().replace(/\s+/g, " "),
    input.linkUrl ?? "",
    input.scheduledAt?.toISOString() ?? ""
  ].join("|");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}
