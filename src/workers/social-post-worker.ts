import { SocialPostQueueStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { executeSocialPostQueue } from "@/src/lib/social-posting/execute";

const intervalSeconds = Math.max(
  10,
  Number(process.env.SNS_POST_WORKER_INTERVAL_SECONDS ?? "60"),
);
const maxPerTick = Math.max(
  1,
  Number(process.env.SNS_POST_WORKER_MAX_PER_TICK ?? "3"),
);
const workerEnabled = process.env.SNS_POST_WORKER_ENABLED === "true";

async function tick() {
  const due = await prisma.socialPostQueue.findMany({
    where: {
      queueStatus: {
        in: [SocialPostQueueStatus.READY, SocialPostQueueStatus.SCHEDULED],
      },
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
    take: maxPerTick,
  });

  for (const item of due) {
    const result = await executeSocialPostQueue(item.id, "social-post-worker");
    console.log(
      `[social-post-worker] queue=${item.id} status=${result.status}`,
    );
  }
}

if (!workerEnabled) {
  console.log("[social-post-worker] disabled by SNS_POST_WORKER_ENABLED=false");
  void prisma.$disconnect().then(() => process.exit(0));
} else {
  void tick();
  setInterval(() => void tick(), intervalSeconds * 1000);
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
