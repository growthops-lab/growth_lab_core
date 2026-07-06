import { DataConfidence, Platform, SocialPerformanceSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createMockSocialPerformanceSnapshot(queueId: string) {
  const queue = await prisma.socialPostQueue.findUniqueOrThrow({ where: { id: queueId } });
  const impressions = 420 + Math.floor(Math.random() * 300);
  const engagements = 18 + Math.floor(Math.random() * 40);
  return prisma.socialPostPerformanceSnapshot.create({
    data: {
      socialPostQueueId: queue.id,
      postId: queue.postId,
      socialAccountId: queue.socialAccountId,
      mediaId: queue.mediaId,
      platform: Platform.X,
      platformPostId: queue.platformPostId,
      snapshotDate: new Date(),
      impressions,
      engagements,
      likes: Math.max(1, Math.floor(engagements * 0.6)),
      reposts: Math.floor(engagements * 0.15),
      replies: Math.floor(engagements * 0.1),
      urlClicks: Math.floor(engagements * 0.25),
      engagementRate: impressions > 0 ? engagements / impressions : 0,
      source: SocialPerformanceSource.MOCK,
      dataConfidence: DataConfidence.INSUFFICIENT
    }
  });
}
