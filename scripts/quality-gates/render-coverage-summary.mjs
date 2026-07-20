import fs from "node:fs";
import path from "node:path";
const repoRoot = path.resolve(process.cwd());
const baselinePath = path.join(repoRoot, ".github", "coverage-baseline.json");
const coverageSummaryPath = path.join(
  repoRoot,
  "coverage",
  "coverage-summary.json",
);
const markdownPath = path.join(repoRoot, "coverage", "coverage-ci-summary.md");
const reportPath = path.join(repoRoot, "coverage", "coverage-ci-report.json");
const metricNames = ["statements", "branches", "functions", "lines"];
function compareStrings(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}
function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} was not found.`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
}
function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is not a finite number.`);
  }
}
function assertNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} is not a non-negative integer.`);
  }
}
function normalizeRelative(filePath) {
  const absolute = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : path.resolve(repoRoot, filePath);
  const relative = path.relative(repoRoot, absolute);
  if (
    relative === "" ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Coverage entry is outside the repository.");
  }
  return relative.split(path.sep).join("/");
}
function isEligibleProductionFile(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  if (!normalized.startsWith("src/")) return false;
  if (!/\.(ts|tsx)$/.test(normalized)) return false;
  if (/\.d\.ts$/.test(normalized)) return false;
  if (/(^|\/)__tests__(\/|$)/.test(normalized)) return false;
  if (/\.(test|spec)\.(ts|tsx)$/.test(normalized)) return false;
  return true;
}
function collectEligibleFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectEligibleFiles(absolute));
      continue;
    }
    if (!entry.isFile()) continue;
    const relative = normalizeRelative(absolute);
    if (isEligibleProductionFile(relative)) {
      result.push(relative);
    }
  }
  return result.sort(compareStrings);
}
function metricFromSummary(summary, metricName) {
  const metric = summary?.total?.[metricName];
  if (!metric || typeof metric !== "object") {
    throw new Error(`Missing total.${metricName}.`);
  }
  for (const field of ["covered", "total", "pct"]) {
    assertFiniteNumber(metric[field], `total.${metricName}.${field}`);
  }
  return { covered: metric.covered, total: metric.total, percent: metric.pct };
}
function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}
function formatSigned(value, suffix = "") {
  const normalized = Object.is(value, -0) ? 0 : value;
  const sign = normalized > 0 ? "+" : "";
  return `${sign}${normalized.toFixed(2)}${suffix}`;
}
function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort(compareStrings);
}
const baseline = readJson(baselinePath, "Coverage baseline");
const summary = readJson(coverageSummaryPath, "Coverage summary");
if (baseline.schemaVersion !== 2) {
  throw new Error("Unsupported baseline schemaVersion.");
}
const baselineInventory = baseline?.inventory;
if (!baselineInventory || typeof baselineInventory !== "object") {
  throw new Error("Missing baseline inventory.");
}
for (const field of [
  "eligibleFiles",
  "measuredFiles",
  "coveredExecutableFiles",
  "uncoveredExecutableFiles",
  "zeroExecutableLineFiles",
]) {
  assertNonNegativeInteger(
    baselineInventory[field],
    `baseline.inventory.${field}`,
  );
}
const baselinePartition =
  baselineInventory.coveredExecutableFiles +
  baselineInventory.uncoveredExecutableFiles +
  baselineInventory.zeroExecutableLineFiles;
if (baselinePartition !== baselineInventory.measuredFiles) {
  throw new Error("Baseline inventory partition is inconsistent.");
}
for (const metricName of metricNames) {
  const metric = baseline?.metrics?.[metricName];
  if (!metric || typeof metric !== "object") {
    throw new Error(`Missing baseline metric: ${metricName}.`);
  }
  for (const field of ["covered", "total", "percent"]) {
    assertFiniteNumber(
      metric[field],
      `baseline.metrics.${metricName}.${field}`,
    );
  }
}
const currentMetrics = {};
const comparisonMetrics = {};
let coverageChanged = false;
for (const metricName of metricNames) {
  const current = metricFromSummary(summary, metricName);
  const reference = baseline.metrics[metricName];
  currentMetrics[metricName] = current;
  comparisonMetrics[metricName] = {
    coveredDelta: current.covered - reference.covered,
    totalDelta: current.total - reference.total,
    percentagePointDelta: current.percent - reference.percent,
  };
  if (
    current.covered !== reference.covered ||
    current.total !== reference.total ||
    current.percent !== reference.percent
  ) {
    coverageChanged = true;
  }
}
const fileEntries = Object.entries(summary)
  .filter(([key]) => key !== "total")
  .map(([key, value]) => {
    if (!value?.lines || typeof value.lines !== "object") {
      throw new Error("A file entry is missing lines data.");
    }
    assertNonNegativeInteger(value.lines.covered, "file.lines.covered");
    assertNonNegativeInteger(value.lines.total, "file.lines.total");
    if (value.lines.covered > value.lines.total) {
      throw new Error(
        "A file entry has covered lines greater than total lines.",
      );
    }
    return {
      file: normalizeRelative(key),
      linesCovered: value.lines.covered,
      linesTotal: value.lines.total,
    };
  })
  .sort((left, right) => compareStrings(left.file, right.file));
const srcRoot = path.join(repoRoot, "src");
if (!fs.existsSync(srcRoot)) {
  throw new Error("src directory was not found.");
}
const eligibleFiles = collectEligibleFiles(srcRoot);
const measuredFiles = fileEntries.map((entry) => entry.file);
const eligibleSet = new Set(eligibleFiles);
const measuredSet = new Set(measuredFiles);
const missingMeasuredFiles = setDifference(eligibleSet, measuredSet);
const unexpectedMeasuredFiles = setDifference(measuredSet, eligibleSet);
const coveredExecutableFiles = fileEntries.filter(
  (entry) => entry.linesTotal > 0 && entry.linesCovered > 0,
).length;
const uncoveredExecutableFiles = fileEntries.filter(
  (entry) => entry.linesTotal > 0 && entry.linesCovered === 0,
).length;
const zeroExecutableLineFiles = fileEntries.filter(
  (entry) => entry.linesTotal === 0,
).length;
const classifiedFiles =
  coveredExecutableFiles + uncoveredExecutableFiles + zeroExecutableLineFiles;
if (classifiedFiles !== fileEntries.length) {
  throw new Error("Current inventory partition is inconsistent.");
}
const currentInventory = {
  eligibleFiles: eligibleFiles.length,
  measuredFiles: measuredFiles.length,
  coveredExecutableFiles,
  uncoveredExecutableFiles,
  zeroExecutableLineFiles,
  missingMeasuredFiles,
  unexpectedMeasuredFiles,
};
const comparisonInventory = {
  eligibleFilesDelta:
    currentInventory.eligibleFiles - baselineInventory.eligibleFiles,
  measuredFilesDelta:
    currentInventory.measuredFiles - baselineInventory.measuredFiles,
  coveredExecutableFilesDelta:
    currentInventory.coveredExecutableFiles -
    baselineInventory.coveredExecutableFiles,
  uncoveredExecutableFilesDelta:
    currentInventory.uncoveredExecutableFiles -
    baselineInventory.uncoveredExecutableFiles,
  zeroExecutableLineFilesDelta:
    currentInventory.zeroExecutableLineFiles -
    baselineInventory.zeroExecutableLineFiles,
};
const inventoryChanged =
  Object.values(comparisonInventory).some((value) => value !== 0) ||
  missingMeasuredFiles.length > 0 ||
  unexpectedMeasuredFiles.length > 0;
let status = "BASELINE_MATCH";
if (coverageChanged && inventoryChanged) {
  status = "COVERAGE_AND_INVENTORY_CHANGED";
} else if (coverageChanged) {
  status = "COVERAGE_CHANGED";
} else if (inventoryChanged) {
  status = "INVENTORY_CHANGED";
}
const warnings = [];
if (coverageChanged) {
  warnings.push("Coverage values differ from the approved baseline.");
}
if (inventoryChanged) {
  warnings.push("Coverage inventory differs from the approved baseline.");
}
const report = {
  schemaVersion: 2,
  status,
  thresholdEnforced: false,
  baseline: {
    sourceCommit: baseline.sourceCommit,
    metrics: baseline.metrics,
    inventory: baselineInventory,
  },
  current: { metrics: currentMetrics, inventory: currentInventory },
  comparison: { metrics: comparisonMetrics, inventory: comparisonInventory },
  warnings,
};
const metricRows = metricNames.map((metricName) => {
  const current = currentMetrics[metricName];
  const reference = baseline.metrics[metricName];
  const delta = comparisonMetrics[metricName].percentagePointDelta;
  const label = metricName[0].toUpperCase() + metricName.slice(1);
  return (
    `| ${label} | ` +
    `${current.covered} / ${current.total} ` +
    `(${formatPercent(current.percent)}) | ` +
    `${reference.covered} / ${reference.total} ` +
    `(${formatPercent(reference.percent)}) | ` +
    `${formatSigned(delta, " pp")} |`
  );
});
const inventoryRows = [
  [
    "Eligible files",
    currentInventory.eligibleFiles,
    baselineInventory.eligibleFiles,
    comparisonInventory.eligibleFilesDelta,
  ],
  [
    "Measured files",
    currentInventory.measuredFiles,
    baselineInventory.measuredFiles,
    comparisonInventory.measuredFilesDelta,
  ],
  [
    "Covered executable files",
    currentInventory.coveredExecutableFiles,
    baselineInventory.coveredExecutableFiles,
    comparisonInventory.coveredExecutableFilesDelta,
  ],
  [
    "Uncovered executable files",
    currentInventory.uncoveredExecutableFiles,
    baselineInventory.uncoveredExecutableFiles,
    comparisonInventory.uncoveredExecutableFilesDelta,
  ],
  [
    "Zero executable-line files",
    currentInventory.zeroExecutableLineFiles,
    baselineInventory.zeroExecutableLineFiles,
    comparisonInventory.zeroExecutableLineFilesDelta,
  ],
].map(([label, current, reference, delta]) => {
  const sign = delta > 0 ? "+" : "";
  return `| ${label} | ${current} | ${reference} | ` + `${sign}${delta} |`;
});
const warningSection =
  warnings.length === 0
    ? "- None"
    : warnings.map((warning) => `- ${warning}`).join("\n");
const markdown = [
  "# Test Coverage Report",
  "",
  "## Result",
  "",
  `- Status: ${status}`,
  "- Coverage command: PASS",
  "- Numeric thresholds: Not configured",
  "- Threshold enforcement: Disabled",
  "- Required status check: No",
  `- Baseline source: ${baseline.sourceCommit}`,
  "",
  "## Coverage",
  "",
  "| Metric | Current | Baseline | Delta |",
  "| --- | ---: | ---: | ---: |",
  ...metricRows,
  "",
  "## Inventory",
  "",
  "| Item | Current | Baseline | Difference |",
  "| --- | ---: | ---: | ---: |",
  ...inventoryRows,
  "",
  "## Inventory Reconciliation",
  "",
  `- Missing measured files: ${missingMeasuredFiles.length}`,
  `- Unexpected measured files: ${unexpectedMeasuredFiles.length}`,
  `- Partition check: ${classifiedFiles} / ${measuredFiles.length}`,
  "",
  "## Warnings",
  "",
  warningSection,
  "",
  "## Policy",
  "",
  "Coverage and inventory differences are reported but do not " +
    "fail this workflow.",
  "Numeric thresholds are intentionally not configured.",
  "",
].join("\n");
fs.writeFileSync(markdownPath, markdown, "utf8");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, "utf8");
}
process.stdout.write(`Coverage reporting status: ${status}\n`);
