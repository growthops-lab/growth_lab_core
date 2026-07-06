import { prisma } from "@/lib/prisma";
import { runSocialPostSafetyGate } from "@/src/lib/social-api/safety-gate";
import { acquireSocialPostLock, releaseSocialPostLock } from "@/src/lib/social-posting/locks";
import { executeSocialPostQueue } from "@/src/lib/social-posting/execute";
import { approveSocialQueuedPost, enqueueManualSocialPost } from "@/src/lib/social-posting/queue";

async function main() {
  const account = await prisma.socialAccount.findFirstOrThrow({
    where: { platform: "X" },
    include: { media: true }
  });

  const safe = await enqueueManualSocialPost({
    mediaId: account.mediaId,
    socialAccountId: account.id,
    postText: "Phase9 self duplicate regression smoke",
    linkUrl: account.media.wordpressUrl
  });
  await approveSocialQueuedPost(safe.id, "smoke");
  const safety = await runSocialPostSafetyGate(safe.id);

  const shortUrl = await enqueueManualSocialPost({
    mediaId: account.mediaId,
    socialAccountId: account.id,
    postText: "Phase9 short URL smoke https://bit.ly/example",
    linkUrl: "https://bit.ly/example"
  });
  await approveSocialQueuedPost(shortUrl.id, "smoke");
  const shortResult = await executeSocialPostQueue(shortUrl.id, "smoke-warning");

  const lock1 = await acquireSocialPostLock(safe.id, "smoke-lock-1");
  await releaseSocialPostLock(safe.id);
  const lock2 = await acquireSocialPostLock(safe.id, "smoke-lock-2");
  await releaseSocialPostLock(safe.id);

  console.log(
    JSON.stringify({
      safeStatus: safety.status,
      safeReasons: safety.reasons,
      shortResult,
      lock1,
      lock2
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
