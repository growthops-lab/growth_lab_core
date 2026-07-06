import {
  DataFreshnessPriority,
  DataFreshnessSource,
  FreshnessStatus,
  type PrismaClient
} from "@prisma/client";
import { operationNumber } from "@/src/lib/operations/config";

function hoursSince(date: Date | null | undefined) {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (60 * 60 * 1000));
}

function classifyFreshness(lastDataAt: Date | null | undefined, warningHours: number, criticalHours: number) {
  const staleHours = hoursSince(lastDataAt);
  if (staleHours === null) return { status: FreshnessStatus.UNKNOWN, staleHours };
  if (staleHours >= criticalHours) return { status: FreshnessStatus.CRITICAL, staleHours };
  if (staleHours >= warningHours) return { status: FreshnessStatus.WARNING, staleHours };
  return { status: FreshnessStatus.FRESH, staleHours };
}

async function upsertFreshness(
  prisma: PrismaClient,
  mediaId: string,
  source: DataFreshnessSource,
  lastDataAt: Date | null,
  priority = DataFreshnessPriority.MOCK
) {
  const warningAfterHours = operationNumber("DATA_FRESHNESS_WARNING_HOURS");
  const criticalAfterHours = operationNumber("DATA_FRESHNESS_CRITICAL_HOURS");
  const classified = classifyFreshness(lastDataAt, warningAfterHours, criticalAfterHours);
  const label = `${source} data`;
  return prisma.dataFreshnessStatus.upsert({
    where: { mediaId_source: { mediaId, source } },
    update: {
      priority,
      status: classified.status,
      lastDataAt,
      checkedAt: new Date(),
      warningAfterHours,
      criticalAfterHours,
      staleHours: classified.staleHours,
      message:
        classified.status === FreshnessStatus.FRESH
          ? `${label} is fresh.`
          : `${label} needs attention. Last data: ${lastDataAt?.toISOString() ?? "none"}.`
    },
    create: {
      mediaId,
      source,
      priority,
      status: classified.status,
      lastDataAt,
      warningAfterHours,
      criticalAfterHours,
      staleHours: classified.staleHours,
      message:
        classified.status === FreshnessStatus.FRESH
          ? `${label} is fresh.`
          : `${label} needs attention. Last data: ${lastDataAt?.toISOString() ?? "none"}.`
    }
  });
}

export async function checkDataFreshness(prisma: PrismaClient) {
  const mediaItems = await prisma.media.findMany({ select: { id: true } });
  let updated = 0;
  for (const media of mediaItems) {
    const [ga4, gsc, revenue, social, wordpress, growth] = await Promise.all([
      prisma.gA4MetricDaily.findFirst({ where: { mediaId: media.id }, orderBy: { date: "desc" }, select: { date: true } }),
      prisma.searchConsoleQueryDaily.findFirst({ where: { mediaId: media.id }, orderBy: { date: "desc" }, select: { date: true } }),
      prisma.revenueEvent.findFirst({ where: { mediaId: media.id }, orderBy: { eventDate: "desc" }, select: { eventDate: true } }),
      prisma.post.findFirst({ where: { mediaId: media.id, publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, select: { publishedAt: true } }),
      prisma.wordPressPost.findFirst({ where: { mediaId: media.id }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.growthScoreSnapshot.findFirst({ where: { mediaId: media.id }, orderBy: { periodEnd: "desc" }, select: { periodEnd: true } })
    ]);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.GA4, ga4?.date ?? null);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.SEARCH_CONSOLE, gsc?.date ?? null);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.REVENUE, revenue?.eventDate ?? null);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.SOCIAL_POSTS, social?.publishedAt ?? null);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.WORDPRESS, wordpress?.updatedAt ?? null);
    await upsertFreshness(prisma, media.id, DataFreshnessSource.GROWTH_SCORE, growth?.periodEnd ?? null);
    updated += 6;
  }
  return updated;
}
