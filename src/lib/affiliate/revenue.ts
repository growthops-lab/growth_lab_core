import { DataConfidence, RevenueStatus, type PrismaClient } from "@prisma/client";
import { calculateRevenueMetrics } from "@/src/lib/analytics/metrics";

export type RevenueSummary = {
  estimatedRevenue: number;
  pendingRevenue: number;
  approvedRevenue: number;
  rejectedRevenue: number;
  adjustedRevenue: number;
  conversions: number;
  pendingConversions: number;
  approvedConversions: number;
  rejectedConversions: number;
  operatingCost: number;
  profit: number;
  epc: number | null;
  rpm: number | null;
  cvr: number | null;
  ctr: number | null;
  roi: number | null;
  dataConfidence: DataConfidence;
};

function toNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export async function summarizeRevenue(prisma: PrismaClient, input: { mediaId?: string; start: Date; end: Date }) {
  const where = {
    eventDate: { gte: input.start, lte: input.end },
    ...(input.mediaId ? { mediaId: input.mediaId } : {})
  };
  const [events, traffic, costs] = await Promise.all([
    prisma.revenueEvent.findMany({ where }),
    prisma.trafficMetricDaily.findMany({
      where: {
        metricDate: { gte: input.start, lte: input.end },
        ...(input.mediaId ? { mediaId: input.mediaId } : {})
      }
    }),
    prisma.operatingCost.findMany({
      where: {
        costDate: { gte: input.start, lte: input.end },
        ...(input.mediaId ? { mediaId: input.mediaId } : {})
      }
    })
  ]);

  const estimatedRevenue = events.reduce((sum, item) => sum + toNumber(item.estimatedReward), 0);
  const pendingRevenue = events.reduce((sum, item) => sum + toNumber(item.pendingReward), 0);
  const approvedRevenue = events.reduce((sum, item) => sum + toNumber(item.approvedReward), 0);
  const rejectedRevenue = events.reduce((sum, item) => sum + toNumber(item.rejectedReward), 0);
  const adjustedRevenue = events.reduce((sum, item) => sum + toNumber(item.adjustedReward), 0);
  const operatingCost = costs.reduce((sum, item) => sum + toNumber(item.amount), 0);
  const impressions = traffic.reduce((sum, item) => sum + item.impressions, 0);
  const linkClicks = traffic.reduce((sum, item) => sum + item.linkClicks, 0);
  const conversions = events.length;
  const approvedConversions = events.filter((event) => event.status === RevenueStatus.APPROVED).length;
  const pendingConversions = events.filter((event) => event.status === RevenueStatus.PENDING).length;
  const rejectedConversions = events.filter((event) => event.status === RevenueStatus.REJECTED).length;
  const metrics = calculateRevenueMetrics({
    impressions,
    linkClicks,
    affiliateClicks: linkClicks,
    conversions,
    approvedConversions,
    totalConversions: conversions,
    approvedRevenue,
    operatingCost
  });

  const activeDays = new Set(traffic.map((item) => item.metricDate.toISOString().slice(0, 10))).size;
  const dataConfidence =
    activeDays >= 30 && events.length > 0
      ? DataConfidence.HIGH
      : activeDays >= 14
        ? DataConfidence.MEDIUM
        : activeDays >= 7
          ? DataConfidence.LOW
          : DataConfidence.INSUFFICIENT;

  return {
    estimatedRevenue,
    pendingRevenue,
    approvedRevenue,
    rejectedRevenue,
    adjustedRevenue,
    conversions,
    pendingConversions,
    approvedConversions,
    rejectedConversions,
    operatingCost,
    profit: metrics.profit,
    epc: metrics.epc,
    rpm: metrics.rpm,
    cvr: metrics.cvr,
    ctr: metrics.ctr,
    roi: metrics.roi,
    dataConfidence
  } satisfies RevenueSummary;
}
