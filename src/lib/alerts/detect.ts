import {
  AlertIncidentStatus,
  AlertRuleType,
  AlertSeverity,
  FreshnessStatus,
  NotificationType,
  Platform,
  Prisma,
  type AlertRule,
  type PrismaClient,
} from "@prisma/client";
import { addHours, operationNumber } from "@/src/lib/operations/config";
import { createNotification } from "@/src/lib/notifications/center";

async function openIncident(
  prisma: PrismaClient,
  rule: AlertRule,
  input: {
    mediaId?: string | null;
    title: string;
    message: string;
    dedupKey: string;
    evidence?: Record<string, unknown>;
  },
) {
  const existing = await prisma.alertIncident.findUnique({
    where: { dedupKey: input.dedupKey },
  });
  if (
    existing &&
    existing.status !== AlertIncidentStatus.RESOLVED &&
    existing.status !== AlertIncidentStatus.DISMISSED
  ) {
    return existing;
  }
  const incident = await prisma.alertIncident.upsert({
    where: { dedupKey: input.dedupKey },
    update: {
      status: AlertIncidentStatus.OPEN,
      severity: rule.severity,
      title: input.title,
      message: input.message,
      detectedAt: new Date(),
      cooldownUntil: addHours(new Date(), rule.cooldownHours),
      evidence: input.evidence as Prisma.InputJsonValue | undefined,
    },
    create: {
      alertRuleId: rule.id,
      mediaId: input.mediaId ?? null,
      severity: rule.severity,
      dedupKey: input.dedupKey,
      title: input.title,
      message: input.message,
      cooldownUntil: addHours(new Date(), rule.cooldownHours),
      evidence: input.evidence as Prisma.InputJsonValue | undefined,
    },
  });
  await createNotification(prisma, {
    mediaId: input.mediaId,
    alertIncidentId: incident.id,
    type: NotificationType.ALERT,
    title: input.title,
    message: input.message,
    priority: rule.severity,
    dedupKey: `notification:${input.dedupKey}`,
  });
  return incident;
}

async function detectFreshness(prisma: PrismaClient, rule: AlertRule) {
  const stale = await prisma.dataFreshnessStatus.findMany({
    where: {
      status: {
        in: [
          FreshnessStatus.WARNING,
          FreshnessStatus.CRITICAL,
          FreshnessStatus.UNKNOWN,
        ],
      },
    },
    include: { media: true },
    take: 50,
  });
  for (const item of stale) {
    await openIncident(prisma, rule, {
      mediaId: item.mediaId,
      title: `${item.source} freshness ${item.status.toLowerCase()}`,
      message: item.message ?? `${item.source} has stale or missing data.`,
      dedupKey: `${rule.ruleKey}:${item.mediaId ?? "global"}:${item.source}:${item.status}`,
      evidence: {
        source: item.source,
        staleHours: item.staleHours,
        lastDataAt: item.lastDataAt,
      },
    });
  }
  return stale.length;
}

async function detectApiErrorSpike(prisma: PrismaClient, rule: AlertRule) {
  const threshold =
    rule.thresholdValue ?? operationNumber("API_ERROR_SPIKE_THRESHOLD");
  const since = new Date(Date.now() - rule.lookbackDays * 24 * 60 * 60 * 1000);
  const count = await prisma.apiUsageLog.count({
    where: {
      success: false,
      platform: {
        in: [Platform.ANALYTICS, Platform.OPERATIONS, Platform.SCHEDULER],
      },
      createdAt: { gte: since },
    },
  });
  if (count >= threshold) {
    await openIncident(prisma, rule, {
      title: "API error spike detected",
      message: `${count} API errors were recorded in the last ${rule.lookbackDays} day(s).`,
      dedupKey: `${rule.ruleKey}:global:${since.toISOString().slice(0, 10)}`,
      evidence: { count, threshold, since },
    });
    return 1;
  }
  return 0;
}

async function detectSyncFailure(prisma: PrismaClient, rule: AlertRule) {
  const since = new Date(Date.now() - rule.lookbackDays * 24 * 60 * 60 * 1000);
  const runs = await prisma.scheduledTaskRun.findMany({
    where: { status: "FAILED", createdAt: { gte: since } },
    include: { scheduledTask: true },
    take: 30,
  });
  for (const run of runs) {
    await openIncident(prisma, rule, {
      mediaId: run.mediaId,
      title: `Task failed: ${run.scheduledTask?.taskName ?? "unknown task"}`,
      message: run.errorMessage ?? run.summary ?? "Scheduled task failed.",
      dedupKey: `${rule.ruleKey}:${run.scheduledTaskId ?? run.id}`,
      evidence: {
        runId: run.id,
        status: run.status,
        errorMessage: run.errorMessage,
      },
    });
  }
  return runs.length;
}

export async function runAlertDetection(prisma: PrismaClient) {
  const rules = await prisma.alertRule.findMany({ where: { enabled: true } });
  let incidents = 0;
  for (const rule of rules) {
    if (rule.ruleType === AlertRuleType.DATA_FRESHNESS)
      incidents += await detectFreshness(prisma, rule);
    if (rule.ruleType === AlertRuleType.API_ERROR_SPIKE)
      incidents += await detectApiErrorSpike(prisma, rule);
    if (rule.ruleType === AlertRuleType.SYNC_FAILURE)
      incidents += await detectSyncFailure(prisma, rule);
  }
  return incidents;
}

export async function ensureAlertRules(prisma: PrismaClient) {
  const rules = [
    [
      "data-freshness",
      "Data freshness warning",
      AlertRuleType.DATA_FRESHNESS,
      AlertSeverity.WARNING,
      null,
    ],
    [
      "api-error-spike",
      "API error spike",
      AlertRuleType.API_ERROR_SPIKE,
      AlertSeverity.CRITICAL,
      operationNumber("API_ERROR_SPIKE_THRESHOLD"),
    ],
    [
      "sync-failure",
      "Scheduled sync failure",
      AlertRuleType.SYNC_FAILURE,
      AlertSeverity.WARNING,
      null,
    ],
    [
      "seo-clicks-drop",
      "SEO clicks drop",
      AlertRuleType.SEO_CLICKS_DROP,
      AlertSeverity.WARNING,
      operationNumber("SEO_CLICKS_DROP_THRESHOLD_PERCENT"),
    ],
    [
      "revenue-drop",
      "Revenue drop",
      AlertRuleType.REVENUE_DROP,
      AlertSeverity.CRITICAL,
      operationNumber("REVENUE_DROP_THRESHOLD_PERCENT"),
    ],
    [
      "social-drop",
      "Social impressions drop",
      AlertRuleType.SOCIAL_IMPRESSIONS_DROP,
      AlertSeverity.WARNING,
      operationNumber("SOCIAL_IMPRESSIONS_DROP_THRESHOLD_PERCENT"),
    ],
  ] as const;
  for (const [ruleKey, ruleName, ruleType, severity, thresholdValue] of rules) {
    await prisma.alertRule.upsert({
      where: { ruleKey },
      update: { ruleName, ruleType, severity, thresholdValue, enabled: true },
      create: {
        ruleKey,
        ruleName,
        ruleType,
        severity,
        thresholdValue,
        enabled: true,
      },
    });
  }
}
