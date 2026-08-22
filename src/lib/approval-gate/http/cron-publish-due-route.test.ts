import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { publishDuePostsMock } = vi.hoisted(() => ({
  publishDuePostsMock: vi.fn(),
}));

vi.mock("@/lib/x-publisher", () => ({
  publishDuePosts: publishDuePostsMock,
}));

import { GET } from "../../../../app/api/cron/publish-due/route";

const originalCronSecret = process.env.CRON_SECRET;

function createRequest(authorization?: string) {
  return new NextRequest("http://localhost/api/cron/publish-due", {
    headers: authorization ? { authorization } : undefined,
  });
}

function restoreCronSecret() {
  if (originalCronSecret === undefined) {
    delete process.env.CRON_SECRET;
    return;
  }

  process.env.CRON_SECRET = originalCronSecret;
}

describe("cron publish-due route", () => {
  beforeEach(() => {
    publishDuePostsMock.mockReset();
  });

  afterEach(() => {
    restoreCronSecret();
  });

  it("fails closed when cron authorization is not configured", async () => {
    delete process.env.CRON_SECRET;

    const response = await GET(createRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Service unavailable",
    });
    expect(publishDuePostsMock).not.toHaveBeenCalled();
  });

  it("fails closed when cron authorization is blank", async () => {
    process.env.CRON_SECRET = "   ";

    const response = await GET(createRequest());

    expect(response.status).toBe(503);
    expect(publishDuePostsMock).not.toHaveBeenCalled();
  });

  it("rejects a missing or incorrect authorization header", async () => {
    process.env.CRON_SECRET = "test-only-cron-secret";

    const response = await GET(createRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(publishDuePostsMock).not.toHaveBeenCalled();
  });

  it("publishes only with the configured authorization header", async () => {
    process.env.CRON_SECRET = "test-only-cron-secret";
    const results = [{ postId: "post-1", ok: true }];
    publishDuePostsMock.mockResolvedValue(results);

    const response = await GET(createRequest("Bearer test-only-cron-secret"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      processed: 1,
      results,
    });
    expect(publishDuePostsMock).toHaveBeenCalledTimes(1);
  });
});
