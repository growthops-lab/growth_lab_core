import {
  CalendarConflictType,
  CampaignRiskSeverity,
  Platform,
  ApiEventType,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

function dayBounds(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function detectCalendarConflicts(campaignId?: string) {
  const events = await prisma.contentCalendarEvent.findMany({
    where: campaignId ? { campaignId } : undefined,
    orderBy: { scheduledAt: "asc" },
  });
  const created = [];
  const maxPosts = Math.max(
    1,
    Number(process.env.CONTENT_CALENDAR_MAX_SOCIAL_POSTS_PER_DAY ?? "3"),
  );

  for (const event of events) {
    const reasons: Array<{
      type: CalendarConflictType;
      title: string;
      description: string;
    }> = [];
    if (event.requiresApproval && event.approvalStatus !== "APPROVED") {
      reasons.push({
        type: CalendarConflictType.MISSING_APPROVAL,
        title: "Missing approval",
        description: `${event.title} requires human approval.`,
      });
    }
    if (
      event.eventType === "SNS_POST" &&
      event.linkCheckStatus !== "PASSED" &&
      event.linkCheckStatus !== "SAFE"
    ) {
      reasons.push({
        type: CalendarConflictType.MISSING_LINK_CHECK,
        title: "Missing link check",
        description: `${event.title} needs link check before posting.`,
      });
    }
    if (
      (event.eventType === "SNS_POST" ||
        event.eventType === "WORDPRESS_PUBLISH") &&
      !event.hasCreative
    ) {
      reasons.push({
        type: CalendarConflictType.MISSING_CREATIVE,
        title: "Missing creative",
        description: `${event.title} has no creative asset attached.`,
      });
    }
    if (event.eventType === "SNS_POST") {
      const { start, end } = dayBounds(event.scheduledAt);
      const count = await prisma.contentCalendarEvent.count({
        where: {
          mediaId: event.mediaId,
          eventType: "SNS_POST",
          scheduledAt: { gte: start, lt: end },
        },
      });
      if (count > maxPosts) {
        reasons.push({
          type: CalendarConflictType.TOO_MANY_POSTS_SAME_DAY,
          title: "Too many social posts",
          description: `${count} SNS posts are scheduled on the same day.`,
        });
      }
    }

    for (const reason of reasons) {
      const existing = await prisma.contentCalendarConflict.findFirst({
        where: {
          calendarEventId: event.id,
          conflictType: reason.type,
          status: "OPEN",
        },
      });
      if (existing) continue;

      const conflict = await prisma.contentCalendarConflict.create({
        data: {
          campaignId: event.campaignId,
          calendarEventId: event.id,
          conflictType: reason.type,
          severity: CampaignRiskSeverity.WARNING,
          title: reason.title,
          description: reason.description,
        },
      });
      created.push(conflict);
    }
  }

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CONTENT_CALENDAR,
      eventType: ApiEventType.REQUEST,
      endpoint: "content-calendar.conflict.detect",
      requestType: RequestType.CALENDAR_CONFLICT_DETECT,
      mockMode: true,
      message: `Detected ${created.length} calendar conflicts.`,
    },
  });

  return created;
}
