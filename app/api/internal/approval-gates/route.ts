import { NextResponse } from "next/server";

import { getDefaultInMemoryApprovalGateApi } from "@/src/lib/approval-gate/http/in-memory-approval-gate-api";

function toNextResponse(result: {
  status: number;
  body: Record<string, unknown>;
}) {
  return NextResponse.json(result.body, { status: result.status });
}

async function requestBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function GET() {
  return toNextResponse(await getDefaultInMemoryApprovalGateApi().list());
}

export async function POST(request: Request) {
  const body = await requestBody(request);
  return toNextResponse(await getDefaultInMemoryApprovalGateApi().create(body));
}
