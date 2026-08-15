import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const validatorPath = path.join(
  repositoryRoot,
  "src/lib/approval-gate/application/oidc-integration-readiness.ts",
);
const testPath = path.join(
  repositoryRoot,
  "src/lib/approval-gate/application/oidc-integration-readiness.test.ts",
);

const forbiddenBoundaryPatterns = [
  /process\s*\.\s*env/u,
  /node:(?:fs|http|https|net|tls|child_process)/u,
  /\b(?:fetch|axios|got|undici)\b/u,
  /\b(?:prisma|openid-client)\b/iu,
];

function fail() {
  process.stdout.write("B1D_QUALITY_GATE_BLOCKED\n");
  process.exitCode = 1;
}

if (!existsSync(validatorPath) || !existsSync(testPath)) {
  fail();
} else {
  const validatorSource = readFileSync(validatorPath, "utf8");
  if (
    forbiddenBoundaryPatterns.some((pattern) => pattern.test(validatorSource))
  ) {
    fail();
  } else {
    process.stdout.write("B1D_QUALITY_GATE_OK\n");
  }
}
