import {
  ApiEventType,
  GoogleSyncRunType,
  NotificationType,
  Platform,
  RequestType,
  ScheduledTaskRunStatus,
  ScheduledTaskRunType,
  ScheduledTaskStatus,
  ScheduledTaskType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { runAlertDetection } from "@/src/lib/alerts/detect";
import { calculateGrowthScore } from "@/src/lib/growth-score/calculate";
import { createNotification } from "@/src/lib/notifications/center";
import { checkDataFreshness } from "@/src/lib/operations/freshness";
import {
  createOperationsHealthSnapshot,
  createWeeklyOperationsReport,
} from "@/src/lib/operations/health";
import {
  addMinutes,
  nextCronApproximation,
  OPERATION_DEFAULT_SETTINGS,
} from "@/src/lib/operations/config";
import { runGoogleSyncJob } from "@/src/lib/sync/jobs";

function shouldDryRun(taskDryRun: boolean) {
  return (
    taskDryRun || OPERATION_DEFAULT_SETTINGS.OPERATIONS_DRY_RUN_MODE === "true"
  );
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function leaseKeyForTask(taskId: string) {
  return `scheduled-task:${taskId}`;
}

function leaseOwner(runType: ScheduledTaskRunType) {
  return `${runType.toLowerCase()}-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function acquireTaskLease(
  prisma: PrismaClient,
  taskId: string,
  ownerId: string,
) {
  const now = new Date();
  const expiresAt = addMinutes(
    now,
    Number(OPERATION_DEFAULT_SETTINGS.SYNC_STALE_LOCK_MINUTES),
  );
  const leaseKey = leaseKeyForTask(taskId);
  try {
    return await prisma.taskLease.create({
      data: {
        scheduledTaskId: taskId,
        leaseKey,
        ownerId,
        acquiredAt: now,
        heartbeatAt: now,
        expiresAt,
      },
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
  }

  const existing = await prisma.taskLease.findUnique({ where: { leaseKey } });
  if (!existing) return null;
  if (!existing.releasedAt && existing.expiresAt > now) return null;
  return prisma.taskLease.update({
    where: { id: existing.id },
    data: {
      scheduledTaskId: taskId,
      ownerId,
      acquiredAt: now,
      heartbeatAt: now,
      expiresAt,
      releasedAt: null,
    },
  });
}

async function heartbeatTaskLease(
  prisma: PrismaClient,
  leaseId: string,
  ownerId: string,
) {
  await prisma.taskLease.updateMany({
    where: { id: leaseId, ownerId, releasedAt: null },
    data: {
      heartbeatAt: new Date(),
      expiresAt: addMinutes(
        new Date(),
        Number(OPERATION_DEFAULT_SETTINGS.SYNC_STALE_LOCK_MINUTES),
      ),
    },
  });
}

async function releaseTaskLease(
  prisma: PrismaClient,
  leaseId: string,
  ownerId: string,
) {
  await prisma.taskLease.updateMany({
    where: { id: leaseId, ownerId, releasedAt: null },
    data: { releasedAt: new Date() },
  });
}

async function runGoogleTasks(
  prisma: PrismaClient,
  taskType: ScheduledTaskType,
) {
  const jobTypes =
    taskType === ScheduledTaskType.GA4_SYNC
      ? ["GA4_SITE_DAILY", "GA4_PAGE_DAILY"]
      : taskType === ScheduledTaskType.GSC_QUERY_SYNC
        ? ["GSC_QUERY_DAILY"]
        : taskType === ScheduledTaskType.GSC_PAGE_SYNC
          ? ["GSC_PAGE_DAILY"]
          : ["GSC_QUERY_PAGE_DAILY"];
  const jobs = await prisma.googleSyncJob.findMany({
    where: {
      jobType: { in: jobTypes as Prisma.EnumGoogleSyncJobTypeFilter["in"] },
      status: "ACTIVE",
    },
    take: 10,
  });
  for (const job of jobs) {
    await runGoogleSyncJob(prisma, job.id, GoogleSyncRunType.SCHEDULED);
  }
  return jobs.length;
}

async function recalcGrowthScores(prisma: PrismaClient) {
  const mediaItems = await prisma.media.findMany({ select: { id: true } });
  let updated = 0;
  for (const media of mediaItems) {
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd);
    periodStart.setDate(
      periodStart.getDate() -
        Number(process.env.GROWTH_SCORE_DEFAULT_PERIOD_DAYS ?? 30),
    );
    const result = await calculateGrowthScore(prisma, {
      mediaId: media.id,
      start: periodStart,
      end: periodEnd,
    });
    await prisma.growthScoreSnapshot.create({
      data: {
        mediaId: media.id,
        periodStart,
        periodEnd,
        trafficScore: result.trafficScore,
        revenueScore: result.revenueScore,
        conversionScore: result.conversionScore,
        contentScore: result.contentScore,
        riskScore: result.riskScore,
        totalScore: result.totalScore,
        recommendation: result.recommendation,
        dataConfidence: result.dataConfidence,
        dataWarnings: result.dataWarnings,
        reasoning: result.reasoning,
        requiresHumanReview: true,
      },
    });
    await prisma.media.update({
      where: { id: media.id },
      data: { growthScore: result.totalScore },
    });
    updated += 1;
  }
  return updated;
}

async function executeTaskBody(
  prisma: PrismaClient,
  taskType: ScheduledTaskType,
) {
  if (
    taskType === ScheduledTaskType.GA4_SYNC ||
    taskType === ScheduledTaskType.GSC_QUERY_SYNC ||
    taskType === ScheduledTaskType.GSC_PAGE_SYNC ||
    taskType === ScheduledTaskType.GSC_QUERY_PAGE_SYNC
  ) {
    return runGoogleTasks(prisma, taskType);
  }
  if (taskType === ScheduledTaskType.DATA_FRESHNESS_CHECK)
    return checkDataFreshness(prisma);
  if (
    taskType === ScheduledTaskType.SEO_DROP_DETECTION ||
    taskType === ScheduledTaskType.REVENUE_DROP_DETECTION ||
    taskType === ScheduledTaskType.SOCIAL_DROP_DETECTION ||
    taskType === ScheduledTaskType.API_ERROR_SPIKE
  ) {
    return runAlertDetection(prisma);
  }
  if (taskType === ScheduledTaskType.GROWTH_SCORE_RECALC)
    return recalcGrowthScores(prisma);
  if (taskType === ScheduledTaskType.GSB_WEEKLY_REPORT) {
    await createWeeklyOperationsReport(prisma);
    return 1;
  }
  if (taskType === ScheduledTaskType.HEALTH_CHECK) {
    await createOperationsHealthSnapshot(prisma);
    return 1;
  }
  return 0;
}

export async function recoverStaleTaskRuns(prisma: PrismaClient) {
  const timeoutMinutes = Number(
    OPERATION_DEFAULT_SETTINGS.SYNC_JOB_TIMEOUT_MINUTES,
  );
  const staleBefore = new Date(Date.now() - timeoutMinutes * 60 * 1000);
  const result = await prisma.scheduledTaskRun.updateMany({
    where: { status: "RUNNING", startedAt: { lt: staleBefore } },
    data: {
      status: ScheduledTaskRunStatus.STALE_RECOVERED,
      finishedAt: new Date(),
      errorMessage: `Recovered stale run after ${timeoutMinutes} minutes.`,
    },
  });
  await prisma.taskLease.updateMany({
    where: { releasedAt: null, expiresAt: { lt: new Date() } },
    data: { releasedAt: new Date() },
  });
  return result.count;
}

export async function runScheduledTask(
  prisma: PrismaClient,
  taskId: string,
  runType: ScheduledTaskRunType = ScheduledTaskRunType.MANUAL,
) {
  const task = await prisma.scheduledTask.findUniqueOrThrow({
    where: { id: taskId },
  });
  const dryRun = shouldDryRun(task.dryRun);
  const ownerId = leaseOwner(runType);
  const lease = await acquireTaskLease(prisma, task.id, ownerId);
  if (!lease) {
    const activeLease = await prisma.taskLease.findUnique({
      where: { leaseKey: leaseKeyForTask(task.id) },
    });
    const retryAt =
      activeLease?.expiresAt && activeLease.expiresAt > new Date()
        ? activeLease.expiresAt
        : addMinutes(new Date(), 1);
    const lockedRun = await prisma.scheduledTaskRun.create({
      data: {
        scheduledTaskId: task.id,
        mediaId: task.mediaId,
        runType,
        status: ScheduledTaskRunStatus.LOCKED,
        startedAt: new Date(),
        finishedAt: new Date(),
        summary: `Task is already locked by another worker or manual run. Retrying after ${retryAt.toISOString()}.`,
      },
    });
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        status: ScheduledTaskStatus.LOCKED,
        lastRunAt: new Date(),
        nextRunAt: retryAt,
        lastError: "Task lease is already active.",
      },
    });
    return lockedRun.id;
  }
  const run = await prisma.scheduledTaskRun.create({
    data: {
      scheduledTaskId: task.id,
      mediaId: task.mediaId,
      runType: dryRun ? ScheduledTaskRunType.DRY_RUN : runType,
      status: ScheduledTaskRunStatus.RUNNING,
      startedAt: new Date(),
      heartbeatAt: new Date(),
      attempt: 1,
    },
  });
  try {
    if (!task.enabled && runType === ScheduledTaskRunType.SCHEDULED) {
      await prisma.scheduledTaskRun.update({
        where: { id: run.id },
        data: {
          status: ScheduledTaskRunStatus.SKIPPED,
          finishedAt: new Date(),
          summary: "Task is disabled.",
        },
      });
      return run.id;
    }
    await heartbeatTaskLease(prisma, lease.id, ownerId);
    const rowsWritten = dryRun
      ? 0
      : await executeTaskBody(prisma, task.taskType);
    const status = dryRun
      ? ScheduledTaskRunStatus.DRY_RUN
      : ScheduledTaskRunStatus.SUCCESS;
    await prisma.scheduledTaskRun.update({
      where: { id: run.id },
      data: {
        status,
        finishedAt: new Date(),
        rowsWritten,
        summary: dryRun
          ? "Dry-run completed. No external API write or send was performed."
          : `Completed with ${rowsWritten} item(s).`,
      },
    });
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        status: dryRun
          ? ScheduledTaskStatus.DRY_RUN
          : ScheduledTaskStatus.SUCCESS,
        lastRunAt: new Date(),
        lastSuccessAt: dryRun ? task.lastSuccessAt : new Date(),
        nextRunAt: nextCronApproximation(task.cronExpression),
        lastError: null,
      },
    });
    await prisma.apiUsageLog.create({
      data: {
        platform: Platform.OPERATIONS,
        eventType: dryRun ? ApiEventType.DRY_RUN : ApiEventType.REQUEST,
        requestType: dryRun
          ? RequestType.SCHEDULED_TASK_DRY_RUN
          : RequestType.SCHEDULED_TASK_RUN,
        endpoint: `operations/${task.taskKey}`,
        method: runType,
        success: true,
        mockMode: dryRun,
        message: `${task.taskName} ${dryRun ? "dry-run" : "run"} completed.`,
      },
    });
    await createNotification(prisma, {
      mediaId: task.mediaId,
      scheduledTaskRunId: run.id,
      type: NotificationType.TASK_RUN,
      title: `Task completed: ${task.taskName}`,
      message: dryRun
        ? "Dry-run completed safely."
        : "Scheduled task completed.",
      dedupKey: `task-run:${task.id}:${new Date().toISOString().slice(0, 10)}`,
    });
    return run.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.scheduledTaskRun.update({
      where: { id: run.id },
      data: {
        status: ScheduledTaskRunStatus.FAILED,
        finishedAt: new Date(),
        errorCount: 1,
        errorMessage: message,
      },
    });
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        status: ScheduledTaskStatus.FAILED,
        lastRunAt: new Date(),
        nextRunAt: nextCronApproximation(task.cronExpression),
        lastError: message,
      },
    });
    await prisma.apiUsageLog.create({
      data: {
        platform: Platform.OPERATIONS,
        eventType: ApiEventType.ERROR,
        requestType: RequestType.SCHEDULED_TASK_RUN,
        endpoint: `operations/${task.taskKey}`,
        method: runType,
        success: false,
        mockMode: dryRun,
        message,
      },
    });
    throw error;
  } finally {
    await releaseTaskLease(prisma, lease.id, ownerId);
  }
}

export async function runDueScheduledTasks(prisma: PrismaClient) {
  if (OPERATION_DEFAULT_SETTINGS.SYNC_WORKER_ENABLED !== "true") return 0;
  await recoverStaleTaskRuns(prisma);
  if (OPERATION_DEFAULT_SETTINGS.OPERATIONS_AUTOMATION_ENABLED !== "true")
    return 0;
  const now = new Date();
  const tasks = await prisma.scheduledTask.findMany({
    where: { enabled: true, nextRunAt: { lte: now } },
    orderBy: { nextRunAt: "asc" },
    take: Number(OPERATION_DEFAULT_SETTINGS.SYNC_MAX_JOBS_PER_TICK),
  });
  let processed = 0;
  for (const task of tasks) {
    try {
      await runScheduledTask(prisma, task.id, ScheduledTaskRunType.SCHEDULED);
      processed += 1;
    } catch {
      processed += 1;
    }
  }
  return processed;
}
