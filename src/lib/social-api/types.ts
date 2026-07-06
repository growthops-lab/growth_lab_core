import type { Platform, SocialPostCheckStatus, SocialRateLimitStatus } from "@prisma/client";

export type SocialSafetyResult = {
  status: SocialPostCheckStatus;
  linkCheckStatus: SocialPostCheckStatus;
  riskCheckStatus: SocialPostCheckStatus;
  dedupCheckStatus: SocialPostCheckStatus;
  rateLimitStatus: SocialRateLimitStatus;
  manualReviewRequired: boolean;
  reasons: string[];
};

export type SocialPostPayload = {
  platform: Platform;
  text: string;
  linkUrl?: string | null;
  mediaIds?: string[];
};
