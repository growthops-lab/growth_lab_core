export type RevenueMetricInput = {
  impressions?: number;
  linkClicks?: number;
  affiliateClicks?: number;
  conversions?: number;
  approvedConversions?: number;
  totalConversions?: number;
  approvedRevenue?: number;
  operatingCost?: number;
};

function divide(numerator: number, denominator: number) {
  if (!denominator || denominator <= 0) return null;
  return numerator / denominator;
}

export function calculateRevenueMetrics(input: RevenueMetricInput) {
  const impressions = input.impressions ?? 0;
  const linkClicks = input.linkClicks ?? 0;
  const affiliateClicks = input.affiliateClicks ?? linkClicks;
  const conversions = input.conversions ?? 0;
  const approvedConversions = input.approvedConversions ?? conversions;
  const totalConversions = input.totalConversions ?? conversions;
  const approvedRevenue = input.approvedRevenue ?? 0;
  const operatingCost = input.operatingCost ?? 0;
  const profit = approvedRevenue - operatingCost;

  return {
    ctr: divide(linkClicks, impressions),
    cvr: divide(conversions, linkClicks),
    approvalRate: divide(approvedConversions, totalConversions),
    epc: divide(approvedRevenue, affiliateClicks),
    rpm: impressions > 0 ? (approvedRevenue / impressions) * 1000 : null,
    profit,
    roi: divide(profit, operatingCost),
  };
}
