import {
  ApiEventType,
  ArticleImprovementStatus,
  DataConfidence,
  Platform,
  RequestType,
  SeoImpactStatus,
  SeoImpactVerdict,
  type PrismaClient,
} from "@prisma/client";

function daysBetween(start: Date, end: Date) {
  return Math.max(
    0,
    Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1,
  );
}

function aggregateCtr(clicks: number, impressions: number) {
  return impressions > 0 ? clicks / impressions : 0;
}

function verdict(
  beforeClicks: number,
  afterClicks: number,
  beforeImpressions: number,
  afterImpressions: number,
) {
  if (afterClicks > beforeClicks && afterImpressions >= beforeImpressions * 0.8)
    return SeoImpactVerdict.IMPROVED;
  if (
    afterClicks < beforeClicks * 0.8 &&
    afterImpressions < beforeImpressions * 0.8
  )
    return SeoImpactVerdict.DECLINED;
  if (afterClicks === beforeClicks && afterImpressions === beforeImpressions)
    return SeoImpactVerdict.NO_CHANGE;
  return SeoImpactVerdict.MIXED;
}

export async function createSeoImpactMeasurement(
  prisma: PrismaClient,
  articleImprovementTaskId: string,
) {
  const task = await prisma.articleImprovementTask.findUniqueOrThrow({
    where: { id: articleImprovementTaskId },
  });
  const now = new Date();
  const beforeDays = Number(process.env.SEO_IMPACT_DEFAULT_DAYS_BEFORE ?? 28);
  const afterDays = Number(process.env.SEO_IMPACT_DEFAULT_DAYS_AFTER ?? 28);
  const minAfterDays = Number(process.env.SEO_IMPACT_MIN_DAYS_AFTER ?? 7);
  const latestDraftUpdate = await prisma.wordPressDraftUpdate.findFirst({
    where: {
      rewriteDraft: { articleImprovementTaskId: task.id },
      status: { in: ["MOCK_UPDATED", "UPDATED"] },
    },
    orderBy: { createdAt: "desc" },
  });
  const afterStart = latestDraftUpdate
    ? new Date(latestDraftUpdate.createdAt)
    : new Date(now);
  afterStart.setHours(0, 0, 0, 0);
  const afterEndLimit = new Date(afterStart);
  afterEndLimit.setDate(afterEndLimit.getDate() + afterDays - 1);
  const afterEnd = afterEndLimit < now ? afterEndLimit : now;
  const beforeEnd = new Date(afterStart);
  beforeEnd.setDate(beforeEnd.getDate() - 1);
  const beforeStart = new Date(beforeEnd);
  beforeStart.setDate(beforeStart.getDate() - beforeDays + 1);

  const [
    beforeGsc,
    afterGsc,
    beforeGa4,
    afterGa4,
    beforeRevenue,
    afterRevenue,
  ] = await Promise.all([
    prisma.searchConsolePageDaily.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        date: { gte: beforeStart, lte: beforeEnd },
      },
      _sum: { clicks: true, impressions: true },
      _avg: { position: true },
    }),
    prisma.searchConsolePageDaily.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        date: { gte: afterStart, lte: afterEnd },
      },
      _sum: { clicks: true, impressions: true },
      _avg: { position: true },
    }),
    prisma.gA4PageMetricDaily.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        date: { gte: beforeStart, lte: beforeEnd },
      },
      _sum: { sessions: true, affiliateClicks: true, conversions: true },
    }),
    prisma.gA4PageMetricDaily.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        date: { gte: afterStart, lte: afterEnd },
      },
      _sum: { sessions: true, affiliateClicks: true, conversions: true },
    }),
    prisma.revenueEvent.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        eventDate: { gte: beforeStart, lte: beforeEnd },
        status: "APPROVED",
      },
      _sum: { approvedReward: true },
    }),
    prisma.revenueEvent.aggregate({
      where: {
        mediaId: task.mediaId,
        wordpressPostId: task.wordpressPostId,
        eventDate: { gte: afterStart, lte: afterEnd },
        status: "APPROVED",
      },
      _sum: { approvedReward: true },
    }),
  ]);

  const beforeClicks = beforeGsc._sum.clicks ?? 0;
  const afterClicks = afterGsc._sum.clicks ?? 0;
  const beforeImpressions = beforeGsc._sum.impressions ?? 0;
  const afterImpressions = afterGsc._sum.impressions ?? 0;
  const afterEnoughDays =
    Boolean(latestDraftUpdate) &&
    daysBetween(afterStart, afterEnd) >= minAfterDays;
  const minClicks = Number(process.env.SEO_IMPACT_MIN_CLICKS ?? 20);
  const minImpressions = Number(process.env.SEO_IMPACT_MIN_IMPRESSIONS ?? 500);
  const dataConfidence =
    !afterEnoughDays ||
    afterClicks + beforeClicks < minClicks ||
    afterImpressions + beforeImpressions < minImpressions
      ? DataConfidence.LOW
      : DataConfidence.MEDIUM;
  const status = !afterEnoughDays
    ? SeoImpactStatus.INSUFFICIENT_DATA
    : SeoImpactStatus.COMPLETED;
  const measurement = await prisma.seoImpactMeasurement.create({
    data: {
      articleImprovementTaskId: task.id,
      mediaId: task.mediaId,
      wordpressPostId: task.wordpressPostId,
      status,
      verdict:
        status === SeoImpactStatus.INSUFFICIENT_DATA
          ? SeoImpactVerdict.INSUFFICIENT_DATA
          : verdict(
              beforeClicks,
              afterClicks,
              beforeImpressions,
              afterImpressions,
            ),
      beforeStart,
      beforeEnd,
      afterStart,
      afterEnd,
      beforeClicks,
      afterClicks,
      beforeImpressions,
      afterImpressions,
      beforeCtr: aggregateCtr(beforeClicks, beforeImpressions),
      afterCtr: aggregateCtr(afterClicks, afterImpressions),
      beforeAveragePosition: beforeGsc._avg.position ?? 0,
      afterAveragePosition: afterGsc._avg.position ?? 0,
      beforeOrganicSessions: beforeGa4._sum.sessions ?? 0,
      afterOrganicSessions: afterGa4._sum.sessions ?? 0,
      beforeAffiliateClicks: beforeGa4._sum.affiliateClicks ?? 0,
      afterAffiliateClicks: afterGa4._sum.affiliateClicks ?? 0,
      beforeConversions: beforeGa4._sum.conversions ?? 0,
      afterConversions: afterGa4._sum.conversions ?? 0,
      beforeApprovedRevenue: beforeRevenue._sum.approvedReward ?? 0,
      afterApprovedRevenue: afterRevenue._sum.approvedReward ?? 0,
      dataConfidence,
      summary:
        status === SeoImpactStatus.INSUFFICIENT_DATA
          ? "After period is not long enough for reliable impact measurement."
          : "SEO impact measurement calculated.",
    },
  });
  await prisma.articleImprovementTask.update({
    where: { id: task.id },
    data: {
      status:
        status === SeoImpactStatus.INSUFFICIENT_DATA
          ? ArticleImprovementStatus.MEASURING
          : ArticleImprovementStatus.DONE,
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.IMPACT_MEASUREMENT,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.IMPACT_MEASUREMENT_CALCULATE,
      endpoint: "impact-measurement/seo",
      method: "CREATE",
      success: true,
      mockMode: true,
      message: measurement.summary,
    },
  });
  return measurement;
}
