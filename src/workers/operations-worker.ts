import { prisma } from "@/lib/prisma";
import { OPERATION_DEFAULT_SETTINGS } from "@/src/lib/operations/config";
import { runDueScheduledTasks } from "@/src/lib/operations/runner";

const intervalSeconds = Math.max(10, Number(OPERATION_DEFAULT_SETTINGS.SYNC_WORKER_INTERVAL_SECONDS));

async function tick() {
  try {
    const count = await runDueScheduledTasks(prisma);
    const mode =
      OPERATION_DEFAULT_SETTINGS.OPERATIONS_AUTOMATION_ENABLED === "true"
        ? "automation"
        : "automation-disabled";
    console.log(`[operations-worker] ${new Date().toISOString()} ${mode} processed=${count}`);
  } catch (error) {
    console.error("[operations-worker] tick failed", error);
  }
}

if (OPERATION_DEFAULT_SETTINGS.SYNC_WORKER_ENABLED !== "true") {
  console.log("[operations-worker] disabled by SYNC_WORKER_ENABLED=false");
  process.exit(0);
}

void tick();
setInterval(() => void tick(), intervalSeconds * 1000);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
