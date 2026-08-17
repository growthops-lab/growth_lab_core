import { execFileSync } from "node:child_process";

const allowedPaths = [
  /^app\/api\/internal\/approval-gates\//,
  /^src\/lib\/approval-gate\//,
  /^scripts\/quality-gates\/verify-b1e-minimal-approval-gate\.mjs$/,
  /^package\.json$/,
  /^Project_Progress\.md$/,
  /^changelog\/CHANGELOG\.md$/,
];

const changedPaths = execFileSync(
  "git",
  ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

const unexpected = changedPaths.filter(
  (path) => !allowedPaths.some((pattern) => pattern.test(path)),
);

if (unexpected.length > 0) {
  console.error("B1E_UNEXPECTED_SCOPE_BLOCKED");
  process.exit(1);
}

console.log("B1E minimal Approval Gate scope check passed.");
