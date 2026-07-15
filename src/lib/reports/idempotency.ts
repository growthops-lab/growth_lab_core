import crypto from "node:crypto";
import type { ReportType } from "@prisma/client";

export function createReportGenerationKey(input: {
  reportType: ReportType;
  campaignId?: string | null;
  mediaId?: string | null;
  periodStart: Date;
  periodEnd: Date;
  templateId?: string | null;
}) {
  return crypto
    .createHash("sha256")
    .update(
      [
        input.reportType,
        input.campaignId ?? "",
        input.mediaId ?? "",
        input.periodStart.toISOString().slice(0, 10),
        input.periodEnd.toISOString().slice(0, 10),
        input.templateId ?? "",
      ].join("|"),
    )
    .digest("hex");
}
