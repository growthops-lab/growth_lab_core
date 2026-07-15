import {
  GoogleConnectionStatus,
  GoogleApiActionRequired,
  GoogleApiName,
  RequestType,
  type PrismaClient,
} from "@prisma/client";
import {
  decryptGoogleToken,
  encryptGoogleToken,
} from "@/src/lib/google/encryption";
import { googleErrorMessage } from "@/src/lib/google/errors";
import type { GoogleTokenResponse } from "@/src/lib/google/types";
import { logGoogleApiError } from "@/src/lib/google/sync-log";

async function fetchToken(body: URLSearchParams) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
    const text = await response.text();
    let payload: GoogleTokenResponse;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { error: "invalid_response", error_description: text };
    }
    return { response, payload };
  } finally {
    clearTimeout(timeout);
  }
}

export async function exchangeGoogleOAuthCode(code: string) {
  const { response, payload } = await fetchToken(
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "",
      grant_type: "authorization_code",
    }),
  );
  if (!response.ok || payload.error)
    throw new Error(
      payload.error_description ??
        payload.error ??
        "Google OAuth token exchange failed.",
    );
  return payload;
}

export async function refreshGoogleAccessToken(
  prisma: PrismaClient,
  connectionId: string,
) {
  const connection = await prisma.googleConnection.findUniqueOrThrow({
    where: { id: connectionId },
  });
  if (!connection.refreshTokenEncrypted) {
    await prisma.googleConnection.update({
      where: { id: connectionId },
      data: {
        connectionStatus: GoogleConnectionStatus.MISSING_REFRESH_TOKEN,
        refreshTokenAvailable: false,
        lastError: "Missing refresh token. Reauthorization is required.",
      },
    });
    throw new Error("Missing refresh token. Reauthorization is required.");
  }
  const refreshToken = decryptGoogleToken(connection.refreshTokenEncrypted);
  const { response, payload } = await fetchToken(
    new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
    }),
  );
  if (!response.ok || payload.error || !payload.access_token) {
    const message = googleErrorMessage(payload);
    await logGoogleApiError(prisma, {
      mediaId: connection.mediaId,
      googleConnectionId: connection.id,
      apiName: GoogleApiName.GOOGLE_OAUTH,
      endpoint: "https://oauth2.googleapis.com/token",
      requestType: RequestType.GOOGLE_TOKEN_REFRESH,
      statusCode: response.status,
      errorCode: payload.error,
      errorMessage: message,
      actionRequired: GoogleApiActionRequired.REAUTHORIZE,
    });
    await prisma.googleConnection.update({
      where: { id: connection.id },
      data: {
        connectionStatus: GoogleConnectionStatus.EXPIRED,
        lastError: message,
      },
    });
    throw new Error(message);
  }
  const tokenExpiresAt = new Date(
    Date.now() + Number(payload.expires_in ?? 3600) * 1000,
  );
  await prisma.googleConnection.update({
    where: { id: connection.id },
    data: {
      accessTokenEncrypted: encryptGoogleToken(payload.access_token),
      tokenExpiresAt,
      lastTokenRefreshAt: new Date(),
      connectionStatus: GoogleConnectionStatus.CONNECTED,
      refreshTokenAvailable: true,
      lastError: null,
    },
  });
  return payload.access_token;
}

export async function getGoogleAccessToken(
  prisma: PrismaClient,
  connectionId: string,
) {
  const connection = await prisma.googleConnection.findUniqueOrThrow({
    where: { id: connectionId },
  });
  if (
    !connection.accessTokenEncrypted ||
    !connection.tokenExpiresAt ||
    connection.tokenExpiresAt.getTime() < Date.now() + 60_000
  ) {
    return refreshGoogleAccessToken(prisma, connectionId);
  }
  return decryptGoogleToken(connection.accessTokenEncrypted);
}
