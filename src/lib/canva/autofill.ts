import { CanvaClient, logCanvaResult } from "@/src/lib/canva/client";
import { RequestType } from "@prisma/client";

export async function createMockCanvaAutofill(input: {
  templateId: string;
  connectionId?: string | null;
  designJobId?: string | null;
  payloadSummary?: string;
}) {
  const client = new CanvaClient(true);
  const result = await client.createAutofillDesign(input.templateId);
  await logCanvaResult({
    connectionId: input.connectionId,
    designJobId: input.designJobId,
    action: "mock_autofill",
    result,
    requestType: RequestType.CANVA_MOCK_AUTOFILL,
    requestSummary: input.payloadSummary,
    responseSummary: result.data ? JSON.stringify(result.data) : undefined
  });
  return result;
}
