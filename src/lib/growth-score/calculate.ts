import { DataConfidence, type PrismaClient } from "@prisma/client";
import { summarizeRevenue } from "@/src/lib/affiliate/revenue";
import { confidenceWarnings } from "@/src/lib/growth-score/confidence";
import { recommendationForScore, recommendationTitle } from "@/src/lib/growth-score/recommendation";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function calculateGrowthScore(prisma: PrismaClient, input: { mediaId: string; start: Date; end: Date }) {
  const [summary, contentCount, postCount, trafficDays] = await Promise.all([
    summarizeRevenue(prisma, input),
    prisma.wordPressPost.count({ where: { mediaId: input.mediaId } }),
    prisma.post.count({ where: { mediaId: input.mediaId } }),
    prisma.trafficMetricDaily.findMany({
      where: { mediaId: input.mediaId, metricDate: { gte: input.start, lte: input.end } },
      select: { metricDate: true, impressions: true, linkClicks: true }
    })
  ]);

  const activeDays = new Set(trafficDays.map((item) => item.metricDate.toISOString().slice(0, 10))).size;
  const trafficTotal = trafficDays.reduce((sum, item) => sum + item.impressions, 0);
  const trafficScore = clampScore(Math.min(trafficTotal / 100, 100));
  const revenueScore = clampScore(summary.approvedRevenue > 0 ? Math.min(summary.approvedRevenue / 100, 100) : summary.estimatedRevenue / 200);
  const conversionScore = clampScore((summary.cvr ?? 0) * 1000 + summary.approvedConversions * 8);
  const contentScore = clampScore(contentCount * 12 + postCount * 2);
  const riskScore = clampScore(summary.rejectedConversions > summary.approvedConversions ? 30 : 80);
  const weighted =
    trafficScore * 0.2 + revenueScore * 0.3 + conversionScore * 0.2 + contentScore * 0.15 + riskScore * 0.15;
  const confidencePenalty =
    summary.dataConfidence === DataConfidence.INSUFFICIENT
      ? 20
      : summary.dataConfidence === DataConfidence.LOW
        ? 10
        : summary.dataConfidence === DataConfidence.MEDIUM
          ? 4
          : 0;
  const warnings = confidenceWarnings(summary.dataConfidence, activeDays);
  if (summary.pendingRevenue > summary.approvedRevenue * 2 && summary.pendingRevenue > 0) {
    warnings.push("Pending revenue is much larger than approved revenue.");
  }
  if (summary.operatingCost === 0) {
    warnings.push("Operating cost is not registered.");
  }
  const totalScore = clampScore(weighted - confidencePenalty);
  const recommendation = recommendationForScore(totalScore, warnings);

  return {
    trafficScore,
    revenueScore,
    conversionScore,
    contentScore,
    riskScore,
    totalScore,
    recommendation,
    dataConfidence: summary.dataConfidence,
    dataWarnings: warnings,
    reasoning: `${recommendationTitle(recommendation)} based on approved revenue, traffic, content volume, and risk signals.`,
    summary
  };
}
