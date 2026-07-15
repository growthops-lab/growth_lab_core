import { GrowthRecommendationType } from "@prisma/client";

export function recommendationForScore(totalScore: number, warnings: string[]) {
  if (warnings.length > 0 && totalScore >= 65)
    return GrowthRecommendationType.MAINTAIN;
  if (totalScore >= 80) return GrowthRecommendationType.SCALE;
  if (totalScore >= 65) return GrowthRecommendationType.MAINTAIN;
  if (totalScore >= 50) return GrowthRecommendationType.IMPROVE;
  if (totalScore >= 35) return GrowthRecommendationType.PAUSE;
  return GrowthRecommendationType.RESEARCH_MORE;
}

export function recommendationTitle(type: GrowthRecommendationType) {
  const titles: Record<GrowthRecommendationType, string> = {
    SCALE: "Scale carefully",
    MAINTAIN: "Maintain and monitor",
    IMPROVE: "Improve before scaling",
    PAUSE: "Pause and review",
    STOP: "Stop candidate",
    RESEARCH_MORE: "Research more data",
  };
  return titles[type];
}
