import { ApiEventType, DataConfidence, Platform, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function calculateCampaignRoi(campaignId: string) {
  const campaign = await prisma.campaign.findUniqueOrThrow({ where: { id: campaignId } });
  const [budget, costs, revenue] = await Promise.all([
    prisma.campaignBudget.aggregate({ where: { campaignId }, _sum: { plannedAmount: true } }),
    prisma.campaignCost.aggregate({ where: { campaignId }, _sum: { actualAmount: true } }),
    prisma.campaignRevenueAttribution.aggregate({
      where: { campaignId },
      _sum: { pendingRevenue: true, approvedRevenue: true, conversionCount: true }
    })
  ]);

  const plannedCost = Number(budget._sum.plannedAmount ?? 0);
  const actualCost = Number(costs._sum.actualAmount ?? 0);
  const pendingRevenue = Number(revenue._sum.pendingRevenue ?? 0);
  const approvedRevenue = Number(revenue._sum.approvedRevenue ?? 0);
  const costBase = actualCost > 0 ? actualCost : plannedCost;
  const profitPending = pendingRevenue - costBase;
  const profitApproved = approvedRevenue - costBase;
  const roiPending = costBase > 0 ? profitPending / costBase : 0;
  const roiApproved = costBase > 0 ? profitApproved / costBase : 0;
  const warnings = [];
  if (actualCost === 0) warnings.push("actual_cost_missing");
  if (approvedRevenue === 0 && pendingRevenue > 0) warnings.push("approved_revenue_low_pending_high");

  const calculationKey = [
    campaign.id,
    campaign.periodStart.toISOString().slice(0, 10),
    campaign.periodEnd.toISOString().slice(0, 10),
    pendingRevenue,
    approvedRevenue,
    actualCost,
    plannedCost
  ].join(":");

  const snapshot = await prisma.campaignRoiSnapshot.upsert({
    where: { calculationKey },
    update: {},
    create: {
      campaignId: campaign.id,
      mediaId: campaign.mediaId,
      periodStart: campaign.periodStart,
      periodEnd: campaign.periodEnd,
      pendingRevenue,
      approvedRevenue,
      plannedCost,
      actualCost,
      profitPending,
      profitApproved,
      roiPending,
      roiApproved,
      dataConfidence: actualCost > 0 && approvedRevenue > 0 ? DataConfidence.MEDIUM : DataConfidence.LOW,
      calculationKey,
      warnings
    }
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.REQUEST,
      endpoint: "campaign.roi.calculate",
      requestType: RequestType.CAMPAIGN_ROI_CALCULATE,
      mockMode: true,
      message: `Campaign ROI calculated for ${campaign.campaignCode}`
    }
  });

  return snapshot;
}
