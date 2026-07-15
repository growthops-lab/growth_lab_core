"use server";

import {
  GoogleApiActionRequired,
  GoogleApiName,
  GoogleConnectionStatus,
  GooglePropertyStatus,
  GoogleSyncJobStatus,
  GoogleSyncJobType,
  GoogleSyncSource,
  Platform,
  RequestType,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  buildGoogleOAuthUrl,
  isGoogleRealConnectionEnabled,
} from "@/src/lib/google/oauth";
import { logGoogleApiError } from "@/src/lib/google/sync-log";
import { refreshGoogleAccessToken } from "@/src/lib/google/token";
import { runGoogleSyncJob } from "@/src/lib/sync/jobs";

function normalizeGA4PropertyId(value: string) {
  return value.replace(/^properties\//, "").trim();
}

export async function startGoogleOAuth(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  let oauthUrl: string | null = null;
  try {
    oauthUrl = buildGoogleOAuthUrl(mediaId);
  } catch (error) {
    await logGoogleApiError(prisma, {
      mediaId,
      apiName: GoogleApiName.GOOGLE_OAUTH,
      endpoint: "local/google-oauth-start",
      requestType: RequestType.GOOGLE_OAUTH_START,
      errorMessage: error instanceof Error ? error.message : String(error),
      actionRequired: GoogleApiActionRequired.REAUTHORIZE,
    });
    revalidatePath("/");
  }
  if (oauthUrl) redirect(oauthUrl);
}

export async function disconnectGoogleConnection(formData: FormData) {
  const connectionId = z
    .string()
    .min(1)
    .parse(formData.get("googleConnectionId"));
  await prisma.googleConnection.update({
    where: { id: connectionId },
    data: {
      accessTokenEncrypted: null,
      refreshTokenEncrypted: null,
      tokenExpiresAt: null,
      refreshTokenAvailable: false,
      connectionStatus: GoogleConnectionStatus.DISABLED,
      lastError: null,
    },
  });
  revalidatePath("/");
}

export async function refreshGoogleConnectionStatus(formData: FormData) {
  const connectionId = z
    .string()
    .min(1)
    .parse(formData.get("googleConnectionId"));
  const connection = await prisma.googleConnection.findUniqueOrThrow({
    where: { id: connectionId },
  });
  if (!isGoogleRealConnectionEnabled()) {
    await prisma.googleConnection.update({
      where: { id: connection.id },
      data: { lastError: "Google real connection is disabled." },
    });
    await logGoogleApiError(prisma, {
      mediaId: connection.mediaId,
      googleConnectionId: connection.id,
      apiName: GoogleApiName.GOOGLE_OAUTH,
      endpoint: "local/google-refresh",
      requestType: RequestType.GOOGLE_TOKEN_REFRESH,
      errorMessage: "Google real connection is disabled.",
      actionRequired: GoogleApiActionRequired.REAUTHORIZE,
    });
  } else {
    try {
      await refreshGoogleAccessToken(prisma, connection.id);
    } catch {
      // refreshGoogleAccessToken persists the classified error and connection status.
    }
  }
  revalidatePath("/");
}

export async function testGA4PropertyConnection(formData: FormData) {
  const ga4PropertyId = z.string().min(1).parse(formData.get("ga4PropertyId"));
  const property = await prisma.gA4Property.findUniqueOrThrow({
    where: { id: ga4PropertyId },
  });
  const normalized = normalizeGA4PropertyId(property.propertyId);
  if (!isGoogleRealConnectionEnabled()) {
    await prisma.gA4Property.update({
      where: { id: property.id },
      data: {
        propertyId: normalized,
        connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
        lastError: "Google real connection is disabled.",
      },
    });
  } else if (!property.googleConnectionId) {
    await prisma.gA4Property.update({
      where: { id: property.id },
      data: {
        propertyId: normalized,
        connectionStatus: GooglePropertyStatus.FAILED,
        lastError: "GA4 property has no Google connection.",
      },
    });
  } else {
    await prisma.gA4Property.update({
      where: { id: property.id },
      data: {
        propertyId: normalized,
        connectionStatus: GooglePropertyStatus.CONNECTED,
        lastError: null,
      },
    });
  }
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ANALYTICS,
      eventType: "REQUEST",
      requestType: RequestType.GA4_API_TEST,
      endpoint: "local/ga4-test",
      method: "TEST",
      success:
        isGoogleRealConnectionEnabled() && Boolean(property.googleConnectionId),
      mockMode: !isGoogleRealConnectionEnabled(),
      message: isGoogleRealConnectionEnabled()
        ? property.googleConnectionId
          ? "GA4 property test queued for real API mode."
          : "GA4 property has no Google connection."
        : "GA4 real API disabled; property normalized only.",
    },
  });
  revalidatePath("/");
}

export async function testSearchConsolePropertyConnection(formData: FormData) {
  const propertyId = z
    .string()
    .min(1)
    .parse(formData.get("searchConsolePropertyId"));
  const property = await prisma.searchConsoleProperty.findUniqueOrThrow({
    where: { id: propertyId },
  });
  await prisma.searchConsoleProperty.update({
    where: { id: property.id },
    data: {
      connectionStatus:
        isGoogleRealConnectionEnabled() && property.googleConnectionId
          ? GooglePropertyStatus.CONNECTED
          : isGoogleRealConnectionEnabled()
            ? GooglePropertyStatus.FAILED
            : GooglePropertyStatus.MOCK_CONNECTED,
      lastError: isGoogleRealConnectionEnabled()
        ? property.googleConnectionId
          ? null
          : "Search Console property has no Google connection."
        : "Google real connection is disabled.",
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ANALYTICS,
      eventType: "REQUEST",
      requestType: RequestType.SEARCH_CONSOLE_API_TEST,
      endpoint: "local/search-console-test",
      method: "TEST",
      success:
        isGoogleRealConnectionEnabled() && Boolean(property.googleConnectionId),
      mockMode: !isGoogleRealConnectionEnabled(),
      message: isGoogleRealConnectionEnabled()
        ? property.googleConnectionId
          ? "Search Console property test queued for real API mode."
          : "Search Console property has no Google connection."
        : "Search Console real API disabled; property kept in mock-safe mode.",
    },
  });
  revalidatePath("/");
}

export async function createGoogleSyncJob(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const googleConnectionId =
    String(formData.get("googleConnectionId") ?? "").trim() || null;
  const jobName = z.string().trim().min(1).parse(formData.get("jobName"));
  const jobType = z
    .nativeEnum(GoogleSyncJobType)
    .parse(formData.get("jobType"));
  const targetPropertyId = z
    .string()
    .trim()
    .min(1)
    .parse(formData.get("targetPropertyId"));
  const syncSource =
    jobType === GoogleSyncJobType.GA4_SITE_DAILY ||
    jobType === GoogleSyncJobType.GA4_PAGE_DAILY
      ? GoogleSyncSource.GA4
      : GoogleSyncSource.SEARCH_CONSOLE;
  if (googleConnectionId) {
    const connection = await prisma.googleConnection.findUniqueOrThrow({
      where: { id: googleConnectionId },
    });
    if (connection.mediaId !== mediaId)
      throw new Error("Google connection belongs to a different media.");
  }
  if (syncSource === GoogleSyncSource.GA4) {
    const property = await prisma.gA4Property.findUniqueOrThrow({
      where: { id: targetPropertyId },
    });
    if (property.mediaId !== mediaId)
      throw new Error("GA4 property belongs to a different media.");
    if (
      googleConnectionId &&
      property.googleConnectionId &&
      property.googleConnectionId !== googleConnectionId
    ) {
      throw new Error("GA4 property belongs to a different Google connection.");
    }
  } else {
    const property = await prisma.searchConsoleProperty.findUniqueOrThrow({
      where: { id: targetPropertyId },
    });
    if (property.mediaId !== mediaId)
      throw new Error("Search Console property belongs to a different media.");
    if (
      googleConnectionId &&
      property.googleConnectionId &&
      property.googleConnectionId !== googleConnectionId
    ) {
      throw new Error(
        "Search Console property belongs to a different Google connection.",
      );
    }
  }
  await prisma.googleSyncJob.create({
    data: {
      mediaId,
      googleConnectionId,
      jobName,
      jobType,
      syncSource,
      targetPropertyId,
      defaultDays: z.coerce
        .number()
        .int()
        .min(1)
        .max(365)
        .catch(28)
        .parse(formData.get("defaultDays")),
      maxDays: z.coerce
        .number()
        .int()
        .min(1)
        .max(365)
        .catch(90)
        .parse(formData.get("maxDays")),
      status: GoogleSyncJobStatus.ACTIVE,
    },
  });
  revalidatePath("/");
}

export async function runGoogleSyncJobAction(formData: FormData) {
  const jobId = z.string().min(1).parse(formData.get("googleSyncJobId"));
  await runGoogleSyncJob(prisma, jobId);
  revalidatePath("/");
}

export async function pauseGoogleSyncJob(formData: FormData) {
  const jobId = z.string().min(1).parse(formData.get("googleSyncJobId"));
  await prisma.googleSyncJob.update({
    where: { id: jobId },
    data: { status: GoogleSyncJobStatus.PAUSED },
  });
  revalidatePath("/");
}

export async function resumeGoogleSyncJob(formData: FormData) {
  const jobId = z.string().min(1).parse(formData.get("googleSyncJobId"));
  await prisma.googleSyncJob.update({
    where: { id: jobId },
    data: { status: GoogleSyncJobStatus.ACTIVE },
  });
  revalidatePath("/");
}
