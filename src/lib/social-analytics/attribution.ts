import { DataConfidence, SocialPerformanceSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function calculateMockSocialAttribution(queueId: string) {
  const queue = await prisma.socialPostQueue.findUniqueOrThrow({ where: { id: queueId } });
  return prisma.socialPostAttribution.create({
    data: {
      socialPostQueueId: queue.id,
      mediaId: queue.mediaId,
      wordpressPostId: queue.wordpressPostId,
      date: new Date(),
      sessions: 12,
      conversions: 1,
      approvedRevenue: 600,
      source: SocialPerformanceSource.MOCK,
      dataConfidence: DataConfidence.INSUFFICIENT
    }
  });
}
