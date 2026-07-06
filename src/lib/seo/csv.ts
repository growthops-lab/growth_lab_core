export function splitCsvLine(line: string) {
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

export function parseCsvRows<T extends Record<string, string>>(text: string) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] as T[] };
  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase().replace(/\s+/g, "_"));
  const rows = lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])) as T;
  });
  return { headers, rows };
}

export function toNumber(value: string | number | null | undefined, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const normalized = String(value ?? "")
    .trim()
    .replace(/,/g, "");
  if (!normalized) return fallback;
  const isPercent = normalized.endsWith("%");
  const number = Number(isPercent ? normalized.slice(0, -1) : normalized);
  if (isPercent && Number.isFinite(number)) return number / 100;
  return Number.isFinite(number) ? number : fallback;
}

export function toDate(value: string) {
  const normalized = String(value ?? "").trim();
  const ymd = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymd) {
    const date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    date.setHours(0, 0, 0, 0);
    return date;
  }
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}
