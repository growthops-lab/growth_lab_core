import { ApiEventType, Platform, ReportExportFormat, RequestType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sanitizeReportJson, sanitizeReportText } from "@/src/lib/reports/sanitize";

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function exportReport(reportId: string, format: ReportExportFormat) {
  const report = await prisma.generatedReport.findUniqueOrThrow({ where: { id: reportId }, include: { sections: true } });
  const content =
    format === "MARKDOWN"
      ? sanitizeReportText(report.contentMarkdown)
      : format === "CSV"
        ? sanitizeReportText(`section,title\n${report.sections.map((section) => `${csvCell(section.sectionKey)},${csvCell(section.sectionTitle)}`).join("\n")}`)
        : JSON.stringify(sanitizeReportJson({ title: report.title, summary: report.summary, sections: report.sections.map((section) => section.sectionKey) }));

  const exported = await prisma.reportExport.upsert({
    where: { generatedReportId_exportFormat: { generatedReportId: report.id, exportFormat: format } },
    update: { contentPreview: content.slice(0, 1000), status: "MOCK_EXPORTED" },
    create: {
      generatedReportId: report.id,
      exportFormat: format,
      status: "MOCK_EXPORTED",
      filePath: `/mock-exports/${report.id}.${format.toLowerCase()}`,
      downloadUrl: `/mock-exports/${report.id}.${format.toLowerCase()}`,
      contentPreview: content.slice(0, 1000)
    }
  });

  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.REPORT,
      eventType: ApiEventType.DRY_RUN,
      endpoint: "report.export",
      requestType: RequestType.REPORT_EXPORT,
      mockMode: true,
      message: `Mock exported report ${report.id} as ${format}`
    }
  });

  return exported;
}
