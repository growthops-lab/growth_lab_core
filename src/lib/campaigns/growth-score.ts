import {
  ApiEventType,
  DataConfidence,
  Platform,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function calculateCampaignGrowthScore(campaignId: string) {
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
  });
  const [items, risks, latestRoi] = await Promise.all([
    prisma.campaignItem.count({ where: { campaignId } }),
    prisma.campaignRisk.count({ where: { campaignId, status: "OPEN" } }),
    prisma.campaignRoiSnapshot.findFirst({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const contentScore = Math.min(20, items * 4);
  const revenueScore = Math.min(
    20,
    Math.floor(Number(latestRoi?.approvedRevenue ?? 0) / 500),
  );
  const roiScore = Math.max(
    0,
    Math.min(20, Math.round((latestRoi?.roiApproved ?? 0) * 20)),
  );
  const riskScore = Math.max(0, 20 - risks * 5);
  const totalScore =
    contentScore + 10 + 10 + revenueScore + roiScore + 10 + riskScore;

  const snapshot = await prisma.campaignGrowthScoreSnapshot.create({
    data: {
      campaignId,
      mediaId: campaign.mediaId,
      periodStart: campaign.periodStart,
      periodEnd: campaign.periodEnd,
      contentScore,
      seoScore: 10,
      snsScore: 10,
      revenueScore,
      roiScore,
      executionScore: 10,
      riskScore,
      totalScore,
      dataConfidence: DataConfidence.LOW,
      reasoning:
        "Phase 10 MVP score uses local campaign items, ROI snapshots, and open risks. It never changes budget or posting volume automatically.",
    },
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.REQUEST,
      endpoint: "campaign.growth-score.calculate",
      requestType: RequestType.CAMPAIGN_GROWTH_SCORE_CALCULATE,
      mockMode: true,
    },
  });

  return snapshot;
}
