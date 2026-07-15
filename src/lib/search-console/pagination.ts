import {
  GoogleApiName,
  GoogleQuotaCategory,
  RequestType,
  type PrismaClient,
} from "@prisma/client";
import { googleApiFetch } from "@/src/lib/google/client";
import { logGoogleQuota } from "@/src/lib/google/quota";
import type { SearchConsoleQueryResponse } from "@/src/lib/search-console/types";

export async function fetchAllSearchConsoleRows(
  prisma: PrismaClient,
  input: {
    mediaId: string;
    googleConnectionId: string;
    siteUrl: string;
    endpoint: string;
    requestType: RequestType;
    createBody: (rowLimit: number, startRow: number) => Record<string, unknown>;
  },
) {
  const rowLimit = Math.min(
    Number(process.env.GOOGLE_SEARCH_CONSOLE_ROW_LIMIT ?? 25000),
    25000,
  );
  const maxPages = Number(
    process.env.GOOGLE_SEARCH_CONSOLE_MAX_PAGES_PER_SYNC ?? 10,
  );
  const responses: SearchConsoleQueryResponse[] = [];
  for (let page = 0; page < maxPages; page += 1) {
    const startRow = page * rowLimit;
    const response = await googleApiFetch<SearchConsoleQueryResponse>(prisma, {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: GoogleApiName.SEARCH_CONSOLE,
      endpoint: input.endpoint,
      requestType: input.requestType,
      method: "POST",
      body: input.createBody(rowLimit, startRow),
    });
    responses.push(response);
    await logGoogleQuota(prisma, {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: GoogleApiName.SEARCH_CONSOLE,
      propertyId: input.siteUrl,
      endpoint: input.endpoint,
      requestType: input.requestType,
      quotaCategory: GoogleQuotaCategory.SEARCH_CONSOLE_SEARCH_ANALYTICS,
      tokensConsumed: 1,
      statusCode: 200,
      success: true,
    });
    if ((response.rows?.length ?? 0) < rowLimit) break;
  }
  return responses;
}
