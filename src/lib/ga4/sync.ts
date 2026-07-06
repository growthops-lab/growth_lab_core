import { DataConfidence, GooglePropertyStatus, GoogleSyncRunStatus, RequestType, SeoDataSource, type PrismaClient } from "@prisma/client";
import { ga4Date, ga4Number, ga4RowsToObjects } from "@/src/lib/ga4/mapper";
import { fetchAllGA4ReportRows } from "@/src/lib/ga4/pagination";
import { createGA4PageDailyRequest, createGA4SiteDailyRequest, ga4RunReportEndpoint, normalizeGA4PropertyId } from "@/src/lib/ga4/reports";

function dateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function syncGA4SiteDaily(
  prisma: PrismaClient,
  input: { ga4PropertyId: string; periodStart: Date; periodEnd: Date; googleSyncRunId?: string | null }
) {
  const property = await prisma.gA4Property.findUniqueOrThrow({ where: { id: input.ga4PropertyId } });
  if (!property.googleConnectionId) throw new Error("GA4 property has no Google connection.");
  const propertyId = normalizeGA4PropertyId(property.propertyId);
  const endpoint = ga4RunReportEndpoint(propertyId);
  const responses = await fetchAllGA4ReportRows(prisma, {
    mediaId: property.mediaId,
    googleConnectionId: property.googleConnectionId,
    propertyId,
    endpoint,
    requestType: RequestType.GA4_API_SYNC,
    createBody: (limit, offset) => createGA4SiteDailyRequest(dateString(input.periodStart), dateString(input.periodEnd), limit, offset)
  });
  let savedRows = 0;
  for (const response of responses) {
    for (const row of ga4RowsToObjects(response)) {
      const date = ga4Date(row.date);
      await prisma.gA4MetricDaily.upsert({
        where: { mediaId_ga4PropertyId_date_source: { mediaId: property.mediaId, ga4PropertyId: property.id, date, source: SeoDataSource.GA4_API } },
        update: {
          sessions: Math.round(ga4Number(row.sessions)),
          users: Math.round(ga4Number(row.totalUsers)),
          activeUsers: Math.round(ga4Number(row.activeUsers)),
          newUsers: Math.round(ga4Number(row.newUsers)),
          pageviews: Math.round(ga4Number(row.screenPageViews)),
          screenPageViews: Math.round(ga4Number(row.screenPageViews)),
          engagedSessions: Math.round(ga4Number(row.engagedSessions)),
          averageSessionDuration: ga4Number(row.averageSessionDuration),
          engagementRate: ga4Number(row.engagementRate),
          bounceRate: ga4Number(row.bounceRate),
          conversions: Math.round(ga4Number(row.conversions)),
          totalRevenue: ga4Number(row.totalRevenue),
          dataConfidence: DataConfidence.HIGH
        },
        create: {
          mediaId: property.mediaId,
          ga4PropertyId: property.id,
          date,
          sessions: Math.round(ga4Number(row.sessions)),
          users: Math.round(ga4Number(row.totalUsers)),
          activeUsers: Math.round(ga4Number(row.activeUsers)),
          newUsers: Math.round(ga4Number(row.newUsers)),
          pageviews: Math.round(ga4Number(row.screenPageViews)),
          screenPageViews: Math.round(ga4Number(row.screenPageViews)),
          engagedSessions: Math.round(ga4Number(row.engagedSessions)),
          averageSessionDuration: ga4Number(row.averageSessionDuration),
          engagementRate: ga4Number(row.engagementRate),
          bounceRate: ga4Number(row.bounceRate),
          conversions: Math.round(ga4Number(row.conversions)),
          totalRevenue: ga4Number(row.totalRevenue),
          source: SeoDataSource.GA4_API,
          dataConfidence: DataConfidence.HIGH
        }
      });
      savedRows += 1;
    }
  }
  await prisma.gA4Property.update({
    where: { id: property.id },
    data: { connectionStatus: GooglePropertyStatus.CONNECTED, mockMode: false, lastSyncedAt: new Date(), lastSuccessfulSyncAt: new Date(), lastError: null }
  });
  if (input.googleSyncRunId) {
    await prisma.googleSyncRun.update({
      where: { id: input.googleSyncRunId },
      data: { savedRows, requestedRows: savedRows, apiCalls: responses.length, status: GoogleSyncRunStatus.SUCCESS, finishedAt: new Date() }
    });
  }
  return { savedRows, apiCalls: responses.length };
}

export async function syncGA4PageDaily(
  prisma: PrismaClient,
  input: { ga4PropertyId: string; periodStart: Date; periodEnd: Date; googleSyncRunId?: string | null }
) {
  const property = await prisma.gA4Property.findUniqueOrThrow({ where: { id: input.ga4PropertyId } });
  if (!property.googleConnectionId) throw new Error("GA4 property has no Google connection.");
  const propertyId = normalizeGA4PropertyId(property.propertyId);
  const endpoint = ga4RunReportEndpoint(propertyId);
  const responses = await fetchAllGA4ReportRows(prisma, {
    mediaId: property.mediaId,
    googleConnectionId: property.googleConnectionId,
    propertyId,
    endpoint,
    requestType: RequestType.GA4_API_SYNC,
    createBody: (limit, offset) => createGA4PageDailyRequest(dateString(input.periodStart), dateString(input.periodEnd), limit, offset)
  });
  let savedRows = 0;
  const posts = await prisma.wordPressPost.findMany({ where: { mediaId: property.mediaId }, select: { id: true, slug: true, wordpressPostUrl: true } });
  for (const response of responses) {
    for (const row of ga4RowsToObjects(response)) {
      const date = ga4Date(row.date);
      const pagePath = row.pagePath || "/";
      const post = posts.find((item) => pagePath.toLowerCase().includes(item.slug.toLowerCase())) ?? null;
      await prisma.gA4PageMetricDaily.upsert({
        where: { mediaId_ga4PropertyId_date_pagePath_source: { mediaId: property.mediaId, ga4PropertyId: property.id, date, pagePath, source: SeoDataSource.GA4_API } },
        update: {
          wordpressPostId: post?.id,
          pageTitle: row.pageTitle || null,
          sessions: Math.round(ga4Number(row.sessions)),
          users: Math.round(ga4Number(row.totalUsers)),
          activeUsers: Math.round(ga4Number(row.activeUsers)),
          views: Math.round(ga4Number(row.screenPageViews)),
          screenPageViews: Math.round(ga4Number(row.screenPageViews)),
          engagedSessions: Math.round(ga4Number(row.engagedSessions)),
          averageEngagementTime: ga4Number(row.averageEngagementTime),
          conversions: Math.round(ga4Number(row.conversions)),
          dataConfidence: DataConfidence.HIGH
        },
        create: {
          mediaId: property.mediaId,
          wordpressPostId: post?.id,
          ga4PropertyId: property.id,
          date,
          pagePath,
          pageTitle: row.pageTitle || null,
          sessions: Math.round(ga4Number(row.sessions)),
          users: Math.round(ga4Number(row.totalUsers)),
          activeUsers: Math.round(ga4Number(row.activeUsers)),
          views: Math.round(ga4Number(row.screenPageViews)),
          screenPageViews: Math.round(ga4Number(row.screenPageViews)),
          engagedSessions: Math.round(ga4Number(row.engagedSessions)),
          averageEngagementTime: ga4Number(row.averageEngagementTime),
          conversions: Math.round(ga4Number(row.conversions)),
          source: SeoDataSource.GA4_API,
          dataConfidence: DataConfidence.HIGH
        }
      });
      savedRows += 1;
    }
  }
  await prisma.gA4Property.update({
    where: { id: property.id },
    data: { connectionStatus: GooglePropertyStatus.CONNECTED, mockMode: false, lastSyncedAt: new Date(), lastSuccessfulSyncAt: new Date(), lastError: null }
  });
  if (input.googleSyncRunId) {
    await prisma.googleSyncRun.update({
      where: { id: input.googleSyncRunId },
      data: { savedRows, requestedRows: savedRows, apiCalls: responses.length, status: GoogleSyncRunStatus.SUCCESS, finishedAt: new Date() }
    });
  }
  return { savedRows, apiCalls: responses.length };
}

