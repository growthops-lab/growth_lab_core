import {
  DataConfidence,
  SeoOpportunityType,
  SeoPriority,
  SeoRecommendationType,
  type PrismaClient,
} from "@prisma/client";

function priorityFromScore(score: number) {
  if (score >= 80) return SeoPriority.HIGH;
  if (score >= 55) return SeoPriority.MEDIUM;
  return SeoPriority.LOW;
}

function opportunityScore(input: {
  impressions: number;
  ctr: number;
  position: number;
  approvedRevenue: number;
  affiliateClicks: number;
}) {
  const ctrLowThreshold = Number(process.env.SEO_CTR_LOW_THRESHOLD ?? 0.02);
  const ctrGap = Math.max(0, ctrLowThreshold - input.ctr) * 1000;
  const positionPotential =
    input.position >= 4 && input.position <= 20 ? 25 : 0;
  const impressionPotential = Math.min(input.impressions / 40, 35);
  const revenuePotential = Math.min(input.approvedRevenue / 200, 25);
  const conversionPotential = input.affiliateClicks < 3 ? 15 : 0;
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        ctrGap +
          positionPotential +
          impressionPotential +
          revenuePotential +
          conversionPotential,
      ),
    ),
  );
}

function pageKey(value: string) {
  try {
    const url = new URL(value);
    return (
      `${url.pathname}${url.search}`.replace(/\/+$/, "").toLowerCase() || "/"
    );
  } catch {
    const normalized = value.startsWith("/") ? value : `/${value}`;
    return normalized.replace(/\/+$/, "").toLowerCase() || "/";
  }
}

export async function analyzeSeoForMedia(
  prisma: PrismaClient,
  input: { mediaId: string; start: Date; end: Date },
) {
  const [gscPages, gscQueryPages, ga4Pages, revenueEvents] = await Promise.all([
    prisma.searchConsolePageDaily.findMany({
      where: {
        mediaId: input.mediaId,
        date: { gte: input.start, lte: input.end },
      },
      include: { wordpressPost: true },
    }),
    prisma.searchConsoleQueryPageDaily.findMany({
      where: {
        mediaId: input.mediaId,
        date: { gte: input.start, lte: input.end },
      },
      include: { wordpressPost: true },
    }),
    prisma.gA4PageMetricDaily.findMany({
      where: {
        mediaId: input.mediaId,
        date: { gte: input.start, lte: input.end },
      },
    }),
    prisma.revenueEvent.findMany({
      where: {
        mediaId: input.mediaId,
        eventDate: { gte: input.start, lte: input.end },
      },
    }),
  ]);

  const pageMap = new Map<
    string,
    {
      wordpressPostId?: string | null;
      pageUrl: string;
      clicks: number;
      impressions: number;
      positionWeighted: number;
    }
  >();
  const addPageMetric = (row: {
    wordpressPostId?: string | null;
    pageUrl: string;
    clicks: number;
    impressions: number;
    position: number;
  }) => {
    const key = row.wordpressPostId ?? pageKey(row.pageUrl);
    const current = pageMap.get(key) ?? {
      wordpressPostId: row.wordpressPostId,
      pageUrl: row.pageUrl,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
    };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.positionWeighted += row.position * row.impressions;
    pageMap.set(key, current);
  };
  for (const row of gscPages) {
    addPageMetric(row);
  }
  if (pageMap.size === 0) {
    for (const row of gscQueryPages) {
      addPageMetric(row);
    }
  }

  const ga4ByPost = new Map<
    string,
    { sessions: number; affiliateClicks: number; conversions: number }
  >();
  for (const row of ga4Pages) {
    const key = row.wordpressPostId ?? pageKey(row.pagePath);
    const current = ga4ByPost.get(key) ?? {
      sessions: 0,
      affiliateClicks: 0,
      conversions: 0,
    };
    current.sessions += row.sessions;
    current.affiliateClicks += row.affiliateClicks;
    current.conversions += row.conversions;
    ga4ByPost.set(key, current);
  }

  const revenueByPost = new Map<string, number>();
  for (const event of revenueEvents) {
    if (!event.wordpressPostId) continue;
    revenueByPost.set(
      event.wordpressPostId,
      (revenueByPost.get(event.wordpressPostId) ?? 0) +
        Number(event.approvedReward),
    );
  }

  const opportunities = [];
  for (const page of pageMap.values()) {
    const ctr = page.impressions > 0 ? page.clicks / page.impressions : 0;
    const position =
      page.impressions > 0 ? page.positionWeighted / page.impressions : 0;
    const ga4 = ga4ByPost.get(page.wordpressPostId ?? page.pageUrl) ?? {
      sessions: 0,
      affiliateClicks: 0,
      conversions: 0,
    };
    const approvedRevenue = page.wordpressPostId
      ? (revenueByPost.get(page.wordpressPostId) ?? 0)
      : 0;
    const score = opportunityScore({
      impressions: page.impressions,
      ctr,
      position,
      approvedRevenue,
      affiliateClicks: ga4.affiliateClicks,
    });
    if (
      page.impressions >=
        Number(process.env.SEO_HIGH_IMPRESSION_THRESHOLD ?? 1000) &&
      ctr < Number(process.env.SEO_CTR_LOW_THRESHOLD ?? 0.02)
    ) {
      opportunities.push({
        wordpressPostId: page.wordpressPostId,
        type: SeoOpportunityType.HIGH_IMPRESSION_LOW_CTR,
        recommendationType: SeoRecommendationType.REWRITE_TITLE,
        priority: priorityFromScore(score),
        score,
        title: "High impressions with low CTR",
        description:
          "Rewrite the title and meta description after human review.",
        evidence: {
          impressions: page.impressions,
          clicks: page.clicks,
          ctr,
          position,
        },
        expectedImpact: "CTR improvement",
      });
    }
    if (
      position >= 8 &&
      position <= Number(process.env.SEO_POSITION_WARNING_THRESHOLD ?? 20)
    ) {
      opportunities.push({
        wordpressPostId: page.wordpressPostId,
        type: SeoOpportunityType.NEAR_TOP_10,
        recommendationType: SeoRecommendationType.ADD_H2_SECTION,
        priority: priorityFromScore(score),
        score,
        title: "Near top 10 ranking opportunity",
        description:
          "Add a focused section that matches the ranking query intent.",
        evidence: { impressions: page.impressions, ctr, position },
        expectedImpact: "Position improvement",
      });
    }
    if (ga4.sessions >= 100 && ga4.affiliateClicks < 3) {
      opportunities.push({
        wordpressPostId: page.wordpressPostId,
        type: SeoOpportunityType.NO_AFFILIATE_CTA,
        recommendationType: SeoRecommendationType.ADD_AFFILIATE_CTA,
        priority: priorityFromScore(score),
        score,
        title: "Organic traffic with weak affiliate clicks",
        description:
          "Review CTA placement inside WordPress. Do not add affiliate links to X.",
        evidence: {
          sessions: ga4.sessions,
          affiliateClicks: ga4.affiliateClicks,
          conversions: ga4.conversions,
        },
        expectedImpact: "Revenue improvement",
      });
    }
  }

  const pageValues = [...pageMap.values()];
  const totalClicks = pageValues.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = pageValues.reduce(
    (sum, row) => sum + row.impressions,
    0,
  );
  const organicSessions = ga4Pages.reduce((sum, row) => sum + row.sessions, 0);
  const averageCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const averagePosition =
    totalImpressions > 0
      ? pageValues.reduce((sum, row) => sum + row.positionWeighted, 0) /
        totalImpressions
      : 0;
  const dateSource = gscPages.length > 0 ? gscPages : gscQueryPages;
  const activeDays = new Set(
    dateSource.map((row) => row.date.toISOString().slice(0, 10)),
  ).size;
  const dataConfidence =
    activeDays >= 28
      ? DataConfidence.HIGH
      : activeDays >= 14
        ? DataConfidence.MEDIUM
        : activeDays >= 7
          ? DataConfidence.LOW
          : DataConfidence.INSUFFICIENT;
  const queryMap = new Map<
    string,
    {
      query: string;
      clicks: number;
      impressions: number;
      positionWeighted: number;
    }
  >();
  for (const row of gscQueryPages) {
    const key = row.query.toLowerCase();
    const current = queryMap.get(key) ?? {
      query: row.query,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
    };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.positionWeighted += row.position * row.impressions;
    queryMap.set(key, current);
  }

  return {
    totalClicks,
    totalImpressions,
    averageCtr,
    averagePosition,
    organicSessions,
    opportunities,
    dataConfidence,
    topQueries: [...queryMap.values()]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map((row) => ({
        query: row.query,
        clicks: row.clicks,
        impressions: row.impressions,
        position:
          row.impressions > 0 ? row.positionWeighted / row.impressions : 0,
      })),
    topPages: pageValues
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map((row) => ({
        pageUrl: row.pageUrl,
        clicks: row.clicks,
        impressions: row.impressions,
      })),
    summary: `${opportunities.length} SEO opportunities found. Human review is required before changes.`,
  };
}
