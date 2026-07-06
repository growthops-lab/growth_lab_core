import { publishDuePosts } from "@/lib/x-publisher";
import { prisma } from "@/lib/prisma";

async function main() {
  const results = await publishDuePosts();
  console.log(JSON.stringify({ processed: results.length, results }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
