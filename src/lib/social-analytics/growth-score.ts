import { DataConfidence } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function calculateSocialGrowthScore(mediaId: string) {
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 28);

  const [postedCount, performance] = await Promise.all([
    prisma.socialPostQueue.count({ where: { mediaId, postedAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.socialPostPerformanceSnapshot.aggregate({
      where: { mediaId, snapshotDate: { gte: periodStart, lte: periodEnd } },
      _sum: { impressions: true, engagements: true, urlClicks: true }
    })
  ]);

  const postingScore = Math.min(25, postedCount * 3);
  const engagementScore = Math.min(25, Math.floor(Number(performance._sum.engagements ?? 0) / 5));
  const trafficScore = Math.min(20, Math.floor(Number(performance._sum.urlClicks ?? 0) / 2));
  const conversionScore = 10;
  const riskScore = 20;
  const totalScore = postingScore + engagementScore + trafficScore + conversionScore + riskScore;

  return prisma.socialGrowthScoreSnapshot.create({
    data: {
      mediaId,
      periodStart,
      periodEnd,
      postingScore,
      engagementScore,
      trafficScore,
      conversionScore,
      riskScore,
      totalScore,
      recommendation: totalScore >= 70 ? "Keep cadence and improve creative variants." : "Review hooks, timing, and article alignment before increasing volume.",
      dataConfidence: DataConfidence.INSUFFICIENT,
      reasoning: "Phase 9 MVP uses local/mock social data and never changes posting volume automatically."
    }
  });
}
