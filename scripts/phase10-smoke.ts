import {
  CampaignItemType,
  CampaignType,
  ReportExportFormat,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createCampaignBusinessInsight } from "@/src/lib/business-insights/summary";
import { attributeRevenueToCampaign } from "@/src/lib/campaigns/attribution";
import { createCampaign } from "@/src/lib/campaigns/campaigns";
import { calculateCampaignGrowthScore } from "@/src/lib/campaigns/growth-score";
import { attachCampaignItem } from "@/src/lib/campaigns/items";
import { calculateCampaignRoi } from "@/src/lib/campaigns/roi";
import { createCalendarEvent } from "@/src/lib/content-calendar/events";
import { detectCalendarConflicts } from "@/src/lib/content-calendar/conflicts";
import { exportReport } from "@/src/lib/reports/export";
import { generateCampaignReport } from "@/src/lib/reports/generate";
import {
  sanitizeReportJson,
  sanitizeReportText,
} from "@/src/lib/reports/sanitize";

async function main() {
  const media = await prisma.media.findFirstOrThrow();
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 28);
  const campaign = await createCampaign({
    mediaId: media.id,
    campaignName: "Phase10 smoke campaign",
    campaignCode: `phase10-smoke-${Date.now()}`,
    campaignType: CampaignType.MULTI_CHANNEL,
    periodStart: start,
    periodEnd: end,
    owner: "smoke",
  });
  await prisma.campaignBudget.create({
    data: {
      campaignId: campaign.id,
      mediaId: media.id,
      budgetType: "CONTENT",
      plannedAmount: 5000,
    },
  });
  await prisma.campaignCost.create({
    data: {
      campaignId: campaign.id,
      mediaId: media.id,
      costType: "CONTENT",
      actualAmount: 3000,
      costDate: new Date(),
      source: "MOCK",
    },
  });
  const item = await attachCampaignItem({
    campaignId: campaign.id,
    itemType: CampaignItemType.WORDPRESS_POST,
    itemId: "smoke-item",
    itemTitle: "Smoke item",
  });
  const duplicate = await attachCampaignItem({
    campaignId: campaign.id,
    itemType: CampaignItemType.WORDPRESS_POST,
    itemId: "smoke-item",
    itemTitle: "Smoke item",
  });
  await attributeRevenueToCampaign({
    campaignId: campaign.id,
    mediaId: media.id,
    sourceType: "MOCK",
    sourceId: `smoke-revenue-${campaign.id}`,
    pendingRevenue: 4500,
    approvedRevenue: 3200,
  });
  const sharedSourceId = `shared-revenue-${campaign.id}`;
  await attributeRevenueToCampaign({
    campaignId: campaign.id,
    mediaId: media.id,
    sourceType: "MOCK",
    sourceId: sharedSourceId,
    pendingRevenue: 1000,
    approvedRevenue: 800,
    allocationRate: 0.8,
  });
  const secondCampaign = await createCampaign({
    mediaId: media.id,
    campaignName: "Phase10 smoke campaign allocation peer",
    campaignCode: `phase10-smoke-peer-${Date.now()}`,
    campaignType: CampaignType.MULTI_CHANNEL,
    periodStart: start,
    periodEnd: end,
    owner: "smoke",
  });
  const cappedAttribution = await attributeRevenueToCampaign({
    campaignId: secondCampaign.id,
    mediaId: media.id,
    sourceType: "MOCK",
    sourceId: sharedSourceId,
    pendingRevenue: 1000,
    approvedRevenue: 800,
    allocationRate: 0.5,
  });
  const roi = await calculateCampaignRoi(campaign.id);
  const score = await calculateCampaignGrowthScore(campaign.id);
  await createCalendarEvent({
    campaignId: campaign.id,
    mediaId: media.id,
    eventType: "SNS_POST",
    title: "Smoke SNS",
    scheduledAt: new Date(),
    approvalStatus: "PENDING",
    linkCheckStatus: "NOT_CHECKED",
    hasCreative: false,
  });
  const conflicts = await detectCalendarConflicts(campaign.id);
  const duplicateConflicts = await detectCalendarConflicts(campaign.id);
  const report = await generateCampaignReport(campaign.id);
  const exported = await exportReport(report.id, ReportExportFormat.JSON);
  const insight = await createCampaignBusinessInsight(campaign.id);
  const sanitizedText = sanitizeReportText(
    "access_token=abc123 password:super-secret",
  );
  const sanitizedJson = sanitizeReportJson({
    accessToken: "abc123",
    nested: { webhook: "https://example.com/hook" },
  });

  console.log(
    JSON.stringify({
      campaignCode: campaign.campaignCode,
      duplicateBlocked: item.id === duplicate.id,
      cappedAllocationRate: cappedAttribution.allocationRate,
      roiApproved: roi.roiApproved,
      score: score.totalScore,
      conflicts: conflicts.length,
      duplicateConflicts: duplicateConflicts.length,
      reportStatus: report.status,
      exportStatus: exported.status,
      insight: insight.insightType,
      sanitizedText,
      sanitizedJson,
    }),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
