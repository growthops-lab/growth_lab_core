import { RequestType } from "@prisma/client";
import { CanvaClient, logCanvaResult } from "@/src/lib/canva/client";

export async function createMockCanvaExport(input: {
  designId: string;
  connectionId?: string | null;
  designJobId?: string | null;
}) {
  const client = new CanvaClient(true);
  const result = await client.exportDesign(input.designId);
  await logCanvaResult({
    connectionId: input.connectionId,
    designJobId: input.designJobId,
    action: "mock_export",
    result,
    requestType: RequestType.CANVA_MOCK_EXPORT,
    responseSummary: result.data ? JSON.stringify(result.data) : undefined
  });
  return result;
}
