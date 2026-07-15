import { describe, expect, it } from "vitest";

import { calculateRevenueMetrics } from "./metrics";

describe("calculateRevenueMetrics", () => {
  it("calculates the complete revenue funnel", () => {
    expect(
      calculateRevenueMetrics({
        impressions: 1_000,
        linkClicks: 50,
        affiliateClicks: 25,
        conversions: 5,
        approvedConversions: 4,
        totalConversions: 5,
        approvedRevenue: 500,
        operatingCost: 100,
      }),
    ).toEqual({
      ctr: 0.05,
      cvr: 0.1,
      approvalRate: 0.8,
      epc: 20,
      rpm: 500,
      profit: 400,
      roi: 4,
    });
  });

  it("uses observable funnel defaults when optional totals are omitted", () => {
    expect(
      calculateRevenueMetrics({
        impressions: 100,
        linkClicks: 10,
        conversions: 2,
        approvedRevenue: 50,
        operatingCost: 10,
      }),
    ).toEqual({
      ctr: 0.1,
      cvr: 0.2,
      approvalRate: 1,
      epc: 5,
      rpm: 500,
      profit: 40,
      roi: 4,
    });
  });

  it("returns null rates instead of dividing by zero", () => {
    expect(
      calculateRevenueMetrics({
        impressions: 0,
        linkClicks: 0,
        affiliateClicks: 0,
        conversions: 0,
        approvedConversions: 0,
        totalConversions: 0,
        approvedRevenue: 100,
        operatingCost: 0,
      }),
    ).toEqual({
      ctr: null,
      cvr: null,
      approvalRate: null,
      epc: null,
      rpm: null,
      profit: 100,
      roi: null,
    });
  });

  it("preserves explicit zero values and reports a negative return", () => {
    expect(
      calculateRevenueMetrics({
        impressions: 100,
        linkClicks: 10,
        affiliateClicks: 0,
        conversions: 2,
        approvedConversions: 0,
        totalConversions: 4,
        approvedRevenue: 80,
        operatingCost: 100,
      }),
    ).toEqual({
      ctr: 0.1,
      cvr: 0.2,
      approvalRate: 0,
      epc: null,
      rpm: 800,
      profit: -20,
      roi: -0.2,
    });
  });
});
