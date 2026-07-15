import { createHash } from "node:crypto";
import { htmlToText, sanitizeHtml } from "@/src/lib/content-diff/sanitize";
import { detectBlockStructureWarnings } from "@/src/lib/content-diff/block-warning";

export function contentHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function buildTextDiff(beforeValue: string, afterValue: string) {
  const beforeLines = beforeValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const afterLines = afterValue
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const removed = beforeLines
    .filter((line) => !afterLines.includes(line))
    .slice(0, 20);
  const added = afterLines
    .filter((line) => !beforeLines.includes(line))
    .slice(0, 20);
  return {
    added,
    removed,
    changed: added.length + removed.length,
    summary: `${added.length} added line(s), ${removed.length} removed line(s).`,
  };
}

export function buildContentDiff(beforeHtml: string, afterHtml: string) {
  const safeBefore = sanitizeHtml(beforeHtml);
  const safeAfter = sanitizeHtml(afterHtml);
  const beforeText = htmlToText(safeBefore);
  const afterText = htmlToText(safeAfter);
  const diff = buildTextDiff(beforeText, afterText);
  return {
    beforeHtml: safeBefore,
    afterHtml: safeAfter,
    beforeText,
    afterText,
    beforeHash: contentHash(safeBefore),
    afterHash: contentHash(safeAfter),
    blockWarnings: detectBlockStructureWarnings(beforeHtml, safeAfter),
    diff,
  };
}
