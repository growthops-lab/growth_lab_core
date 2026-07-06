import { SocialPostCheckStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function checkSocialDuplicate(input: {
  socialAccountId: string;
  postText: string;
  linkUrl?: string | null;
  excludeQueueId?: string;
}) {
  const windowDays = Math.max(1, Number(process.env.SNS_DEDUP_WINDOW_DAYS ?? "14"));
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * windowDays);
  const duplicate = await prisma.socialPostQueue.findFirst({
    where: {
      id: input.excludeQueueId ? { not: input.excludeQueueId } : undefined,
      socialAccountId: input.socialAccountId,
      createdAt: { gte: since },
      postText: input.postText,
      linkUrl: input.linkUrl ?? null
    },
    select: { id: true }
  });

  return {
    status: duplicate ? SocialPostCheckStatus.WARNING : SocialPostCheckStatus.PASSED,
    reason: duplicate ? "Similar queued or posted content exists in the last 14 days." : null
  };
}
