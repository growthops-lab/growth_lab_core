import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workflowPath = path.join(
  root,
  ".github",
  "workflows",
  "nonprod-deploy.yml",
);
const text = fs.readFileSync(workflowPath, "utf8");
const workflow = YAML.parse(text);

function fail(message) {
  throw new Error(`nonprod deployment policy: ${message}`);
}

const dispatch = workflow.on?.workflow_dispatch;

if (!dispatch || Object.keys(workflow.on).length !== 1) {
  fail("workflow_dispatch must be the only trigger");
}

const confirmation = dispatch.inputs?.confirmation;

if (
  !confirmation ||
  confirmation.required !== true ||
  confirmation.default !== "CANCEL" ||
  confirmation.options?.join(",") !== "CANCEL,DEPLOY_NONPRODUCTION"
) {
  fail("confirmation contract mismatch");
}

if (
  workflow.permissions?.contents !== "read" ||
  workflow.permissions?.["id-token"] !== "write" ||
  Object.keys(workflow.permissions ?? {}).length !== 2
) {
  fail("least-privilege permissions mismatch");
}

const requirements = [
  [/uses:\s+actions\/checkout@[0-9a-f]{40}\s+# v7\b/, "pinned checkout v7"],
  [
    /uses:\s+google-github-actions\/auth@[0-9a-f]{40}\s+# v3\b/,
    "pinned Google auth v3",
  ],
  [
    /uses:\s+google-github-actions\/setup-gcloud@[0-9a-f]{40}\s+# v3\b/,
    "pinned setup-gcloud v3",
  ],
  ["PROJECT_ID: growth-lab-core-nonproduction", "nonproduction project"],
  ["REGION: asia-northeast1", "approved region"],
  ["SERVICE_NAME: growth-lab-core-nonproduction", "approved Cloud Run service"],
  ["workload_identity_provider:", "Workload Identity Federation"],
  ["service_account:", "deployer service account"],
  ["--ingress=internal-and-cloud-load-balancing", "approved Cloud Run ingress"],
  ["--allow-unauthenticated", "approved load-balancer invoker prerequisite"],
];

for (const [requirement, label] of requirements) {
  const found =
    typeof requirement === "string"
      ? text.includes(requirement)
      : requirement.test(text);

  if (!found) {
    fail(`missing ${label}`);
  }
}

if (
  /uses:\s+(?:actions\/checkout|google-github-actions\/auth|google-github-actions\/setup-gcloud)@v\d+\b/.test(
    text,
  )
) {
  fail("mutable Action tag detected");
}

if (
  /credentials[_-]?json\s*:/i.test(text) ||
  /GOOGLE_(?:APPLICATION_)?CREDENTIALS|GOOGLE_CREDENTIALS/i.test(text)
) {
  fail("static Google credentials detected");
}

console.log("nonprod deployment policy: PASS");
