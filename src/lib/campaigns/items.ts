import {
  ApiEventType,
  CampaignItemStatus,
  CampaignItemType,
  Platform,
  RequestType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function attachCampaignItem(input: {
  campaignId: string;
  itemType: CampaignItemType;
  itemId: string;
  itemTitle?: string | null;
  allocationRate?: number;
}) {
  const allocationRate = input.allocationRate ?? 1;
  if (allocationRate <= 0 || allocationRate > 1) {
    throw new Error(
      "Campaign item allocationRate must be greater than 0 and at most 1.",
    );
  }

  const existing = await prisma.campaignItem.findUnique({
    where: {
      campaignId_itemType_itemId: {
        campaignId: input.campaignId,
        itemType: input.itemType,
        itemId: input.itemId,
      },
    },
  });
  if (existing) {
    await prisma.apiUsageLog.create({
      data: {
        platform: Platform.CAMPAIGN,
        eventType: ApiEventType.DRY_RUN,
        endpoint: "campaign.item.attach",
        requestType: RequestType.CAMPAIGN_ITEM_DUPLICATE_BLOCK,
        mockMode: true,
        message: `Duplicate CampaignItem blocked for ${input.itemType}:${input.itemId}`,
      },
    });
    return existing;
  }

  return prisma.campaignItem.create({
    data: {
      campaignId: input.campaignId,
      itemType: input.itemType,
      itemId: input.itemId,
      itemTitle: input.itemTitle,
      allocationRate,
      status: CampaignItemStatus.PLANNED,
    },
  });
}
