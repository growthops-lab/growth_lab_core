import {
  RewriteRiskCheckStatus,
  RewriteRiskLevel,
  type Prisma,
  type PrismaClient
} from "@prisma/client";
import { hasUnsafeHtml } from "@/src/lib/content-diff/sanitize";

const HIGH_RISK_KEYWORDS = [
  "guaranteed",
  "100%",
  "cure",
  "diagnose",
  "legal advice",
  "investment advice",
  "must buy"
];

export function detectRewriteRisks(input: { title: string; contentHtml: string; suggestions: Array<{ afterText: string }> }) {
  const text = [input.title, input.contentHtml, ...input.suggestions.map((item) => item.afterText)].join("\n").toLowerCase();
  const findings: Array<{ level: RewriteRiskLevel; message: string }> = [];
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (text.includes(keyword)) findings.push({ level: RewriteRiskLevel.HIGH, message: `High-risk expression detected: ${keyword}` });
  }
  if (hasUnsafeHtml(input.contentHtml)) {
    findings.push({ level: RewriteRiskLevel.CRITICAL, message: "Unsafe HTML detected and must be removed before WordPress update." });
  }
  if (text.includes("px.a8.net") || text.includes("a8.net")) {
    findings.push({ level: RewriteRiskLevel.MEDIUM, message: "Affiliate URL detected. Confirm placement is inside WordPress and not used for X direct posting." });
  }
  const criticalCount = findings.filter((item) => item.level === RewriteRiskLevel.CRITICAL).length;
  const highCount = findings.filter((item) => item.level === RewriteRiskLevel.HIGH).length;
  const maxRiskLevel = criticalCount > 0 ? RewriteRiskLevel.CRITICAL : highCount > 0 ? RewriteRiskLevel.HIGH : findings.length > 0 ? RewriteRiskLevel.MEDIUM : RewriteRiskLevel.LOW;
  const status = criticalCount > 0 ? RewriteRiskCheckStatus.BLOCKED : findings.length > 0 ? RewriteRiskCheckStatus.WARNING : RewriteRiskCheckStatus.PASSED;
  return { status, maxRiskLevel, criticalCount, highCount, warningCount: findings.length, findings };
}

export async function runRewriteRiskCheck(
  prisma: PrismaClient,
  input: { rewriteDraftId: string; title: string; contentHtml: string; suggestions: Array<{ afterText: string }> }
) {
  const result = detectRewriteRisks(input);
  return prisma.rewriteRiskCheck.create({
    data: {
      rewriteDraftId: input.rewriteDraftId,
      status: result.status,
      maxRiskLevel: result.maxRiskLevel,
      criticalCount: result.criticalCount,
      highCount: result.highCount,
      warningCount: result.warningCount,
      findings: result.findings as Prisma.InputJsonValue
    }
  });
}
