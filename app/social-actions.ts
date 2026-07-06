"use server";

import { revalidatePath } from "next/cache";
import { SocialPostSourceType } from "@prisma/client";
import { connectXMock } from "@/src/lib/social-api/connections";
import { runSocialPostSafetyGate } from "@/src/lib/social-api/safety-gate";
import { calculateMockSocialAttribution } from "@/src/lib/social-analytics/attribution";
import { calculateSocialGrowthScore } from "@/src/lib/social-analytics/growth-score";
import { createMockSocialPerformanceSnapshot } from "@/src/lib/social-analytics/performance";
import { createSocialImprovementSuggestion } from "@/src/lib/social-analytics/recommendations";
import { executeSocialPostQueue } from "@/src/lib/social-posting/execute";
import { approveSocialQueuedPost, enqueueManualSocialPost } from "@/src/lib/social-posting/queue";

function dateFromInput(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function connectXMockAction(formData: FormData) {
  await connectXMock(String(formData.get("socialAccountId")));
  revalidatePath("/");
}

export async function enqueueSocialPostAction(formData: FormData) {
  await enqueueManualSocialPost({
    mediaId: String(formData.get("mediaId")),
    socialAccountId: String(formData.get("socialAccountId")),
    postText: String(formData.get("postText")),
    linkUrl: String(formData.get("linkUrl") || ""),
    scheduledAt: dateFromInput(formData.get("scheduledAt")),
    sourceType: SocialPostSourceType.MANUAL
  });
  revalidatePath("/");
}

export async function approveSocialQueueAction(formData: FormData) {
  await approveSocialQueuedPost(String(formData.get("queueId")));
  revalidatePath("/");
}

export async function runSocialSafetyCheckAction(formData: FormData) {
  await runSocialPostSafetyGate(String(formData.get("queueId")));
  revalidatePath("/");
}

export async function executeSocialQueueAction(formData: FormData) {
  await executeSocialPostQueue(String(formData.get("queueId")), "server-action");
  revalidatePath("/");
}

export async function createSocialPerformanceAction(formData: FormData) {
  const queueId = String(formData.get("queueId"));
  const snapshot = await createMockSocialPerformanceSnapshot(queueId);
  await calculateMockSocialAttribution(queueId);
  await createSocialImprovementSuggestion(queueId);
  await calculateSocialGrowthScore(snapshot.mediaId);
  revalidatePath("/");
}
