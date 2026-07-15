import { randomUUID } from "node:crypto";
import type {
  CanvaApiResult,
  CanvaMockDesign,
  CanvaMockExport,
} from "@/src/lib/canva/types";

export function mockCanvaConnection(email = "mock-canva@growth-lab.local") {
  return {
    canvaUserId: `mock-user-${randomUUID().slice(0, 8)}`,
    canvaUserEmail: email,
    scopes: process.env.CANVA_OAUTH_SCOPES ?? "",
  };
}

export function mockAutofillDesign(
  templateId: string,
): CanvaApiResult<CanvaMockDesign> {
  const id = `mock-design-${randomUUID().slice(0, 8)}`;
  return {
    ok: true,
    endpoint: `/v1/brand-templates/${templateId}/autofill`,
    method: "POST",
    mockMode: true,
    statusCode: 200,
    data: {
      designId: id,
      designUrl: `https://www.canva.com/design/${id}/view`,
    },
  };
}

export function mockExportDesign(
  designId: string,
): CanvaApiResult<CanvaMockExport> {
  const id = `mock-export-${randomUUID().slice(0, 8)}`;
  return {
    ok: true,
    endpoint: `/v1/exports`,
    method: "POST",
    mockMode: true,
    statusCode: 200,
    data: {
      exportJobId: id,
      downloadUrl: `mock://canva/${designId}/${id}`,
    },
  };
}
