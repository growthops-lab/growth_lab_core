export function normalizeGA4PropertyId(value: string) {
  return value.replace(/^properties\//, "").trim();
}

export function ga4RunReportEndpoint(propertyId: string) {
  return `https://analyticsdata.googleapis.com/v1beta/properties/${normalizeGA4PropertyId(propertyId)}:runReport`;
}

export function createGA4SiteDailyRequest(startDate: string, endDate: string, limit: number, offset: number) {
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
      { name: "bounceRate" },
      { name: "conversions" },
      { name: "totalRevenue" }
    ],
    limit,
    offset,
    returnPropertyQuota: process.env.GA4_RETURN_PROPERTY_QUOTA !== "false"
  };
}

export function createGA4PageDailyRequest(startDate: string, endDate: string, limit: number, offset: number) {
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "date" }, { name: "pagePath" }, { name: "pageTitle" }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageEngagementTime" },
      { name: "conversions" }
    ],
    limit,
    offset,
    returnPropertyQuota: process.env.GA4_RETURN_PROPERTY_QUOTA !== "false"
  };
}

