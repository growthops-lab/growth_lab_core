"use server";

import { NotificationStatus, ScheduledTaskRunType, ScheduledTaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { runAlertDetection } from "@/src/lib/alerts/detect";
import { createNotification } from "@/src/lib/notifications/center";
import { checkDataFreshness } from "@/src/lib/operations/freshness";
import { createOperationsHealthSnapshot } from "@/src/lib/operations/health";
import { recoverStaleTaskRuns, runScheduledTask } from "@/src/lib/operations/runner";

export async function runScheduledTaskAction(formData: FormData) {
  const taskId = z.string().min(1).parse(formData.get("scheduledTaskId"));
  await runScheduledTask(prisma, taskId, ScheduledTaskRunType.MANUAL);
  revalidatePath("/");
}

export async function pauseScheduledTask(formData: FormData) {
  const taskId = z.string().min(1).parse(formData.get("scheduledTaskId"));
  await prisma.scheduledTask.update({ where: { id: taskId }, data: { enabled: false, status: ScheduledTaskStatus.PAUSED } });
  revalidatePath("/");
}

export async function resumeScheduledTask(formData: FormData) {
  const taskId = z.string().min(1).parse(formData.get("scheduledTaskId"));
  await prisma.scheduledTask.update({ where: { id: taskId }, data: { enabled: true, status: ScheduledTaskStatus.ACTIVE } });
  revalidatePath("/");
}

export async function runFreshnessCheckAction() {
  await checkDataFreshness(prisma);
  revalidatePath("/");
}

export async function runAlertDetectionAction() {
  await runAlertDetection(prisma);
  revalidatePath("/");
}

export async function runOperationsHealthCheckAction() {
  await createOperationsHealthSnapshot(prisma);
  await recoverStaleTaskRuns(prisma);
  revalidatePath("/");
}

export async function markNotificationRead(formData: FormData) {
  const notificationId = z.string().min(1).parse(formData.get("notificationEventId"));
  await prisma.notificationEvent.update({
    where: { id: notificationId },
    data: { status: NotificationStatus.READ, readAt: new Date() }
  });
  revalidatePath("/");
}

export async function dismissNotification(formData: FormData) {
  const notificationId = z.string().min(1).parse(formData.get("notificationEventId"));
  await prisma.notificationEvent.update({
    where: { id: notificationId },
    data: { status: NotificationStatus.DISMISSED, dismissedAt: new Date() }
  });
  revalidatePath("/");
}

export async function acknowledgeAlertIncident(formData: FormData) {
  const alertIncidentId = z.string().min(1).parse(formData.get("alertIncidentId"));
  await prisma.alertIncident.update({
    where: { id: alertIncidentId },
    data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() }
  });
  revalidatePath("/");
}

export async function resolveAlertIncident(formData: FormData) {
  const alertIncidentId = z.string().min(1).parse(formData.get("alertIncidentId"));
  await prisma.alertIncident.update({
    where: { id: alertIncidentId },
    data: { status: "RESOLVED", resolvedAt: new Date() }
  });
  revalidatePath("/");
}

export async function createSystemNotificationAction(formData: FormData) {
  const title = z.string().trim().min(1).parse(formData.get("title"));
  const message = z.string().trim().min(1).parse(formData.get("message"));
  await createNotification(prisma, {
    type: "SYSTEM",
    title,
    message,
    dedupKey: `manual:${title}:${new Date().toISOString().slice(0, 10)}`
  });
  revalidatePath("/");
}
