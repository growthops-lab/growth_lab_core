import { prisma } from "@/lib/prisma";

export async function acquireSocialPostLock(queueId: string, ownerId: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);
  const lockKey = `social-post:${queueId}`;
  const existing = await prisma.socialPostLock.findUnique({
    where: { lockKey },
  });
  if (!existing) {
    await prisma.socialPostLock.create({
      data: { socialPostQueueId: queueId, lockKey, ownerId, expiresAt },
    });
    return true;
  }

  const reusable =
    existing.releasedAt !== null || existing.expiresAt < new Date();
  if (!reusable) return false;

  await prisma.socialPostLock.update({
    where: { id: existing.id },
    data: {
      ownerId,
      acquiredAt: new Date(),
      heartbeatAt: new Date(),
      expiresAt,
      releasedAt: null,
    },
  });
  return true;
}

export async function releaseSocialPostLock(queueId: string) {
  await prisma.socialPostLock.updateMany({
    where: { lockKey: `social-post:${queueId}`, releasedAt: null },
    data: { releasedAt: new Date() },
  });
}
