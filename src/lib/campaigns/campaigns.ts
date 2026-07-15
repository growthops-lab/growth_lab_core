import {
  ApiEventType,
  CampaignStatus,
  CampaignType,
  Platform,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createCampaign(input: {
  mediaId: string;
  campaignName: string;
  campaignCode: string;
  campaignType: CampaignType;
  periodStart: Date;
  periodEnd: Date;
  owner?: string | null;
  primaryGoal?: string | null;
}) {
  if (input.periodStart > input.periodEnd) {
    throw new Error(
      "Campaign periodStart must be before or equal to periodEnd.",
    );
  }

  const campaign = await prisma.campaign.create({
    data: {
      mediaId: input.mediaId,
      campaignName: input.campaignName,
      campaignCode: input.campaignCode.trim(),
      campaignType: input.campaignType,
      status: CampaignStatus.PLANNING,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      owner: input.owner ?? "local-admin",
      primaryGoal: input.primaryGoal ?? null,
    },
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.REQUEST,
      endpoint: "campaign.create",
      requestType: RequestType.CAMPAIGN_CREATE,
      mockMode: true,
      message: `Campaign created: ${campaign.campaignCode}`,
    },
  });

  return campaign;
}
