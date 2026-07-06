export type GA4RunReportResponse = {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string; type?: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
  rowCount?: number;
  propertyQuota?: {
    tokensPerDay?: { remaining?: number; consumed?: number };
    tokensPerHour?: { remaining?: number; consumed?: number };
  };
};

export type GA4ReportRow = Record<string, string>;

