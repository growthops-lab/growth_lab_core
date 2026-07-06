import {
  SocialPostApprovalStatus,
  SocialPostCheckStatus,
  SocialPostQueueStatus,
  SocialRateLimitStatus
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkSocialDuplicate } from "@/src/lib/social-posting/dedup";
import { checkSocialPostRisk } from "@/src/lib/social-posting/risk-check";

export async function runSocialPostSafetyGate(queueId: string) {
  const queue = await prisma.socialPostQueue.findUniqueOrThrow({ where: { id: queueId } });
  const reasons: string[] = [];
  const risk = checkSocialPostRisk(queue.postText, queue.linkUrl);
  const duplicate = await checkSocialDuplicate({
    socialAccountId: queue.socialAccountId,
    postText: queue.postText,
    linkUrl: queue.linkUrl,
    excludeQueueId: queue.id
  });

  if (risk.reasons.length) reasons.push(...risk.reasons);
  if (duplicate.reason) reasons.push(duplicate.reason);
  if (queue.approvalStatus !== SocialPostApprovalStatus.APPROVED) reasons.push("Human approval is required before posting.");
  if (queue.rateLimitStatus !== SocialRateLimitStatus.OK) reasons.push("Rate limit status is not OK.");

  const linkCheckStatus = queue.linkUrl ? SocialPostCheckStatus.PASSED : SocialPostCheckStatus.WARNING;
  if (!queue.linkUrl) reasons.push("No destination link was found; manual review is recommended.");

  const blocked =
    risk.status === SocialPostCheckStatus.BLOCKED ||
    queue.approvalStatus !== SocialPostApprovalStatus.APPROVED ||
    queue.rateLimitStatus === SocialRateLimitStatus.RATE_LIMITED ||
    queue.rateLimitStatus === SocialRateLimitStatus.COOLDOWN;

  const manualReviewRequired = blocked || risk.status === SocialPostCheckStatus.WARNING || duplicate.status === SocialPostCheckStatus.WARNING;
  const status = blocked ? SocialPostCheckStatus.BLOCKED : manualReviewRequired ? SocialPostCheckStatus.WARNING : SocialPostCheckStatus.PASSED;
  const nextQueueStatus = blocked || manualReviewRequired ? SocialPostQueueStatus.MANUAL_REVIEW : queue.queueStatus;

  await prisma.socialPostSafetyCheck.create({
    data: {
      socialPostQueueId: queue.id,
      status,
      linkCheckStatus,
      riskCheckStatus: risk.status,
      dedupCheckStatus: duplicate.status,
      rateLimitStatus: queue.rateLimitStatus,
      approvalStatus: queue.approvalStatus,
      manualReviewRequired,
      reasons
    }
  });

  await prisma.socialPostQueue.update({
    where: { id: queue.id },
    data: {
      linkCheckStatus,
      riskCheckStatus: risk.status,
      dedupCheckStatus: duplicate.status,
      manualReviewStatus: manualReviewRequired ? "OPEN" : queue.manualReviewStatus,
      queueStatus: nextQueueStatus
    }
  });

  return { status, reasons, manualReviewRequired };
}
