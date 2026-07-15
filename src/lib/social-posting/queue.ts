import {
  Platform,
  SocialPostApprovalStatus,
  SocialPostQueueStatus,
  SocialPostSourceType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSocialPostIdempotencyKey } from "@/src/lib/social-api/idempotency";
import { appendSocialUtm } from "@/src/lib/social-posting/utm";

export async function enqueueManualSocialPost(input: {
  mediaId: string;
  socialAccountId: string;
  postText: string;
  linkUrl?: string | null;
  scheduledAt?: Date | null;
  sourceType?: SocialPostSourceType;
  wordpressPostId?: string | null;
  creativeAssetId?: string | null;
}) {
  const linkUrl = appendSocialUtm(input.linkUrl, "growth_lab_phase9");
  const idempotencyKey = createSocialPostIdempotencyKey({
    platform: Platform.X,
    socialAccountId: input.socialAccountId,
    postText: input.postText,
    linkUrl,
    scheduledAt: input.scheduledAt,
  });

  return prisma.socialPostQueue.upsert({
    where: { requestIdempotencyKey: idempotencyKey },
    update: { scheduledAt: input.scheduledAt ?? null },
    create: {
      mediaId: input.mediaId,
      socialAccountId: input.socialAccountId,
      platform: Platform.X,
      sourceType: input.sourceType ?? SocialPostSourceType.MANUAL,
      wordpressPostId: input.wordpressPostId ?? null,
      creativeAssetId: input.creativeAssetId ?? null,
      queueStatus: input.scheduledAt
        ? SocialPostQueueStatus.SCHEDULED
        : SocialPostQueueStatus.READY,
      approvalStatus: SocialPostApprovalStatus.PENDING,
      postText: input.postText,
      linkUrl,
      destinationUrl: input.linkUrl ?? null,
      scheduledAt: input.scheduledAt ?? null,
      requestIdempotencyKey: idempotencyKey,
      madeWithAi: process.env.X_POST_DEFAULT_MADE_WITH_AI === "true",
      paidPartnership: process.env.X_POST_PAID_PARTNERSHIP_ENABLED === "true",
      utmCampaign: "growth_lab_phase9",
    },
  });
}

export async function approveSocialQueuedPost(
  queueId: string,
  reviewer = "local-admin",
) {
  await prisma.socialPostQueue.update({
    where: { id: queueId },
    data: { approvalStatus: SocialPostApprovalStatus.APPROVED },
  });
  return prisma.socialPostManualReview.create({
    data: {
      socialPostQueueId: queueId,
      status: "RESOLVED",
      reason: "Human approval recorded.",
      resolution: "approved",
      reviewer,
      resolvedAt: new Date(),
    },
  });
}
