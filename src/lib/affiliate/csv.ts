import { RevenueStatus } from "@prisma/client";

export type ParsedRevenueRow = {
  event_date: string;
  network_slug: string;
  program_name: string;
  media_name: string;
  status: string;
  reward: string;
  currency?: string;
  order_id?: string;
  click_id?: string;
  memo?: string;
};

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseRevenueCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] as ParsedRevenueRow[] };
  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(
      headers.map((header, index) => [header, cells[index] ?? ""]),
    ) as ParsedRevenueRow;
  });
  return { headers, rows };
}

export function normalizeRevenueStatus(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "approved") return RevenueStatus.APPROVED;
  if (normalized === "rejected") return RevenueStatus.REJECTED;
  if (normalized === "cancelled" || normalized === "canceled")
    return RevenueStatus.CANCELLED;
  if (normalized === "adjusted") return RevenueStatus.ADJUSTED;
  return RevenueStatus.PENDING;
}

export function rewardColumns(status: RevenueStatus, reward: number) {
  return {
    estimatedReward: reward,
    pendingReward: status === RevenueStatus.PENDING ? reward : 0,
    approvedReward: status === RevenueStatus.APPROVED ? reward : 0,
    rejectedReward: status === RevenueStatus.REJECTED ? reward : 0,
    adjustedReward: status === RevenueStatus.ADJUSTED ? reward : 0,
  };
}
