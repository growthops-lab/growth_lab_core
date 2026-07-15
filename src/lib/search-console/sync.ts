import {
  DataConfidence,
  GooglePropertyStatus,
  GoogleSyncRunStatus,
  RequestType,
  SeoDataSource,
  type PrismaClient,
} from "@prisma/client";
import { fetchAllSearchConsoleRows } from "@/src/lib/search-console/pagination";
import {
  createSearchConsoleRequest,
  searchConsoleEndpoint,
} from "@/src/lib/search-console/query";
import {
  gscMetrics,
  normalizedSearchDevice,
  normalizedSearchType,
} from "@/src/lib/search-console/mapper";

function dateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function loadPosts(prisma: PrismaClient, mediaId: string) {
  return prisma.wordPressPost.findMany({
    where: { mediaId },
    select: { id: true, slug: true, wordpressPostUrl: true },
  });
}

function matchPost(
  posts: Awaited<ReturnType<typeof loadPosts>>,
  pageUrl: string,
) {
  return (
    posts.find((post) =>
      pageUrl.toLowerCase().includes(post.slug.toLowerCase()),
    ) ?? null
  );
}

export async function syncSearchConsoleQueryPageDaily(
  prisma: PrismaClient,
  input: {
    searchConsolePropertyId: string;
    periodStart: Date;
    periodEnd: Date;
    googleSyncRunId?: string | null;
  },
) {
  const property = await prisma.searchConsoleProperty.findUniqueOrThrow({
    where: { id: input.searchConsolePropertyId },
  });
  if (!property.googleConnectionId)
    throw new Error("Search Console property has no Google connection.");
  const endpoint = searchConsoleEndpoint(property.siteUrl);
  const responses = await fetchAllSearchConsoleRows(prisma, {
    mediaId: property.mediaId,
    googleConnectionId: property.googleConnectionId,
    siteUrl: property.siteUrl,
    endpoint,
    requestType: RequestType.SEARCH_CONSOLE_API_SYNC,
    createBody: (rowLimit, startRow) =>
      createSearchConsoleRequest(
        dateString(input.periodStart),
        dateString(input.periodEnd),
        ["date", "query", "page", "country", "device", "searchAppearance"],
        rowLimit,
        startRow,
      ),
  });
  const posts = await loadPosts(prisma, property.mediaId);
  let savedRows = 0;
  for (const response of responses) {
    for (const row of response.rows ?? []) {
      const [rawDate, query, pageUrl, country, device] = row.keys ?? [];
      if (!rawDate || !query || !pageUrl) continue;
      const date = new Date(rawDate);
      date.setHours(0, 0, 0, 0);
      const post = matchPost(posts, pageUrl);
      const metrics = gscMetrics(row);
      await prisma.searchConsoleQueryPageDaily.upsert({
        where: {
          mediaId_searchConsolePropertyId_date_query_pageUrl_searchType_country_device_source:
            {
              mediaId: property.mediaId,
              searchConsolePropertyId: property.id,
              date,
              query,
              pageUrl,
              searchType: normalizedSearchType("web"),
              country: country?.toLowerCase() ?? null,
              device: normalizedSearchDevice(device),
              source: SeoDataSource.SEARCH_CONSOLE_API,
            },
        },
        update: {
          wordpressPostId: post?.id,
          ...metrics,
          dataConfidence: DataConfidence.HIGH,
        },
        create: {
          mediaId: property.mediaId,
          wordpressPostId: post?.id,
          searchConsolePropertyId: property.id,
          date,
          query,
          pageUrl,
          searchType: normalizedSearchType("web"),
          country: country?.toLowerCase() ?? null,
          device: normalizedSearchDevice(device),
          ...metrics,
          source: SeoDataSource.SEARCH_CONSOLE_API,
          dataConfidence: DataConfidence.HIGH,
        },
      });
      savedRows += 1;
    }
  }
  await prisma.searchConsoleProperty.update({
    where: { id: property.id },
    data: {
      connectionStatus: GooglePropertyStatus.CONNECTED,
      mockMode: false,
      lastSyncedAt: new Date(),
      lastSuccessfulSyncAt: new Date(),
      lastError: null,
    },
  });
  if (input.googleSyncRunId) {
    await prisma.googleSyncRun.update({
      where: { id: input.googleSyncRunId },
      data: {
        savedRows,
        requestedRows: savedRows,
        apiCalls: responses.length,
        status: GoogleSyncRunStatus.SUCCESS,
        finishedAt: new Date(),
      },
    });
  }
  return { savedRows, apiCalls: responses.length };
}

export async function syncSearchConsoleQueryDaily(
  prisma: PrismaClient,
  input: {
    searchConsolePropertyId: string;
    periodStart: Date;
    periodEnd: Date;
    googleSyncRunId?: string | null;
  },
) {
  const property = await prisma.searchConsoleProperty.findUniqueOrThrow({
    where: { id: input.searchConsolePropertyId },
  });
  if (!property.googleConnectionId)
    throw new Error("Search Console property has no Google connection.");
  const endpoint = searchConsoleEndpoint(property.siteUrl);
  const responses = await fetchAllSearchConsoleRows(prisma, {
    mediaId: property.mediaId,
    googleConnectionId: property.googleConnectionId,
    siteUrl: property.siteUrl,
    endpoint,
    requestType: RequestType.SEARCH_CONSOLE_API_SYNC,
    createBody: (rowLimit, startRow) =>
      createSearchConsoleRequest(
        dateString(input.periodStart),
        dateString(input.periodEnd),
        ["date", "query", "country", "device"],
        rowLimit,
        startRow,
      ),
  });
  let savedRows = 0;
  for (const response of responses) {
    for (const row of response.rows ?? []) {
      const [rawDate, query, country, device] = row.keys ?? [];
      if (!rawDate || !query) continue;
      const date = new Date(rawDate);
      date.setHours(0, 0, 0, 0);
      const metrics = gscMetrics(row);
      await prisma.searchConsoleQueryDaily.upsert({
        where: {
          mediaId_searchConsolePropertyId_date_query_searchType_country_device_source:
            {
              mediaId: property.mediaId,
              searchConsolePropertyId: property.id,
              date,
              query,
              searchType: normalizedSearchType("web"),
              country: country?.toLowerCase() ?? null,
              device: normalizedSearchDevice(device),
              source: SeoDataSource.SEARCH_CONSOLE_API,
            },
        },
        update: { ...metrics, dataConfidence: DataConfidence.HIGH },
        create: {
          mediaId: property.mediaId,
          searchConsolePropertyId: property.id,
          date,
          query,
          searchType: normalizedSearchType("web"),
          country: country?.toLowerCase() ?? null,
          device: normalizedSearchDevice(device),
          ...metrics,
          source: SeoDataSource.SEARCH_CONSOLE_API,
          dataConfidence: DataConfidence.HIGH,
        },
      });
      savedRows += 1;
    }
  }
  if (input.googleSyncRunId) {
    await prisma.googleSyncRun.update({
      where: { id: input.googleSyncRunId },
      data: {
        savedRows,
        requestedRows: savedRows,
        apiCalls: responses.length,
        status: GoogleSyncRunStatus.SUCCESS,
        finishedAt: new Date(),
      },
    });
  }
  return { savedRows, apiCalls: responses.length };
}

export async function syncSearchConsolePageDaily(
  prisma: PrismaClient,
  input: {
    searchConsolePropertyId: string;
    periodStart: Date;
    periodEnd: Date;
    googleSyncRunId?: string | null;
  },
) {
  const property = await prisma.searchConsoleProperty.findUniqueOrThrow({
    where: { id: input.searchConsolePropertyId },
  });
  if (!property.googleConnectionId)
    throw new Error("Search Console property has no Google connection.");
  const endpoint = searchConsoleEndpoint(property.siteUrl);
  const responses = await fetchAllSearchConsoleRows(prisma, {
    mediaId: property.mediaId,
    googleConnectionId: property.googleConnectionId,
    siteUrl: property.siteUrl,
    endpoint,
    requestType: RequestType.SEARCH_CONSOLE_API_SYNC,
    createBody: (rowLimit, startRow) =>
      createSearchConsoleRequest(
        dateString(input.periodStart),
        dateString(input.periodEnd),
        ["date", "page"],
        rowLimit,
        startRow,
      ),
  });
  const posts = await loadPosts(prisma, property.mediaId);
  let savedRows = 0;
  for (const response of responses) {
    for (const row of response.rows ?? []) {
      const [rawDate, pageUrl] = row.keys ?? [];
      if (!rawDate || !pageUrl) continue;
      const date = new Date(rawDate);
      date.setHours(0, 0, 0, 0);
      const post = matchPost(posts, pageUrl);
      const metrics = gscMetrics(row);
      await prisma.searchConsolePageDaily.upsert({
        where: {
          mediaId_searchConsolePropertyId_date_pageUrl_searchType_source: {
            mediaId: property.mediaId,
            searchConsolePropertyId: property.id,
            date,
            pageUrl,
            searchType: normalizedSearchType("web"),
            source: SeoDataSource.SEARCH_CONSOLE_API,
          },
        },
        update: {
          wordpressPostId: post?.id,
          ...metrics,
          dataConfidence: DataConfidence.HIGH,
        },
        create: {
          mediaId: property.mediaId,
          wordpressPostId: post?.id,
          searchConsolePropertyId: property.id,
          date,
          pageUrl,
          searchType: normalizedSearchType("web"),
          ...metrics,
          source: SeoDataSource.SEARCH_CONSOLE_API,
          dataConfidence: DataConfidence.HIGH,
        },
      });
      savedRows += 1;
    }
  }
  if (input.googleSyncRunId) {
    await prisma.googleSyncRun.update({
      where: { id: input.googleSyncRunId },
      data: {
        savedRows,
        requestedRows: savedRows,
        apiCalls: responses.length,
        status: GoogleSyncRunStatus.SUCCESS,
        finishedAt: new Date(),
      },
    });
  }
  return { savedRows, apiCalls: responses.length };
}
