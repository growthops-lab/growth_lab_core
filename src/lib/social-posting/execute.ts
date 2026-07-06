import {
  ApiEventType,
  Platform,
  RequestType,
  SocialPostCheckStatus,
  SocialPostExecutionStatus,
  SocialPostQueueStatus
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { runSocialPostSafetyGate } from "@/src/lib/social-api/safety-gate";
import { createMockXPost } from "@/src/lib/x-api/mock";
import { acquireSocialPostLock, releaseSocialPostLock } from "@/src/lib/social-posting/locks";

function realPostingEnabled() {
  return (
    process.env.SNS_REAL_POSTING_ENABLED === "true" &&
    process.env.SNS_POSTING_MOCK_MODE !== "true" &&
    process.env.X_API_ENABLED === "true" &&
    process.env.X_POSTING_ENABLED === "true" &&
    process.env.X_MOCK_MODE !== "true"
  );
}

async function ensureManualReview(queueId: string, reason: string) {
  const existing = await prisma.socialPostManualReview.findFirst({
    where: { socialPostQueueId: queueId, status: "OPEN" }
  });
  if (existing) return existing;
  return prisma.socialPostManualReview.create({
    data: { socialPostQueueId: queueId, reason }
  });
}

export async function executeSocialPostQueue(queueId: string, ownerId = "local-worker") {
  const locked = await acquireSocialPostLock(queueId, ownerId);
  if (!locked) return { status: "LOCKED" as const };

  try {
    const existing = await prisma.socialPostQueue.findUniqueOrThrow({ where: { id: queueId } });
    if (existing.queueStatus === SocialPostQueueStatus.POSTED && existing.platformPostId) {
      return { status: "ALREADY_POSTED" as const, platformPostUrl: existing.platformPostUrl };
    }
    if (existing.queueStatus === SocialPostQueueStatus.CANCELLED) {
      return { status: "CANCELLED" as const };
    }

    const queue = await prisma.socialPostQueue.update({
      where: { id: queueId },
      data: { queueStatus: SocialPostQueueStatus.PROCESSING, lockedAt: new Date(), processingStartedAt: new Date() },
      include: { socialApiConnection: true }
    });

    const safety = await runSocialPostSafetyGate(queue.id);
    if (safety.status === SocialPostCheckStatus.BLOCKED || safety.manualReviewRequired) {
      const executionStatus =
        safety.status === SocialPostCheckStatus.BLOCKED
          ? SocialPostExecutionStatus.BLOCKED
          : SocialPostExecutionStatus.MANUAL_REVIEW;
      const reason = safety.reasons.join(" ") || "Safety gate requires manual review.";
      await prisma.socialPostExecution.create({
        data: {
          socialPostQueueId: queue.id,
          socialApiConnectionId: queue.socialApiConnectionId,
          status: executionStatus,
          platform: queue.platform,
          requestIdempotencyKey: queue.requestIdempotencyKey,
          endpoint: "/2/tweets",
          errorMessage: reason,
          finishedAt: new Date()
        }
      });
      await ensureManualReview(queue.id, reason);
      await prisma.socialPostQueue.update({
        where: { id: queue.id },
        data: {
          queueStatus: SocialPostQueueStatus.MANUAL_REVIEW,
          manualReviewStatus: "OPEN",
          failureReason: reason,
          lockedAt: null
        }
      });
      return { status: executionStatus === SocialPostExecutionStatus.BLOCKED ? "BLOCKED" as const : "MANUAL_REVIEW" as const, reasons: safety.reasons };
    }

    if (!realPostingEnabled()) {
      const posted = await createMockXPost({ platform: Platform.X, text: queue.postText, linkUrl: queue.linkUrl });
      await prisma.socialPostExecution.create({
        data: {
          socialPostQueueId: queue.id,
          socialApiConnectionId: queue.socialApiConnectionId,
          status: SocialPostExecutionStatus.MOCK_POSTED,
          platform: Platform.X,
          requestIdempotencyKey: queue.requestIdempotencyKey,
          platformPostId: posted.platformPostId,
          platformPostUrl: posted.platformPostUrl,
          endpoint: "/2/tweets",
          httpStatus: 200,
          responseSummary: posted.responseSummary,
          finishedAt: new Date(),
          mockMode: true
        }
      });
      await prisma.socialPostQueue.update({
        where: { id: queue.id },
        data: {
          queueStatus: SocialPostQueueStatus.POSTED,
          platformPostId: posted.platformPostId,
          platformPostUrl: posted.platformPostUrl,
          postedAt: new Date(),
          lockedAt: null
        }
      });
      await prisma.apiUsageLog.create({
        data: {
          socialAccountId: queue.socialAccountId,
          platform: Platform.SOCIAL_POSTING,
          eventType: ApiEventType.DRY_RUN,
          endpoint: "/2/tweets",
          requestType: RequestType.X_MOCK_POST,
          mockMode: true,
          message: "Mock posting completed. Real X posting remains disabled."
        }
      });
      return { status: "MOCK_POSTED" as const, platformPostUrl: posted.platformPostUrl };
    }

    await prisma.socialPostExecution.create({
      data: {
        socialPostQueueId: queue.id,
        socialApiConnectionId: queue.socialApiConnectionId,
        status: SocialPostExecutionStatus.MANUAL_REVIEW,
        platform: Platform.X,
        requestIdempotencyKey: queue.requestIdempotencyKey,
        endpoint: "/2/tweets",
        errorMessage: "Real X posting client is not enabled in this MVP."
      }
    });
    await prisma.socialPostQueue.update({
      where: { id: queue.id },
      data: {
        queueStatus: SocialPostQueueStatus.MANUAL_REVIEW,
        manualReviewStatus: "OPEN",
        failureReason: "Real posting requires explicit API configuration.",
        lockedAt: null
      }
    });
    await ensureManualReview(queue.id, "Real posting requires explicit API configuration.");
    return { status: "MANUAL_REVIEW" as const };
  } finally {
    await releaseSocialPostLock(queueId);
  }
}
