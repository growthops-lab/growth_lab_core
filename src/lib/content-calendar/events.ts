import { ApiEventType, CalendarEventType, CampaignItemType, Platform, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createCalendarEvent(input: {
  campaignId?: string | null;
  mediaId: string;
  eventType: CalendarEventType;
  title: string;
  scheduledAt: Date;
  itemType?: CampaignItemType | null;
  itemId?: string | null;
  requiresApproval?: boolean;
  approvalStatus?: string | null;
  linkCheckStatus?: string | null;
  hasCreative?: boolean;
}) {
  const event = await prisma.contentCalendarEvent.create({
    data: {
      campaignId: input.campaignId,
      mediaId: input.mediaId,
      eventType: input.eventType,
      title: input.title,
      scheduledAt: input.scheduledAt,
      itemType: input.itemType,
      itemId: input.itemId,
      requiresApproval: input.requiresApproval ?? true,
      approvalStatus: input.approvalStatus,
      linkCheckStatus: input.linkCheckStatus,
      hasCreative: input.hasCreative ?? false
    }
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.CONTENT_CALENDAR,
      eventType: ApiEventType.REQUEST,
      endpoint: "content-calendar.event.create",
      requestType: RequestType.CALENDAR_EVENT_CREATE,
      mockMode: true
    }
  });

  return event;
}
