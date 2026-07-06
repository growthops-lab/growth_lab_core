import { ApiEventType, Platform, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CanvaConfigError } from "@/src/lib/canva/errors";
import { canEncryptCanvaSecrets } from "@/src/lib/canva/encryption";
import { mockAutofillDesign, mockExportDesign } from "@/src/lib/canva/mock";
import type { CanvaApiResult, CanvaMockDesign, CanvaMockExport } from "@/src/lib/canva/types";

type LogInput = {
  connectionId?: string | null;
  designJobId?: string | null;
  action: string;
  result: CanvaApiResult<unknown>;
  requestType: RequestType;
  requestSummary?: string;
  responseSummary?: string;
};

export class CanvaClient {
  constructor(private readonly mockMode = process.env.CANVA_MOCK_MODE !== "false") {}

  async createAutofillDesign(templateId: string): Promise<CanvaApiResult<CanvaMockDesign>> {
    if (this.mockMode) return mockAutofillDesign(templateId);
    this.assertRealCanvaAllowed();
    return {
      ok: false,
      endpoint: `/v1/brand-templates/${templateId}/autofill`,
      method: "POST",
      mockMode: false,
      error: "Real Canva Autofill is prepared but not enabled in Phase 3."
    };
  }

  async exportDesign(designId: string): Promise<CanvaApiResult<CanvaMockExport>> {
    if (this.mockMode) return mockExportDesign(designId);
    this.assertRealCanvaAllowed();
    return {
      ok: false,
      endpoint: "/v1/exports",
      method: "POST",
      mockMode: false,
      error: "Real Canva Export is prepared but not enabled in Phase 3."
    };
  }

  private assertRealCanvaAllowed() {
    if (!canEncryptCanvaSecrets()) {
      throw new CanvaConfigError("CANVA_ENCRYPTION_KEY is required before real Canva API use.");
    }
    if (!process.env.CANVA_CLIENT_ID || !process.env.CANVA_CLIENT_SECRET) {
      throw new CanvaConfigError("CANVA_CLIENT_ID and CANVA_CLIENT_SECRET are required before real Canva API use.");
    }
  }
}

export async function logCanvaResult(input: LogInput) {
  const message = input.result.error;
  await prisma.$transaction([
    prisma.canvaSyncLog.create({
      data: {
        canvaConnectionId: input.connectionId ?? null,
        canvaDesignJobId: input.designJobId ?? null,
        action: input.action,
        endpoint: input.result.endpoint,
        method: input.result.method,
        statusCode: input.result.statusCode,
        success: input.result.ok,
        requestPayloadSummary: input.requestSummary,
        responsePayloadSummary: input.responseSummary,
        errorMessage: message,
        mockMode: input.result.mockMode
      }
    }),
    prisma.apiUsageLog.create({
      data: {
        platform: Platform.CANVA,
        eventType: input.result.ok ? ApiEventType.REQUEST : ApiEventType.ERROR,
        requestType: input.requestType,
        endpoint: input.result.endpoint,
        method: input.result.method,
        statusCode: input.result.statusCode,
        success: input.result.ok,
        mockMode: input.result.mockMode,
        message
      }
    })
  ]);
}
