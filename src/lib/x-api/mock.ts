import crypto from "node:crypto";
import type { SocialPostPayload } from "@/src/lib/social-api/types";

export async function createMockXPost(payload: SocialPostPayload) {
  const platformPostId = `mock-x-${crypto.randomBytes(5).toString("hex")}`;
  return {
    platformPostId,
    platformPostUrl: `https://x.com/mock/status/${platformPostId}`,
    responseSummary: `Mock X post accepted: ${payload.text.slice(0, 80)}`
  };
}
