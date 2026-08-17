import { NextResponse } from "next/server";

import { getDefaultInMemoryApprovalGateApi } from "@/src/lib/approval-gate/http/in-memory-approval-gate-api";

type RouteContext = {
  params: Promise<{ approvalGateId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { approvalGateId } = await params;
  const result = await getDefaultInMemoryApprovalGateApi().get(approvalGateId);
  return NextResponse.json(result.body, { status: result.status });
}
