import { ApiEventType, GeneratedReportStatus, Platform, ReportType, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createReportGenerationKey } from "@/src/lib/reports/idempotency";
import { sanitizeReportJson, sanitizeReportText } from "@/src/lib/reports/sanitize";

export async function generateCampaignReport(campaignId: string) {
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
    include: { media: true }
  });
  const [roi, score, risks, recommendations] = await Promise.all([
    prisma.campaignRoiSnapshot.findFirst({ where: { campaignId }, orderBy: { createdAt: "desc" } }),
    prisma.campaignGrowthScoreSnapshot.findFirst({ where: { campaignId }, orderBy: { createdAt: "desc" } }),
    prisma.campaignRisk.findMany({ where: { campaignId, status: "OPEN" }, take: 10 }),
    prisma.campaignRecommendation.findMany({ where: { campaignId, status: "PROPOSED" }, take: 10 })
  ]);
  const periodStart = campaign.periodStart;
  const periodEnd = campaign.periodEnd;
  const generationKey = createReportGenerationKey({
    reportType: ReportType.CAMPAIGN_SUMMARY,
    campaignId,
    mediaId: campaign.mediaId,
    periodStart,
    periodEnd
  });
  const sourceSummary = sanitizeReportJson({
    roi: {
      pendingRevenue: Number(roi?.pendingRevenue ?? 0),
      approvedRevenue: Number(roi?.approvedRevenue ?? 0),
      actualCost: Number(roi?.actualCost ?? 0),
      roiPending: roi?.roiPending ?? 0,
      roiApproved: roi?.roiApproved ?? 0,
      dataConfidence: roi?.dataConfidence ?? "INSUFFICIENT",
      warnings: roi?.warnings ?? []
    },
    score: {
      totalScore: score?.totalScore ?? 0,
      contentScore: score?.contentScore ?? 0,
      seoScore: score?.seoScore ?? 0,
      snsScore: score?.snsScore ?? 0,
      revenueScore: score?.revenueScore ?? 0,
      roiScore: score?.roiScore ?? 0,
      riskScore: score?.riskScore ?? 0,
      dataConfidence: score?.dataConfidence ?? "INSUFFICIENT"
    },
    riskCount: risks.length,
    recommendationCount: recommendations.length,
    data_source: "local"
  });
  const markdown = sanitizeReportText(`# ${campaign.campaignName}\n\nApproved ROI: ${roi?.roiApproved ?? 0}\nPending revenue: ${roi?.pendingRevenue ?? 0}\nApproved revenue: ${roi?.approvedRevenue ?? 0}\nOpen risks: ${risks.length}\nRecommendations: ${recommendations.length}\n`);

  const report = await prisma.generatedReport.upsert({
    where: { generationKey },
    update: {},
    create: {
      mediaId: campaign.mediaId,
      campaignId,
      reportType: ReportType.CAMPAIGN_SUMMARY,
      status: GeneratedReportStatus.READY_FOR_REVIEW,
      periodStart,
      periodEnd,
      title: `${campaign.campaignName} Campaign Report`,
      summary: `Campaign report for ${campaign.media.name}.`,
      contentMarkdown: markdown,
      dataJson: sourceSummary,
      sourceSummaryJson: sourceSummary,
      generationKey,
      requiresHumanReview: true,
      sections: {
        create: [
          { sectionKey: "summary", sectionTitle: "Summary", sectionOrder: 1, contentMarkdown: markdown, dataJson: sourceSummary },
          { sectionKey: "next_actions", sectionTitle: "Next Actions", sectionOrder: 2, contentMarkdown: "Human review required before action.", dataJson: { recommendations: recommendations.map((item) => item.title) } }
        ]
      }
    }
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.REPORT,
      eventType: ApiEventType.REQUEST,
      endpoint: "report.generate",
      requestType: RequestType.REPORT_GENERATE,
      mockMode: true,
      message: `Generated report ${report.id}`
    }
  });

  return report;
}
