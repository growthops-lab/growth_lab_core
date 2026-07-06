"use server";

import {
  ApiEventType,
  DataConfidence,
  GoogleConnectionStatus,
  GooglePropertyStatus,
  GrowthRecommendationType,
  Platform,
  RequestType,
  SearchConsolePropertyType,
  SeoApprovalStatus,
  SeoActionStatus,
  SeoDataSource,
  SeoImportSource,
  SeoImportStatus,
  SeoImportType,
  SeoOpportunityStatus,
  SeoRecommendationType,
  SearchDevice,
  SearchType
} from "@prisma/client";
import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseCsvRows, toDate, toNumber } from "@/src/lib/seo/csv";
import { analyzeSeoForMedia } from "@/src/lib/seo/analyze";

function normalizeKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function periodRange(days: number) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function pagePathFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function normalizePageKey(value: string) {
  const normalized = pagePathFromUrl(value).replace(/\/+$/, "");
  return (normalized || "/").toLowerCase();
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function stableId(prefix: string, values: Array<string | number | null | undefined>) {
  const hash = createHash("sha256")
    .update(values.map((value) => String(value ?? "")).join("\u001f"))
    .digest("hex")
    .slice(0, 24);
  return `${prefix}-${hash}`;
}

async function loadWordPressPosts(mediaId: string) {
  return prisma.wordPressPost.findMany({
    where: { mediaId },
    select: { id: true, slug: true, wordpressPostUrl: true }
  });
}

function findWordPressPostInList(posts: Awaited<ReturnType<typeof loadWordPressPosts>>, pageValue: string) {
  const normalized = pagePathFromUrl(pageValue);
  return (
    posts.find((post) => post.wordpressPostUrl && normalizePageKey(post.wordpressPostUrl) === normalizePageKey(normalized)) ??
    posts.find((post) => normalizePageKey(normalized).includes(post.slug.toLowerCase())) ??
    null
  );
}

async function assertGA4PropertyBelongsToMedia(mediaId: string, ga4PropertyId: string | null) {
  if (!ga4PropertyId) return;
  const property = await prisma.gA4Property.findUnique({ where: { id: ga4PropertyId }, select: { mediaId: true } });
  if (!property) throw new Error("GA4 property was not found.");
  if (property.mediaId !== mediaId) throw new Error("GA4 property belongs to a different media.");
}

async function assertSearchConsolePropertyBelongsToMedia(mediaId: string, searchConsolePropertyId: string | null) {
  if (!searchConsolePropertyId) return;
  const property = await prisma.searchConsoleProperty.findUnique({
    where: { id: searchConsolePropertyId },
    select: { mediaId: true }
  });
  if (!property) throw new Error("Search Console property was not found.");
  if (property.mediaId !== mediaId) throw new Error("Search Console property belongs to a different media.");
}

function importStatus(successRows: number, failedRows: number) {
  if (successRows === 0 && failedRows > 0) return SeoImportStatus.FAILED;
  return failedRows > 0 ? SeoImportStatus.COMPLETED_WITH_WARNINGS : SeoImportStatus.COMPLETED;
}

function normalizedSearchDevice(value: string | undefined) {
  const normalized = String(value || "UNKNOWN").trim().toUpperCase().replace(/[\s-]+/g, "_");
  return z.nativeEnum(SearchDevice).catch(SearchDevice.UNKNOWN).parse(normalized);
}

function normalizedSearchType(value: string | undefined) {
  const raw = String(value || "WEB").trim();
  const normalized = raw === "googleNews" ? "GOOGLE_NEWS" : raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (normalized === "GOOGLENEWS") return SearchType.GOOGLE_NEWS;
  return z.nativeEnum(SearchType).catch(SearchType.WEB).parse(normalized);
}

function parsePeriodDays(value: FormDataEntryValue | null) {
  const defaultDays = Number(process.env.SEO_DEFAULT_PERIOD_DAYS ?? 28);
  const minDays = Number(process.env.SEO_MIN_DATA_DAYS ?? 7);
  return z.coerce.number().int().min(minDays).max(365).catch(defaultDays).parse(value);
}

export async function connectGoogleMock(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const connectionName = z.string().trim().min(1).parse(formData.get("connectionName"));
  const googleAccountEmail = String(formData.get("googleAccountEmail") ?? "mock-google@growth-lab.local").trim();
  const existing = await prisma.googleConnection.findFirst({ where: { mediaId, connectionName, googleAccountEmail } });
  if (existing) {
    await prisma.googleConnection.update({
      where: { id: existing.id },
      data: {
        scopes: "analytics.readonly webmasters.readonly",
        connectionStatus: GoogleConnectionStatus.MOCK_CONNECTED,
        mockMode: true,
        lastConnectedAt: new Date(),
        lastError: null
      }
    });
  } else {
    await prisma.googleConnection.create({
      data: {
        mediaId,
        connectionName,
        googleAccountEmail,
        scopes: "analytics.readonly webmasters.readonly",
        connectionStatus: GoogleConnectionStatus.MOCK_CONNECTED,
        mockMode: true,
        lastConnectedAt: new Date()
      }
    });
  }
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ANALYTICS,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.GOOGLE_MOCK_CONNECT,
      endpoint: "local/google/mock-connect",
      method: "POST",
      mockMode: true,
      message: "Google mock connection created"
    }
  });
  revalidatePath("/");
}

export async function createGA4Property(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const googleConnectionId = String(formData.get("googleConnectionId") ?? "").trim() || null;
  const propertyName = z.string().trim().min(1).parse(formData.get("propertyName"));
  const propertyId = z.string().trim().min(1).parse(formData.get("propertyId"));
  if (googleConnectionId) {
    const connection = await prisma.googleConnection.findUniqueOrThrow({ where: { id: googleConnectionId } });
    if (connection.mediaId !== mediaId) throw new Error("Google connection belongs to a different media.");
  }
  await prisma.gA4Property.upsert({
    where: { mediaId_propertyId: { mediaId, propertyId } },
    update: {
      propertyName,
      propertyDisplayName: String(formData.get("propertyDisplayName") ?? propertyName),
      defaultUrl: String(formData.get("defaultUrl") ?? "").trim() || null,
      googleConnectionId,
      connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
      mockMode: true
    },
    create: {
      mediaId,
      googleConnectionId,
      propertyName,
      propertyId,
      propertyDisplayName: String(formData.get("propertyDisplayName") ?? propertyName),
      defaultUrl: String(formData.get("defaultUrl") ?? "").trim() || null,
      connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
      mockMode: true
    }
  });
  revalidatePath("/");
}

export async function createSearchConsoleProperty(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const googleConnectionId = String(formData.get("googleConnectionId") ?? "").trim() || null;
  const siteUrl = z.string().trim().url().parse(formData.get("siteUrl"));
  if (googleConnectionId) {
    const connection = await prisma.googleConnection.findUniqueOrThrow({ where: { id: googleConnectionId } });
    if (connection.mediaId !== mediaId) throw new Error("Google connection belongs to a different media.");
  }
  await prisma.searchConsoleProperty.upsert({
    where: { mediaId_siteUrl: { mediaId, siteUrl } },
    update: {
      googleConnectionId,
      propertyType: z.nativeEnum(SearchConsolePropertyType).parse(formData.get("propertyType") ?? "URL_PREFIX"),
      connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
      mockMode: true
    },
    create: {
      mediaId,
      googleConnectionId,
      siteUrl,
      propertyType: z.nativeEnum(SearchConsolePropertyType).parse(formData.get("propertyType") ?? "URL_PREFIX"),
      connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
      mockMode: true
    }
  });
  revalidatePath("/");
}

export async function importGA4Csv(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const ga4PropertyId = String(formData.get("ga4PropertyId") ?? "").trim() || null;
  await assertGA4PropertyBelongsToMedia(mediaId, ga4PropertyId);
  const csvText = z.string().min(1).parse(formData.get("csvText"));
  const parsed = parseCsvRows<Record<string, string>>(csvText);
  const batch = await prisma.seoImportBatch.create({
    data: {
      mediaId,
      importSource: SeoImportSource.GA4,
      importType: SeoImportType.GA4_PAGES_CSV,
      fileName: String(formData.get("fileName") ?? "ga4-pages.csv"),
      totalRows: parsed.rows.length,
      status: "PROCESSING"
    }
  });
  let successRows = 0;
  let failedRows = 0;
  const posts = await loadWordPressPosts(mediaId);
  const totalsByDate = new Map<string, {
    date: Date;
    sessions: number;
    users: number;
    activeUsers: number;
    views: number;
    screenPageViews: number;
    engagedSessions: number;
    conversions: number;
    totalRevenue: number;
  }>();
  for (const [index, row] of parsed.rows.entries()) {
    const date = toDate(row.date);
    const rawPage = String(row.page_path || row.page || row.page_url || row.page_location || "").trim();
    const pagePath = rawPage ? pagePathFromUrl(rawPage) : "";
    if (!date || !pagePath) {
      failedRows += 1;
      await prisma.seoImportRowError.create({
        data: { seoImportBatchId: batch.id, rowNumber: index + 2, fieldName: "date/page_path", rawValue: JSON.stringify(row), errorMessage: "Invalid GA4 row." }
      });
      continue;
    }
    const post = findWordPressPostInList(posts, pagePath);
    const sessions = Math.max(0, Math.round(toNumber(row.sessions)));
    const users = Math.max(0, Math.round(toNumber(row.users)));
    const activeUsers = Math.max(0, Math.round(toNumber(row.active_users)));
    const views = Math.max(0, Math.round(toNumber(row.views || row.pageviews || row.screen_page_views)));
    const screenPageViews = Math.max(0, Math.round(toNumber(row.screen_page_views || row.views || row.pageviews)));
    const engagedSessions = Math.max(0, Math.round(toNumber(row.engaged_sessions)));
    const conversions = Math.max(0, Math.round(toNumber(row.conversions)));
    const totalRevenue = Math.max(0, toNumber(row.total_revenue || row.revenue));
    const aggregateKey = dateKey(date);
    const total = totalsByDate.get(aggregateKey) ?? {
      date,
      sessions: 0,
      users: 0,
      activeUsers: 0,
      views: 0,
      screenPageViews: 0,
      engagedSessions: 0,
      conversions: 0,
      totalRevenue: 0
    };
    total.sessions += sessions;
    total.users += users;
    total.activeUsers += activeUsers;
    total.views += views;
    total.screenPageViews += screenPageViews;
    total.engagedSessions += engagedSessions;
    total.conversions += conversions;
    total.totalRevenue += totalRevenue;
    totalsByDate.set(aggregateKey, total);
    const id = stableId("csv-ga4-page", [mediaId, ga4PropertyId, aggregateKey, pagePath]);
    await prisma.gA4PageMetricDaily.upsert({
      where: { id },
      update: {
        wordpressPostId: post?.id,
        ga4PropertyId,
        pageTitle: row.page_title || null,
        sessions,
        users,
        activeUsers,
        views,
        screenPageViews,
        engagedSessions,
        averageEngagementTime: toNumber(row.average_engagement_time),
        conversions,
        affiliateClicks: Math.max(0, Math.round(toNumber(row.affiliate_clicks))),
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      },
      create: {
        id,
        mediaId,
        wordpressPostId: post?.id,
        ga4PropertyId,
        date,
        pagePath,
        pageTitle: row.page_title || null,
        sessions,
        users,
        activeUsers,
        views,
        screenPageViews,
        engagedSessions,
        averageEngagementTime: toNumber(row.average_engagement_time),
        conversions,
        affiliateClicks: Math.max(0, Math.round(toNumber(row.affiliate_clicks))),
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      }
    });
    successRows += 1;
  }
  for (const total of totalsByDate.values()) {
    const id = stableId("csv-ga4-site", [mediaId, ga4PropertyId, dateKey(total.date)]);
    await prisma.gA4MetricDaily.upsert({
      where: { id },
      update: {
        ga4PropertyId,
        sessions: total.sessions,
        users: total.users,
        activeUsers: total.activeUsers,
        pageviews: total.views,
        screenPageViews: total.screenPageViews,
        engagedSessions: total.engagedSessions,
        conversions: total.conversions,
        totalRevenue: total.totalRevenue,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      },
      create: {
        id,
        mediaId,
        ga4PropertyId,
        date: total.date,
        sessions: total.sessions,
        users: total.users,
        activeUsers: total.activeUsers,
        pageviews: total.views,
        screenPageViews: total.screenPageViews,
        engagedSessions: total.engagedSessions,
        conversions: total.conversions,
        totalRevenue: total.totalRevenue,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      }
    });
  }
  await prisma.seoImportBatch.update({
    where: { id: batch.id },
    data: {
      status: importStatus(successRows, failedRows),
      successRows,
      failedRows,
      errorSummary: failedRows > 0 ? `${failedRows} GA4 rows failed` : null
    }
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ANALYTICS,
      eventType: failedRows > 0 ? ApiEventType.ERROR : ApiEventType.REQUEST,
      requestType: RequestType.GA4_CSV_IMPORT,
      endpoint: "local/ga4-csv",
      method: "IMPORT",
      success: failedRows === 0,
      mockMode: true,
      message: `GA4 CSV import: ${successRows} success, ${failedRows} failed`
    }
  });
  revalidatePath("/");
}

export async function importSearchConsoleCsv(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const searchConsolePropertyId = String(formData.get("searchConsolePropertyId") ?? "").trim() || null;
  await assertSearchConsolePropertyBelongsToMedia(mediaId, searchConsolePropertyId);
  const csvText = z.string().min(1).parse(formData.get("csvText"));
  const parsed = parseCsvRows<Record<string, string>>(csvText);
  const batch = await prisma.seoImportBatch.create({
    data: {
      mediaId,
      importSource: SeoImportSource.SEARCH_CONSOLE,
      importType: SeoImportType.GSC_QUERY_PAGE_CSV,
      fileName: String(formData.get("fileName") ?? "search-console.csv"),
      totalRows: parsed.rows.length,
      status: "PROCESSING"
    }
  });
  let successRows = 0;
  let failedRows = 0;
  const posts = await loadWordPressPosts(mediaId);
  const queryPageRows = new Map<string, {
    date: Date;
    query: string;
    pageUrl: string;
    country: string | null;
    device: SearchDevice;
    searchType: SearchType;
    clicks: number;
    impressions: number;
    positionWeighted: number;
  }>();
  const pageRows = new Map<string, {
    date: Date;
    pageUrl: string;
    searchType: SearchType;
    clicks: number;
    impressions: number;
    positionWeighted: number;
  }>();
  const queryRows = new Map<string, {
    date: Date;
    query: string;
    country: string | null;
    device: SearchDevice;
    searchType: SearchType;
    clicks: number;
    impressions: number;
    positionWeighted: number;
  }>();
  for (const [index, row] of parsed.rows.entries()) {
    const date = toDate(row.date);
    const query = String(row.query ?? "").trim();
    const pageUrl = String(row.page || row.page_url || "").trim();
    if (!date || !query || !pageUrl) {
      failedRows += 1;
      await prisma.seoImportRowError.create({
        data: { seoImportBatchId: batch.id, rowNumber: index + 2, fieldName: "date/query/page", rawValue: JSON.stringify(row), errorMessage: "Invalid Search Console row." }
      });
      continue;
    }
    const clicks = Math.max(0, Math.round(toNumber(row.clicks)));
    const impressions = Math.max(0, Math.round(toNumber(row.impressions)));
    const position = Math.max(0, toNumber(row.position));
    const country = String(row.country ?? "").trim().toLowerCase() || null;
    const device = normalizedSearchDevice(row.device);
    const searchType = normalizedSearchType(row.search_type);
    const day = dateKey(date);
    const weightedPosition = position * impressions;
    const queryPageKey = stableId("csv-gsc-query-page", [mediaId, searchConsolePropertyId, day, query, pageUrl, country, device, searchType]);
    const queryPage = queryPageRows.get(queryPageKey) ?? {
      date,
      query,
      pageUrl,
      country,
      device,
      searchType,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0
    };
    queryPage.clicks += clicks;
    queryPage.impressions += impressions;
    queryPage.positionWeighted += weightedPosition;
    queryPageRows.set(queryPageKey, queryPage);

    const pageKey = stableId("csv-gsc-page", [mediaId, searchConsolePropertyId, day, pageUrl, searchType]);
    const page = pageRows.get(pageKey) ?? {
      date,
      pageUrl,
      searchType,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0
    };
    page.clicks += clicks;
    page.impressions += impressions;
    page.positionWeighted += weightedPosition;
    pageRows.set(pageKey, page);

    const queryKey = stableId("csv-gsc-query", [mediaId, searchConsolePropertyId, day, query, country, device, searchType]);
    const queryTotal = queryRows.get(queryKey) ?? {
      date,
      query,
      country,
      device,
      searchType,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0
    };
    queryTotal.clicks += clicks;
    queryTotal.impressions += impressions;
    queryTotal.positionWeighted += weightedPosition;
    queryRows.set(queryKey, queryTotal);
    successRows += 1;
  }
  for (const [id, row] of queryPageRows.entries()) {
    const post = findWordPressPostInList(posts, row.pageUrl);
    const ctr = row.impressions > 0 ? row.clicks / row.impressions : 0;
    const position = row.impressions > 0 ? row.positionWeighted / row.impressions : 0;
    await prisma.searchConsoleQueryPageDaily.upsert({
      where: { id },
      update: {
        wordpressPostId: post?.id,
        searchConsolePropertyId,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        country: row.country,
        device: row.device,
        searchType: row.searchType,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      },
      create: {
        id,
        mediaId,
        wordpressPostId: post?.id,
        searchConsolePropertyId,
        date: row.date,
        query: row.query,
        pageUrl: row.pageUrl,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        country: row.country,
        device: row.device,
        searchType: row.searchType,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      }
    });
    const normalizedKeyword = normalizeKeyword(row.query);
    const keyword = await prisma.seoKeyword.upsert({
      where: { mediaId_normalizedKeyword: { mediaId, normalizedKeyword } },
      update: { keyword: row.query, priority: Math.min(100, Math.round(row.impressions / 20)) },
      create: { mediaId, keyword: row.query, normalizedKeyword, priority: Math.min(100, Math.round(row.impressions / 20)) }
    });
    if (post) {
      await prisma.seoPageKeyword.upsert({
        where: { wordpressPostId_seoKeywordId: { wordpressPostId: post.id, seoKeywordId: keyword.id } },
        update: { currentPosition: position, currentClicks: row.clicks, currentImpressions: row.impressions, currentCtr: ctr },
        create: { mediaId, wordpressPostId: post.id, seoKeywordId: keyword.id, currentPosition: position, currentClicks: row.clicks, currentImpressions: row.impressions, currentCtr: ctr }
      });
    }
  }
  for (const [id, row] of pageRows.entries()) {
    const post = findWordPressPostInList(posts, row.pageUrl);
    const ctr = row.impressions > 0 ? row.clicks / row.impressions : 0;
    const position = row.impressions > 0 ? row.positionWeighted / row.impressions : 0;
    await prisma.searchConsolePageDaily.upsert({
      where: { id },
      update: {
        wordpressPostId: post?.id,
        searchConsolePropertyId,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        searchType: row.searchType,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      },
      create: {
        id,
        mediaId,
        wordpressPostId: post?.id,
        searchConsolePropertyId,
        date: row.date,
        pageUrl: row.pageUrl,
        searchType: row.searchType,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      }
    });
  }
  for (const [id, row] of queryRows.entries()) {
    const ctr = row.impressions > 0 ? row.clicks / row.impressions : 0;
    const position = row.impressions > 0 ? row.positionWeighted / row.impressions : 0;
    await prisma.searchConsoleQueryDaily.upsert({
      where: { id },
      update: {
        searchConsolePropertyId,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        country: row.country,
        device: row.device,
        searchType: row.searchType,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      },
      create: {
        id,
        mediaId,
        searchConsolePropertyId,
        date: row.date,
        query: row.query,
        searchType: row.searchType,
        country: row.country,
        device: row.device,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr,
        position,
        source: SeoDataSource.CSV,
        dataConfidence: DataConfidence.MEDIUM
      }
    });
  }
  await prisma.seoImportBatch.update({
    where: { id: batch.id },
    data: {
      status: importStatus(successRows, failedRows),
      successRows,
      failedRows,
      errorSummary: failedRows > 0 ? `${failedRows} Search Console rows failed` : null
    }
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ANALYTICS,
      eventType: failedRows > 0 ? ApiEventType.ERROR : ApiEventType.REQUEST,
      requestType: RequestType.SEARCH_CONSOLE_CSV_IMPORT,
      endpoint: "local/search-console-csv",
      method: "IMPORT",
      success: failedRows === 0,
      mockMode: true,
      message: `Search Console CSV import: ${successRows} success, ${failedRows} failed`
    }
  });
  revalidatePath("/");
}

export async function runSeoAnalysis(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const periodDays = parsePeriodDays(formData.get("periodDays"));
  const { start, end } = periodRange(periodDays);
  const startDay = dateKey(start);
  const endDay = dateKey(end);
  const result = await analyzeSeoForMedia(prisma, { mediaId, start, end });
  const snapshot = await prisma.seoAnalysisSnapshot.create({
    data: {
      mediaId,
      periodStart: start,
      periodEnd: end,
      totalClicks: result.totalClicks,
      totalImpressions: result.totalImpressions,
      averageCtr: result.averageCtr,
      averagePosition: result.averagePosition,
      organicSessions: result.organicSessions,
      topQueries: result.topQueries,
      topPages: result.topPages,
      opportunityCount: result.opportunities.length,
      dataConfidence: result.dataConfidence,
      summary: result.summary
    }
  });
  for (const opportunity of result.opportunities.slice(0, 20)) {
    const opportunityId = stableId("seo-opp", [
      mediaId,
      startDay,
      endDay,
      opportunity.wordpressPostId,
      opportunity.type,
      opportunity.title
    ]);
    const created = await prisma.seoOpportunity.upsert({
      where: { id: opportunityId },
      update: {
        wordpressPostId: opportunity.wordpressPostId,
        opportunityType: opportunity.type,
        priority: opportunity.priority,
        title: opportunity.title,
        description: opportunity.description,
        evidence: opportunity.evidence,
        expectedImpact: opportunity.expectedImpact,
        opportunityScore: opportunity.score
      },
      create: {
        id: opportunityId,
        mediaId,
        wordpressPostId: opportunity.wordpressPostId,
        opportunityType: opportunity.type,
        priority: opportunity.priority,
        title: opportunity.title,
        description: opportunity.description,
        evidence: opportunity.evidence,
        expectedImpact: opportunity.expectedImpact,
        opportunityScore: opportunity.score
      }
    });
    const recommendationId = stableId("seo-rec", [opportunityId, opportunity.recommendationType]);
    const recommendation = await prisma.seoRecommendation.upsert({
      where: { id: recommendationId },
      update: {
        wordpressPostId: opportunity.wordpressPostId,
        seoOpportunityId: created.id,
        recommendationType: opportunity.recommendationType,
        priority: opportunity.priority,
        title: opportunity.title,
        description: opportunity.description,
        beforeValue: opportunity.evidence ? JSON.stringify(opportunity.evidence) : null,
        afterSuggestion: recommendationSuggestion(opportunity.recommendationType),
        reason: "Generated from mock/CSV SEO analysis. Human review required.",
        requiresHumanReview: true
      },
      create: {
        id: recommendationId,
        mediaId,
        wordpressPostId: opportunity.wordpressPostId,
        seoOpportunityId: created.id,
        recommendationType: opportunity.recommendationType,
        priority: opportunity.priority,
        title: opportunity.title,
        description: opportunity.description,
        beforeValue: opportunity.evidence ? JSON.stringify(opportunity.evidence) : null,
        afterSuggestion: recommendationSuggestion(opportunity.recommendationType),
        reason: "Generated from mock/CSV SEO analysis. Human review required.",
        requiresHumanReview: true,
        approvalStatus: SeoApprovalStatus.PENDING_APPROVAL
      }
    });
    const actionCount = await prisma.seoRecommendationAction.count({ where: { seoRecommendationId: recommendation.id } });
    if (actionCount === 0) {
      await prisma.seoRecommendationAction.createMany({
        data: [
          { seoRecommendationId: recommendation.id, actionOrder: 1, actionText: "Review evidence and confirm intent." },
          { seoRecommendationId: recommendation.id, actionOrder: 2, actionText: "Draft manual WordPress changes." },
          { seoRecommendationId: recommendation.id, actionOrder: 3, actionText: "Approve before editing published content." }
        ]
      });
    }
  }
  await prisma.growthRecommendation.upsert({
    where: { id: stableId("seo-growth-rec", [mediaId, startDay, endDay]) },
    update: {
      type: GrowthRecommendationType.IMPROVE,
      title: "Review SEO opportunities",
      description: `${result.opportunities.length} SEO opportunities were found in snapshot ${snapshot.id}.`,
      priority: result.opportunities.length > 0 ? 20 : 80,
      riskNotes: "SEO changes require human review."
    },
    create: {
      id: stableId("seo-growth-rec", [mediaId, startDay, endDay]),
      mediaId,
      type: GrowthRecommendationType.IMPROVE,
      title: "Review SEO opportunities",
      description: `${result.opportunities.length} SEO opportunities were found in snapshot ${snapshot.id}.`,
      priority: result.opportunities.length > 0 ? 20 : 80,
      riskNotes: "SEO changes require human review."
    }
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.GROWTH_SCORE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.SEO_ANALYSIS_RUN,
      endpoint: "local/seo-analysis",
      method: "ANALYZE",
      mockMode: true,
      message: result.summary
    }
  });
  revalidatePath("/");
}

function recommendationSuggestion(type: SeoRecommendationType) {
  const suggestions: Record<SeoRecommendationType, string> = {
    REWRITE_TITLE: "Rewrite the title to match the high-impression query intent.",
    REWRITE_META_DESCRIPTION: "Rewrite the meta description with clear benefit and target keyword.",
    ADD_H2_SECTION: "Add one focused H2 section answering the search intent.",
    ADD_FAQ_SECTION: "Add a reviewed FAQ section for long-tail queries.",
    IMPROVE_INTRO: "Clarify who the article is for in the intro.",
    ADD_INTERNAL_LINKS: "Add internal links from related WordPress articles.",
    ADD_AFFILIATE_CTA: "Add or improve a WordPress CTA block. Do not place affiliate links on X.",
    UPDATE_OUTDATED_INFO: "Review outdated claims and update manually.",
    EXPAND_COMPARISON_TABLE: "Expand comparison criteria after human review.",
    IMPROVE_SCHEMA_MARKUP_FUTURE: "Prepare schema markup work for a later phase."
  };
  return suggestions[type];
}

export async function updateSeoRecommendationStatus(formData: FormData) {
  const id = z.string().min(1).parse(formData.get("seoRecommendationId"));
  const approvalStatus = z.nativeEnum(SeoApprovalStatus).parse(formData.get("approvalStatus"));
  const recommendation = await prisma.seoRecommendation.update({
    where: { id },
    data: { approvalStatus },
    select: { id: true, seoOpportunityId: true }
  });
  if (recommendation.seoOpportunityId) {
    const opportunityStatus =
      approvalStatus === SeoApprovalStatus.APPROVED
        ? SeoOpportunityStatus.APPROVED
        : approvalStatus === SeoApprovalStatus.REJECTED
          ? SeoOpportunityStatus.DISMISSED
          : approvalStatus === SeoApprovalStatus.DONE
            ? SeoOpportunityStatus.DONE
            : SeoOpportunityStatus.REVIEWING;
    await prisma.seoOpportunity.update({
      where: { id: recommendation.seoOpportunityId },
      data: { status: opportunityStatus }
    });
  }
  if (approvalStatus === SeoApprovalStatus.DONE) {
    await prisma.seoRecommendationAction.updateMany({
      where: { seoRecommendationId: recommendation.id },
      data: { status: SeoActionStatus.DONE }
    });
  }
  revalidatePath("/");
}
