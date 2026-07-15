import {
  CampaignRecommendationType,
  Platform,
  ApiEventType,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createCampaignRecommendation(
  campaignId: string,
  input?: { title?: string; description?: string },
) {
  const recommendation = await prisma.campaignRecommendation.create({
    data: {
      campaignId,
      recommendationType: CampaignRecommendationType.IMPROVE_CTA,
      priority: 30,
      title: input?.title ?? "Review CTA and channel fit",
      description:
        input?.description ??
        "Campaign results should be reviewed by a human before creating article tasks or increasing social posting.",
      expectedImpact: "Better conversion quality after manual approval.",
      requiresHumanReview: true,
    },
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.REQUEST,
      endpoint: "campaign.recommendation.create",
      requestType: RequestType.CAMPAIGN_RECOMMENDATION_CREATE,
      mockMode: true,
    },
  });

  return recommendation;
}
