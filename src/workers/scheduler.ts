import cron from "node-cron";
import { publishDuePosts } from "@/lib/x-publisher";
import { prisma } from "@/lib/prisma";

let running = false;

async function tick() {
  if (running) return;
  running = true;
  try {
    const results = await publishDuePosts();
    if (results.length > 0) {
      console.log(JSON.stringify({ at: new Date().toISOString(), processed: results.length, results }));
    }
  } catch (error) {
    console.error(error);
  } finally {
    running = false;
  }
}

console.log("Growth Lab scheduler started. Checking due posts every minute.");
cron.schedule("* * * * *", tick);
void tick();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
