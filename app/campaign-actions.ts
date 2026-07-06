"use server";

import { revalidatePath } from "next/cache";
import { CampaignItemType, CampaignType, ReportExportFormat } from "@prisma/client";
import { createCampaignBusinessInsight } from "@/src/lib/business-insights/summary";
import { createCampaign } from "@/src/lib/campaigns/campaigns";
import { calculateCampaignGrowthScore } from "@/src/lib/campaigns/growth-score";
import { attachCampaignItem } from "@/src/lib/campaigns/items";
import { calculateCampaignRoi } from "@/src/lib/campaigns/roi";
import { detectCalendarConflicts } from "@/src/lib/content-calendar/conflicts";
import { generateCampaignReport } from "@/src/lib/reports/generate";
import { exportReport } from "@/src/lib/reports/export";

function parseDate(value: FormDataEntryValue | null, fallbackDays = 0) {
  const raw = String(value ?? "").trim();
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const date = new Date();
  date.setDate(date.getDate() + fallbackDays);
  return date;
}

export async function createCampaignAction(formData: FormData) {
  await createCampaign({
    mediaId: String(formData.get("mediaId")),
    campaignName: String(formData.get("campaignName")),
    campaignCode: String(formData.get("campaignCode")),
    campaignType: String(formData.get("campaignType")) as CampaignType,
    periodStart: parseDate(formData.get("periodStart")),
    periodEnd: parseDate(formData.get("periodEnd"), 28),
    owner: String(formData.get("owner") || "local-admin"),
    primaryGoal: String(formData.get("primaryGoal") || "")
  });
  revalidatePath("/");
}

export async function attachCampaignItemAction(formData: FormData) {
  await attachCampaignItem({
    campaignId: String(formData.get("campaignId")),
    itemType: String(formData.get("itemType")) as CampaignItemType,
    itemId: String(formData.get("itemId")),
    itemTitle: String(formData.get("itemTitle") || ""),
    allocationRate: Number(formData.get("allocationRate") || 1)
  });
  revalidatePath("/");
}

export async function calculateCampaignRoiAction(formData: FormData) {
  await calculateCampaignRoi(String(formData.get("campaignId")));
  revalidatePath("/");
}

export async function calculateCampaignGrowthScoreAction(formData: FormData) {
  await calculateCampaignGrowthScore(String(formData.get("campaignId")));
  revalidatePath("/");
}

export async function detectCalendarConflictsAction(formData: FormData) {
  await detectCalendarConflicts(String(formData.get("campaignId")));
  revalidatePath("/");
}

export async function generateCampaignReportAction(formData: FormData) {
  await generateCampaignReport(String(formData.get("campaignId")));
  revalidatePath("/");
}

export async function exportReportAction(formData: FormData) {
  await exportReport(String(formData.get("reportId")), String(formData.get("format")) as ReportExportFormat);
  revalidatePath("/");
}

export async function createBusinessInsightAction(formData: FormData) {
  await createCampaignBusinessInsight(String(formData.get("campaignId")));
  revalidatePath("/");
}
