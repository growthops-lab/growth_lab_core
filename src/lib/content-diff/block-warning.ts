export function detectBlockStructureWarnings(beforeHtml: string, afterHtml: string) {
  const warnings: string[] = [];
  const beforeBlocks = beforeHtml.match(/<!--\s*wp:[\s\S]*?-->/g) ?? [];
  const afterBlocks = afterHtml.match(/<!--\s*wp:[\s\S]*?-->/g) ?? [];
  if (beforeBlocks.length !== afterBlocks.length) {
    warnings.push("WordPress block comment count changed. Review block structure before updating a draft.");
  }
  if (beforeHtml.includes("<!-- wp:") && !afterHtml.includes("<!-- wp:")) {
    warnings.push("Original content contains WordPress block comments, but rewritten content does not.");
  }
  return warnings;
}
