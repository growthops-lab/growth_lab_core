import { DataConfidence } from "@prisma/client";

export function confidenceWarnings(confidence: DataConfidence, activeDays: number) {
  const warnings: string[] = [];
  if (confidence === DataConfidence.INSUFFICIENT) {
    warnings.push("Data period is shorter than the minimum threshold.");
  }
  if (activeDays < Number(process.env.GROWTH_SCORE_MIN_DATA_DAYS ?? 7)) {
    warnings.push(`Only ${activeDays} active data days are available.`);
  }
  return warnings;
}
