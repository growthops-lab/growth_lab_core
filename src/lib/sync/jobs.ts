import {
  GoogleApiActionRequired,
  GoogleApiName,
  GoogleSyncJobStatus,
  GoogleSyncJobType,
  GoogleSyncRunStatus,
  GoogleSyncRunType,
  RequestType,
  type PrismaClient
} from "@prisma/client";
import { syncGA4PageDaily, syncGA4SiteDaily } from "@/src/lib/ga4/sync";
import { isGoogleRealConnectionEnabled } from "@/src/lib/google/oauth";
import { logGoogleApiError } from "@/src/lib/google/sync-log";
import { syncSearchConsolePageDaily, syncSearchConsoleQueryDaily, syncSearchConsoleQueryPageDaily } from "@/src/lib/search-console/sync";
import { hasActiveGoogleSyncLock } from "@/src/lib/sync/locks";

function rangeFromDays(days: number, maxDays: number) {
  const safeDays = Math.max(1, Math.min(days, maxDays));
  const periodEnd = new Date();
  periodEnd.setHours(0, 0, 0, 0);
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - safeDays + 1);
  return { periodStart, periodEnd };
}

export async function runGoogleSyncJob(prisma: PrismaClient, jobId: string, runType: GoogleSyncRunType = GoogleSyncRunType.MANUAL) {
  const job = await prisma.googleSyncJob.findUniqueOrThrow({ where: { id: jobId } });
  const { periodStart, periodEnd } = rangeFromDays(job.defaultDays, job.maxDays);
  if (job.status !== GoogleSyncJobStatus.ACTIVE) {
    const run = await prisma.googleSyncRun.create({
      data: {
        googleSyncJobId: job.id,
        mediaId: job.mediaId,
        googleConnectionId: job.googleConnectionId,
        runType,
        status: GoogleSyncRunStatus.CANCELLED,
        periodStart,
        periodEnd,
        startedAt: new Date(),
        finishedAt: new Date(),
        errorSummary: `Sync job is ${job.status.toLowerCase()}.`
      }
    });
    return run.id;
  }
  if (await hasActiveGoogleSyncLock(prisma, { mediaId: job.mediaId, googleSyncJobId: job.id })) {
    throw new Error("Google sync job is already running.");
  }
  const run = await prisma.googleSyncRun.create({
    data: {
      googleSyncJobId: job.id,
      mediaId: job.mediaId,
      googleConnectionId: job.googleConnectionId,
      runType,
      status: GoogleSyncRunStatus.RUNNING,
      periodStart,
      periodEnd,
      startedAt: new Date()
    }
  });
  try {
    if (!isGoogleRealConnectionEnabled()) {
      throw new Error("Google real connection is disabled. Enable GOOGLE_API_REAL_CONNECTION_ENABLED=true to run real API sync.");
    }
    if (!job.targetPropertyId) throw new Error("Sync job has no target property.");
    if (job.jobType === GoogleSyncJobType.GA4_SITE_DAILY) {
      await syncGA4SiteDaily(prisma, { ga4PropertyId: job.targetPropertyId, periodStart, periodEnd, googleSyncRunId: run.id });
    } else if (job.jobType === GoogleSyncJobType.GA4_PAGE_DAILY) {
      await syncGA4PageDaily(prisma, { ga4PropertyId: job.targetPropertyId, periodStart, periodEnd, googleSyncRunId: run.id });
    } else if (job.jobType === GoogleSyncJobType.GSC_QUERY_DAILY) {
      await syncSearchConsoleQueryDaily(prisma, { searchConsolePropertyId: job.targetPropertyId, periodStart, periodEnd, googleSyncRunId: run.id });
    } else if (job.jobType === GoogleSyncJobType.GSC_PAGE_DAILY) {
      await syncSearchConsolePageDaily(prisma, { searchConsolePropertyId: job.targetPropertyId, periodStart, periodEnd, googleSyncRunId: run.id });
    } else if (job.jobType === GoogleSyncJobType.GSC_QUERY_PAGE_DAILY) {
      await syncSearchConsoleQueryPageDaily(prisma, { searchConsolePropertyId: job.targetPropertyId, periodStart, periodEnd, googleSyncRunId: run.id });
    }
    await prisma.googleSyncJob.update({ where: { id: job.id }, data: { lastRunAt: new Date(), status: GoogleSyncJobStatus.ACTIVE } });
    return run.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const realConnectionDisabled = message.includes("Google real connection is disabled");
    await prisma.googleSyncRun.update({
      where: { id: run.id },
      data: {
        status: realConnectionDisabled ? GoogleSyncRunStatus.CANCELLED : GoogleSyncRunStatus.FAILED,
        finishedAt: new Date(),
        failedRows: realConnectionDisabled ? 0 : 1,
        errorSummary: message
      }
    });
    await prisma.googleSyncJob.update({
      where: { id: job.id },
      data: { status: realConnectionDisabled ? GoogleSyncJobStatus.ACTIVE : GoogleSyncJobStatus.FAILED, lastRunAt: new Date() }
    });
    await logGoogleApiError(prisma, {
      mediaId: job.mediaId,
      googleConnectionId: job.googleConnectionId,
      apiName: job.syncSource === "GA4" ? GoogleApiName.GA4 : GoogleApiName.SEARCH_CONSOLE,
      endpoint: "local/google-sync-job",
      requestType: RequestType.GOOGLE_SYNC_JOB_RUN,
      errorMessage: message,
      actionRequired: isGoogleRealConnectionEnabled() ? GoogleApiActionRequired.NONE : GoogleApiActionRequired.REAUTHORIZE
    });
    return run.id;
  }
}
