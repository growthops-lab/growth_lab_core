import { GoogleApiActionRequired, GoogleApiName, RequestType, type PrismaClient } from "@prisma/client";
import { classifyGoogleError, googleErrorMessage } from "@/src/lib/google/errors";
import { logGoogleApiError } from "@/src/lib/google/sync-log";
import { getGoogleAccessToken } from "@/src/lib/google/token";
import { withRetry } from "@/src/lib/sync/retry";

export class GoogleApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public retryable = false
  ) {
    super(message);
  }
}

function requestTimeoutMs(apiName: GoogleApiName) {
  if (apiName === GoogleApiName.GA4) return Number(process.env.GA4_REQUEST_TIMEOUT_MS ?? 20000);
  if (apiName === GoogleApiName.SEARCH_CONSOLE) return Number(process.env.GOOGLE_SEARCH_CONSOLE_REQUEST_TIMEOUT_MS ?? 20000);
  return 20000;
}

function safeJson(text: string) {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: text } };
  }
}

export async function googleApiFetch<T>(
  prisma: PrismaClient,
  input: {
    googleConnectionId: string;
    mediaId: string;
    apiName: GoogleApiName;
    endpoint: string;
    requestType: RequestType;
    method?: string;
    body?: unknown;
  }
) {
  return withRetry(async () => {
    const accessToken = await getGoogleAccessToken(prisma, input.googleConnectionId);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs(input.apiName));
    let response: Response;
    try {
      response = await fetch(input.endpoint, {
        method: input.method ?? "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: input.body ? JSON.stringify(input.body) : undefined,
        signal: controller.signal
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await logGoogleApiError(prisma, {
        mediaId: input.mediaId,
        googleConnectionId: input.googleConnectionId,
        apiName: input.apiName,
        endpoint: input.endpoint,
        requestType: input.requestType,
        errorMessage: message,
        retryable: true,
        actionRequired: GoogleApiActionRequired.WAIT_AND_RETRY
      });
      throw new GoogleApiRequestError(message, undefined, "network_error", true);
    } finally {
      clearTimeout(timeout);
    }
    const text = await response.text();
    const payload = safeJson(text);
    if (!response.ok) {
      const errorCode = payload?.error?.status ?? payload?.error?.errors?.[0]?.reason;
      const classified = classifyGoogleError(response.status, errorCode, googleErrorMessage(payload));
      await logGoogleApiError(prisma, {
        mediaId: input.mediaId,
        googleConnectionId: input.googleConnectionId,
        apiName: input.apiName,
        endpoint: input.endpoint,
        requestType: input.requestType,
        statusCode: response.status,
        errorCode: classified.errorCode,
        errorMessage: classified.message,
        retryable: classified.retryable,
        actionRequired: classified.actionRequired
      });
      throw new GoogleApiRequestError(classified.message, response.status, classified.errorCode, classified.retryable);
    }
    return payload as T;
  }, (error) => error instanceof GoogleApiRequestError && error.retryable);
}
