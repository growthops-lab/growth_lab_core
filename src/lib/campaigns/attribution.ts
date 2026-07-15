import {
  AttributionSourceType,
  CampaignRiskSeverity,
  CampaignRiskType,
  DataConfidence,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function attributeRevenueToCampaign(input: {
  campaignId: string;
  mediaId: string;
  sourceType: AttributionSourceType;
  sourceId: string;
  pendingRevenue: number;
  approvedRevenue: number;
  conversionCount?: number;
  eventDate?: Date;
  allocationRate?: number;
}) {
  const allocationRate = input.allocationRate ?? 1;
  if (allocationRate <= 0 || allocationRate > 1) {
    throw new Error(
      "Campaign attribution allocationRate must be greater than 0 and at most 1.",
    );
  }

  const existingAttributions = await prisma.campaignRevenueAttribution.findMany(
    {
      where: {
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        NOT: { campaignId: input.campaignId },
      },
      select: { allocationRate: true },
    },
  );
  const existingRate = existingAttributions.reduce(
    (sum, item) => sum + item.allocationRate,
    0,
  );
  const remainingRate = Math.max(0, 1 - existingRate);
  const effectiveAllocationRate =
    process.env.CAMPAIGN_ROI_PREVENT_DOUBLE_COUNT === "true"
      ? Math.min(allocationRate, remainingRate)
      : allocationRate;

  if (effectiveAllocationRate <= 0) {
    await createDoubleCountRisk(
      input.campaignId,
      input.sourceType,
      input.sourceId,
      existingRate,
      allocationRate,
    );
    throw new Error(
      "Campaign attribution would exceed total allocationRate of 1.0 for the same source.",
    );
  }

  if (effectiveAllocationRate < allocationRate) {
    await createDoubleCountRisk(
      input.campaignId,
      input.sourceType,
      input.sourceId,
      existingRate,
      allocationRate,
    );
  }

  return prisma.campaignRevenueAttribution.upsert({
    where: {
      campaignId_sourceType_sourceId: {
        campaignId: input.campaignId,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
      },
    },
    update: {},
    create: {
      campaignId: input.campaignId,
      mediaId: input.mediaId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      allocationRate: effectiveAllocationRate,
      pendingRevenue: input.pendingRevenue * effectiveAllocationRate,
      approvedRevenue: input.approvedRevenue * effectiveAllocationRate,
      conversionCount: input.conversionCount ?? 0,
      eventDate: input.eventDate ?? new Date(),
      dataConfidence:
        effectiveAllocationRate < allocationRate
          ? DataConfidence.INSUFFICIENT
          : DataConfidence.LOW,
      doubleCountProtected:
        process.env.CAMPAIGN_ROI_PREVENT_DOUBLE_COUNT === "true",
      notes:
        effectiveAllocationRate < allocationRate
          ? `Allocation capped from ${allocationRate} to ${effectiveAllocationRate} to prevent double counting.`
          : undefined,
    },
  });
}

async function createDoubleCountRisk(
  campaignId: string,
  sourceType: AttributionSourceType,
  sourceId: string,
  existingRate: number,
  requestedRate: number,
) {
  const existingRisk = await prisma.campaignRisk.findFirst({
    where: {
      campaignId,
      riskType: CampaignRiskType.DOUBLE_COUNT_WARNING,
      status: "OPEN",
      description: { contains: `${sourceType}:${sourceId}` },
    },
  });
  if (existingRisk) return existingRisk;

  return prisma.campaignRisk.create({
    data: {
      campaignId,
      riskType: CampaignRiskType.DOUBLE_COUNT_WARNING,
      severity: CampaignRiskSeverity.WARNING,
      title: "Campaign revenue allocation warning",
      description: `${sourceType}:${sourceId} existing allocation=${existingRate}, requested=${requestedRate}.`,
    },
  });
}
