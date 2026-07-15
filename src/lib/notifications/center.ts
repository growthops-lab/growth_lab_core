import {
  AlertSeverity,
  NotificationChannelStatus,
  NotificationChannelType,
  NotificationDeliveryStatus,
  NotificationStatus,
  NotificationType,
  Prisma,
  type PrismaClient,
} from "@prisma/client";
import { OPERATION_DEFAULT_SETTINGS } from "@/src/lib/operations/config";

type CreateNotificationInput = {
  mediaId?: string | null;
  alertIncidentId?: string | null;
  scheduledTaskRunId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  priority?: AlertSeverity;
  dedupKey?: string;
  metadata?: Record<string, unknown>;
};

export async function ensureNotificationChannels(prisma: PrismaClient) {
  const channels = [
    {
      channelKey: "in-app",
      name: "In-app notification center",
      channelType: NotificationChannelType.IN_APP,
      status: NotificationChannelStatus.ENABLED,
      mockMode: true,
    },
    {
      channelKey: "mock-outbox",
      name: "Mock outbox",
      channelType: NotificationChannelType.MOCK,
      status: NotificationChannelStatus.ENABLED,
      mockMode: true,
    },
    {
      channelKey: "email-disabled",
      name: "Email notification disabled",
      channelType: NotificationChannelType.EMAIL,
      status:
        OPERATION_DEFAULT_SETTINGS.EMAIL_NOTIFICATION_ENABLED === "true"
          ? NotificationChannelStatus.ENABLED
          : NotificationChannelStatus.DISABLED,
      mockMode: true,
    },
    {
      channelKey: "slack-disabled",
      name: "Slack notification disabled",
      channelType: NotificationChannelType.SLACK,
      status:
        OPERATION_DEFAULT_SETTINGS.SLACK_NOTIFICATION_ENABLED === "true"
          ? NotificationChannelStatus.ENABLED
          : NotificationChannelStatus.DISABLED,
      mockMode: true,
    },
  ];
  for (const channel of channels) {
    await prisma.notificationChannel.upsert({
      where: { channelKey: channel.channelKey },
      update: channel,
      create: channel,
    });
  }
}

export async function createNotification(
  prisma: PrismaClient,
  input: CreateNotificationInput,
) {
  if (OPERATION_DEFAULT_SETTINGS.NOTIFICATION_CENTER_ENABLED !== "true")
    return null;
  if (input.dedupKey) {
    const existing = await prisma.notificationEvent.findFirst({
      where: {
        dedupKey: input.dedupKey,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if (existing) return existing;
  }

  await ensureNotificationChannels(prisma);
  const event = await prisma.notificationEvent.create({
    data: {
      mediaId: input.mediaId ?? null,
      alertIncidentId: input.alertIncidentId ?? null,
      scheduledTaskRunId: input.scheduledTaskRunId ?? null,
      type: input.type,
      status: NotificationStatus.UNREAD,
      title: input.title,
      message: input.message,
      priority: input.priority ?? AlertSeverity.INFO,
      dedupKey: input.dedupKey,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });

  const channels = await prisma.notificationChannel.findMany({
    where: { status: NotificationChannelStatus.ENABLED },
  });
  for (const channel of channels) {
    await prisma.notificationDelivery.upsert({
      where: {
        notificationEventId_notificationChannelId: {
          notificationEventId: event.id,
          notificationChannelId: channel.id,
        },
      },
      update: {
        status: channel.mockMode
          ? NotificationDeliveryStatus.MOCK_SENT
          : NotificationDeliveryStatus.SENT,
        attemptedAt: new Date(),
        deliveredAt: new Date(),
        errorMessage: null,
      },
      create: {
        notificationEventId: event.id,
        notificationChannelId: channel.id,
        status: channel.mockMode
          ? NotificationDeliveryStatus.MOCK_SENT
          : NotificationDeliveryStatus.SENT,
        attemptedAt: new Date(),
        deliveredAt: new Date(),
      },
    });
  }

  return event;
}
