import type { PrismaClient, GoogleApiName, GoogleQuotaCategory, RequestType } from "@prisma/client";

export async function logGoogleQuota(
  prisma: PrismaClient,
  input: {
    mediaId?: string | null;
    googleConnectionId?: string | null;
    apiName: GoogleApiName;
    propertyId?: string | null;
    endpoint: string;
    requestType: RequestType;
    quotaCategory: GoogleQuotaCategory;
    tokensConsumed?: number;
    quotaRemaining?: number | null;
    statusCode?: number | null;
    success: boolean;
  }
) {
  await prisma.googleApiQuotaLog.create({
    data: {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: input.apiName,
      propertyId: input.propertyId,
      endpoint: input.endpoint,
      requestType: input.requestType,
      quotaCategory: input.quotaCategory,
      tokensConsumed: input.tokensConsumed ?? 0,
      quotaRemaining: input.quotaRemaining,
      statusCode: input.statusCode,
      success: input.success
    }
  });
}

