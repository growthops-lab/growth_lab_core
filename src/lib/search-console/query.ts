export function searchConsoleEndpoint(siteUrl: string) {
  return `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}

export function createSearchConsoleRequest(
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit: number,
  startRow: number
) {
  return {
    startDate,
    endDate,
    dimensions,
    rowLimit,
    startRow,
    dataState: "final"
  };
}

