import type { GA4ReportRow, GA4RunReportResponse } from "@/src/lib/ga4/types";

export function ga4RowsToObjects(response: GA4RunReportResponse) {
  const dimensions =
    response.dimensionHeaders?.map((header) => header.name) ?? [];
  const metrics = response.metricHeaders?.map((header) => header.name) ?? [];
  return (response.rows ?? []).map((row) => {
    const output: GA4ReportRow = {};
    dimensions.forEach((name, index) => {
      output[name] = row.dimensionValues?.[index]?.value ?? "";
    });
    metrics.forEach((name, index) => {
      output[name] = row.metricValues?.[index]?.value ?? "0";
    });
    return output;
  });
}

export function ga4Date(value: string) {
  const normalized =
    value.length === 8
      ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
      : value;
  const date = new Date(normalized);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function ga4Number(value: string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
