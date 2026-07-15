import {
  BusinessInsightType,
  CampaignRecommendationType,
  Platform,
  ApiEventType,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createCampaignBusinessInsight(campaignId: string) {
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
  });
  const roi = await prisma.campaignRoiSnapshot.findFirst({
    where: { campaignId },
    orderBy: { createdAt: "desc" },
  });
  const conflictCount = await prisma.contentCalendarConflict.count({
    where: { campaignId, status: "OPEN" },
  });
  const lowRoi = (roi?.roiApproved ?? 0) < 0.2;
  const insightType =
    conflictCount > 0
      ? BusinessInsightType.CALENDAR_CONFLICT
      : lowRoi
        ? BusinessInsightType.LOW_ROI_CAMPAIGN
        : BusinessInsightType.HIGH_ROI_CAMPAIGN;
  const insight = await prisma.businessInsight.create({
    data: {
      mediaId: campaign.mediaId,
      campaignId,
      insightType,
      priority: conflictCount > 0 ? 10 : lowRoi ? 20 : 50,
      title:
        conflictCount > 0
          ? "Calendar conflicts need review"
          : lowRoi
            ? "Low ROI campaign needs review"
            : "High ROI campaign candidate",
      summary:
        "Phase 10 insight is advisory only and requires human review before action.",
      evidenceJson: { roiApproved: roi?.roiApproved ?? 0, conflictCount },
      recommendation:
        "Review campaign evidence and convert to tasks only after approval.",
      requiresHumanReview: true,
    },
  });

  await prisma.campaignRecommendation.create({
    data: {
      campaignId,
      recommendationType:
        conflictCount > 0
          ? CampaignRecommendationType.RESOLVE_CALENDAR_CONFLICT
          : CampaignRecommendationType.IMPROVE_CTA,
      priority: insight.priority,
      title: insight.title,
      description: insight.recommendation ?? insight.summary,
      sourceInsightId: insight.id,
      requiresHumanReview: true,
    },
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.BUSINESS_INSIGHT,
      eventType: ApiEventType.REQUEST,
      endpoint: "business-insight.create",
      requestType: RequestType.BUSINESS_INSIGHT_CREATE,
      mockMode: true,
    },
  });

  return insight;
}
