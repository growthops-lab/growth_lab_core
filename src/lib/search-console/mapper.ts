import { SearchDevice, SearchType } from "@prisma/client";
import type { SearchConsoleApiRow } from "@/src/lib/search-console/types";

export function normalizedSearchType(value: string | undefined) {
  const raw = String(value || "web").trim();
  const normalized = raw === "googleNews" ? "GOOGLE_NEWS" : raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (normalized === "GOOGLENEWS") return SearchType.GOOGLE_NEWS;
  return Object.values(SearchType).includes(normalized as SearchType) ? (normalized as SearchType) : SearchType.WEB;
}

export function normalizedSearchDevice(value: string | undefined) {
  const normalized = String(value || "UNKNOWN").trim().toUpperCase().replace(/[\s-]+/g, "_");
  return Object.values(SearchDevice).includes(normalized as SearchDevice) ? (normalized as SearchDevice) : SearchDevice.UNKNOWN;
}

export function gscMetrics(row: SearchConsoleApiRow) {
  return {
    clicks: Math.round(row.clicks ?? 0),
    impressions: Math.round(row.impressions ?? 0),
    ctr: row.ctr ?? 0,
    position: row.position ?? 0
  };
}

