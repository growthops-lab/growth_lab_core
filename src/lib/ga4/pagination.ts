import {
  GoogleApiName,
  GoogleQuotaCategory,
  RequestType,
  type PrismaClient,
} from "@prisma/client";
import { googleApiFetch } from "@/src/lib/google/client";
import { logGoogleQuota } from "@/src/lib/google/quota";
import type { GA4RunReportResponse } from "@/src/lib/ga4/types";

export async function fetchAllGA4ReportRows(
  prisma: PrismaClient,
  input: {
    mediaId: string;
    googleConnectionId: string;
    propertyId: string;
    endpoint: string;
    requestType: RequestType;
    createBody: (limit: number, offset: number) => Record<string, unknown>;
  },
) {
  const configuredLimit = Number(process.env.GA4_MAX_ROWS_PER_REQUEST ?? 10000);
  const absoluteLimit = Number(
    process.env.GA4_ABSOLUTE_MAX_ROWS_PER_REQUEST ?? 250000,
  );
  const limit = Math.max(1, Math.min(configuredLimit, absoluteLimit));
  const responses: GA4RunReportResponse[] = [];
  let offset = 0;
  let rowCount = 0;
  do {
    const response = await googleApiFetch<GA4RunReportResponse>(prisma, {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: GoogleApiName.GA4,
      endpoint: input.endpoint,
      requestType: input.requestType,
      method: "POST",
      body: input.createBody(limit, offset),
    });
    responses.push(response);
    rowCount = response.rowCount ?? response.rows?.length ?? 0;
    await logGoogleQuota(prisma, {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: GoogleApiName.GA4,
      propertyId: input.propertyId,
      endpoint: input.endpoint,
      requestType: input.requestType,
      quotaCategory: GoogleQuotaCategory.GA4_CORE,
      tokensConsumed: response.propertyQuota?.tokensPerHour?.consumed ?? 1,
      quotaRemaining: response.propertyQuota?.tokensPerHour?.remaining,
      statusCode: 200,
      success: true,
    });
    offset += response.rows?.length ?? 0;
  } while (offset > 0 && offset < rowCount && offset < absoluteLimit);
  return responses;
}
