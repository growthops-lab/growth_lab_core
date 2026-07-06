import { ApiEventType, Platform, RequestType, SocialApiConnectionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function connectXMock(socialAccountId: string) {
  const account = await prisma.socialAccount.findUniqueOrThrow({ where: { id: socialAccountId } });
  const existing = await prisma.socialApiConnection.findFirst({
    where: {
      socialAccountId: account.id,
      platform: Platform.X,
      mockMode: true
    }
  });
  const data = {
    mediaId: account.mediaId,
    socialAccountId: account.id,
    platform: Platform.X,
    connectionName: `${account.handle} mock X API`,
    accountHandle: account.handle,
    accountDisplayName: account.displayName,
    connectionStatus: SocialApiConnectionStatus.MOCK_CONNECTED,
    mockMode: true,
    lastConnectedAt: new Date(),
    lastError: null
  };
  const connection = existing
    ? await prisma.socialApiConnection.update({
        where: { id: existing.id },
        data
      })
    : await prisma.socialApiConnection.create({
        data: {
          ...data,
          mediaId: account.mediaId,
          socialAccountId: account.id,
          platform: Platform.X,
          connectionName: `${account.handle} mock X API`,
          accountHandle: account.handle,
          accountDisplayName: account.displayName,
          connectionStatus: SocialApiConnectionStatus.MOCK_CONNECTED,
          mockMode: true,
          lastConnectedAt: new Date()
        }
      });

  await prisma.apiUsageLog.create({
    data: {
      socialAccountId: account.id,
      platform: Platform.SOCIAL_API,
      eventType: ApiEventType.DRY_RUN,
      endpoint: "/x/oauth/mock",
      method: "POST",
      requestType: RequestType.X_CONNECTION_TEST,
      mockMode: true,
      message: "Mock X API connection created without storing secrets."
    }
  });

  return connection;
}
