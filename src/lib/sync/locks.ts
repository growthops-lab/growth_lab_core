import { GoogleSyncRunStatus, type PrismaClient } from "@prisma/client";

export async function hasActiveGoogleSyncLock(
  prisma: PrismaClient,
  input: { mediaId: string; googleSyncJobId?: string | null },
) {
  const lockMinutes = Number(process.env.GOOGLE_API_SYNC_LOCK_MINUTES ?? 15);
  const since = new Date(Date.now() - lockMinutes * 60 * 1000);
  const active = await prisma.googleSyncRun.findFirst({
    where: {
      mediaId: input.mediaId,
      googleSyncJobId: input.googleSyncJobId ?? undefined,
      status: GoogleSyncRunStatus.RUNNING,
      startedAt: { gte: since },
    },
  });
  return Boolean(active);
}
