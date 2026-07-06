import { OperationsHealthStatus, type PrismaClient } from "@prisma/client";

export async function createOperationsHealthSnapshot(prisma: PrismaClient) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [openAlerts, criticalAlerts, failedRuns, staleFreshness, activeTasks] = await Promise.all([
    prisma.alertIncident.count({ where: { status: "OPEN" } }),
    prisma.alertIncident.count({ where: { status: "OPEN", severity: "CRITICAL" } }),
    prisma.scheduledTaskRun.count({ where: { status: "FAILED", createdAt: { gte: since } } }),
    prisma.dataFreshnessStatus.count({ where: { status: { in: ["WARNING", "CRITICAL", "UNKNOWN"] } } }),
    prisma.scheduledTask.count({ where: { enabled: true } })
  ]);
  const status =
    criticalAlerts > 0 || failedRuns > 3
      ? OperationsHealthStatus.CRITICAL
      : openAlerts > 0 || staleFreshness > 0
        ? OperationsHealthStatus.WARNING
        : OperationsHealthStatus.HEALTHY;
  return prisma.operationsHealthSnapshot.create({
    data: {
      status,
      scheduledTasksOk: failedRuns === 0,
      freshnessOk: staleFreshness === 0,
      apiQuotaOk: true,
      openAlerts,
      failedRuns,
      summary: `${activeTasks} enabled task(s), ${openAlerts} open alert(s), ${failedRuns} failed run(s) in 24h.`,
      details: { criticalAlerts, staleFreshness, activeTasks }
    }
  });
}

export async function createWeeklyOperationsReport(prisma: PrismaClient) {
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 7);
  const [taskRunCount, failedRunCount, openAlertCount, criticalAlertCount, notificationCount] = await Promise.all([
    prisma.scheduledTaskRun.count({ where: { createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.scheduledTaskRun.count({ where: { status: "FAILED", createdAt: { gte: periodStart, lte: periodEnd } } }),
    prisma.alertIncident.count({ where: { status: "OPEN" } }),
    prisma.alertIncident.count({ where: { status: "OPEN", severity: "CRITICAL" } }),
    prisma.notificationEvent.count({ where: { createdAt: { gte: periodStart, lte: periodEnd } } })
  ]);
  const status =
    criticalAlertCount > 0 || failedRunCount > 3
      ? OperationsHealthStatus.CRITICAL
      : openAlertCount > 0 || failedRunCount > 0
        ? OperationsHealthStatus.WARNING
        : OperationsHealthStatus.HEALTHY;
  return prisma.weeklyOperationsReport.create({
    data: {
      periodStart,
      periodEnd,
      status,
      taskRunCount,
      failedRunCount,
      openAlertCount,
      criticalAlertCount,
      notificationCount,
      summary: `Weekly operations: ${taskRunCount} runs, ${failedRunCount} failures, ${openAlertCount} open alerts.`,
      recommendations: [
        failedRunCount > 0 ? "Review failed task runs before enabling production automation." : "No failed scheduled runs.",
        openAlertCount > 0 ? "Resolve or acknowledge open alerts." : "Alert queue is clear."
      ]
    }
  });
}
