import { NextResponse } from "next/server";

import { getDefaultInMemoryApprovalGateApi } from "@/src/lib/approval-gate/http/in-memory-approval-gate-api";

type RouteContext = {
  params: Promise<{ approvalGateId: string }>;
};

async function requestBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const [{ approvalGateId }, body] = await Promise.all([
    params,
    requestBody(request),
  ]);
  const result = await getDefaultInMemoryApprovalGateApi().transition(
    approvalGateId,
    body,
  );
  return NextResponse.json(result.body, { status: result.status });
}
