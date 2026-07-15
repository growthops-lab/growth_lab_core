import { GoogleApiActionRequired } from "@prisma/client";
import type { GoogleApiErrorShape } from "@/src/lib/google/types";

export function classifyGoogleError(
  statusCode: number | undefined,
  errorCode: string | undefined,
  message: string,
): GoogleApiErrorShape {
  const code = errorCode ?? "";
  if (statusCode === 401 || ["invalid_grant", "invalid_token"].includes(code)) {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: false,
      actionRequired: GoogleApiActionRequired.REAUTHORIZE,
    };
  }
  if (
    statusCode === 403 &&
    ["insufficientPermissions", "forbidden"].includes(code)
  ) {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: false,
      actionRequired: GoogleApiActionRequired.CHECK_PROPERTY_PERMISSION,
    };
  }
  if (statusCode === 403 && code === "accessNotConfigured") {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: false,
      actionRequired: GoogleApiActionRequired.ENABLE_API,
    };
  }
  if (
    statusCode === 429 ||
    ["rateLimitExceeded", "quotaExceeded", "userRateLimitExceeded"].includes(
      code,
    )
  ) {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: true,
      actionRequired: GoogleApiActionRequired.WAIT_AND_RETRY,
    };
  }
  if (statusCode && statusCode >= 500) {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: true,
      actionRequired: GoogleApiActionRequired.WAIT_AND_RETRY,
    };
  }
  if (["propertyNotFound", "invalidArgument", "badRequest"].includes(code)) {
    return {
      statusCode,
      errorCode: code,
      message,
      retryable: false,
      actionRequired: GoogleApiActionRequired.CHECK_PROPERTY_ID,
    };
  }
  return {
    statusCode,
    errorCode: code,
    message,
    retryable: false,
    actionRequired: GoogleApiActionRequired.NONE,
  };
}

export function googleErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (
      payload as {
        error?: { message?: string; status?: string; code?: number };
      }
    ).error;
    return error?.message ?? error?.status ?? JSON.stringify(payload);
  }
  return typeof payload === "string" ? payload : JSON.stringify(payload);
}
