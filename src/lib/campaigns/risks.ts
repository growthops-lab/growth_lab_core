import { CampaignRiskSeverity, CampaignRiskType, Platform, ApiEventType, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createCampaignRisk(campaignId: string, riskType: CampaignRiskType, title: string, description: string) {
  const risk = await prisma.campaignRisk.create({
    data: {
      campaignId,
      riskType,
      severity: riskType === "LOW_ROI" || riskType === "OVER_BUDGET" ? CampaignRiskSeverity.CRITICAL : CampaignRiskSeverity.WARNING,
      title,
      description
    }
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.REQUEST,
      endpoint: "campaign.risk.create",
      requestType: RequestType.CAMPAIGN_RISK_CREATE,
      mockMode: true
    }
  });

  return risk;
}
