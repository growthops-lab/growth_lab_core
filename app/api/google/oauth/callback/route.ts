import { GoogleConnectionStatus, Platform, RequestType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptGoogleToken } from "@/src/lib/google/encryption";
import { exchangeGoogleOAuthCode } from "@/src/lib/google/token";
import { parseGoogleOAuthState } from "@/src/lib/google/oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (error) return NextResponse.redirect(new URL(`/?google_oauth_error=${encodeURIComponent(error)}`, request.url));
  if (!code || !state) return NextResponse.redirect(new URL("/?google_oauth_error=missing_code_or_state", request.url));
  try {
    const parsedState = parseGoogleOAuthState(state);
    const token = await exchangeGoogleOAuthCode(code);
    if (!token.access_token) throw new Error("Google did not return an access token.");
    const expiresAt = new Date(Date.now() + Number(token.expires_in ?? 3600) * 1000);
    const status = token.refresh_token ? GoogleConnectionStatus.CONNECTED : GoogleConnectionStatus.MISSING_REFRESH_TOKEN;
    await prisma.googleConnection.create({
      data: {
        mediaId: parsedState.mediaId,
        connectionName: "Google OAuth connection",
        googleAccountEmail: null,
        accessTokenEncrypted: encryptGoogleToken(token.access_token),
        refreshTokenEncrypted: token.refresh_token ? encryptGoogleToken(token.refresh_token) : null,
        tokenExpiresAt: expiresAt,
        scopes: token.scope,
        connectionStatus: status,
        mockMode: false,
        lastConnectedAt: new Date(),
        lastTokenRefreshAt: new Date(),
        refreshTokenAvailable: Boolean(token.refresh_token),
        lastError: token.refresh_token ? null : "Refresh token was not returned. Reauthorize with prompt=consent."
      }
    });
    await prisma.apiUsageLog.create({
      data: {
        platform: Platform.ANALYTICS,
        eventType: "REQUEST",
        requestType: RequestType.GOOGLE_OAUTH_CALLBACK,
        endpoint: "/api/google/oauth/callback",
        method: "GET",
        success: true,
        mockMode: false,
        message: token.refresh_token ? "Google OAuth connected." : "Google OAuth connected without refresh token."
      }
    });
    return NextResponse.redirect(new URL("/", request.url));
  } catch (callbackError) {
    const message = callbackError instanceof Error ? callbackError.message : String(callbackError);
    await prisma.apiUsageLog.create({
      data: {
        platform: Platform.ANALYTICS,
        eventType: "ERROR",
        requestType: RequestType.GOOGLE_OAUTH_CALLBACK,
        endpoint: "/api/google/oauth/callback",
        method: "GET",
        success: false,
        mockMode: false,
        message
      }
    });
    return NextResponse.redirect(new URL(`/?google_oauth_error=${encodeURIComponent(message)}`, request.url));
  }
}

