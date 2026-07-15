import type {
  GoogleApiActionRequired,
  GoogleApiName,
  PrismaClient,
  RequestType,
} from "@prisma/client";

export async function logGoogleApiError(
  prisma: PrismaClient,
  input: {
    mediaId?: string | null;
    googleConnectionId?: string | null;
    apiName: GoogleApiName;
    endpoint: string;
    requestType: RequestType;
    statusCode?: number | null;
    errorCode?: string | null;
    errorMessage: string;
    retryable?: boolean;
    actionRequired: GoogleApiActionRequired;
  },
) {
  await prisma.googleApiErrorLog.create({
    data: {
      mediaId: input.mediaId,
      googleConnectionId: input.googleConnectionId,
      apiName: input.apiName,
      endpoint: input.endpoint,
      requestType: input.requestType,
      statusCode: input.statusCode,
      errorCode: input.errorCode,
      errorMessage: input.errorMessage.slice(0, 2000),
      retryable: input.retryable ?? false,
      actionRequired: input.actionRequired,
    },
  });
}
