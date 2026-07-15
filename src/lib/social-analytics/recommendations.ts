import {
  SocialImprovementSuggestionStatus,
  SocialImprovementSuggestionType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function createSocialImprovementSuggestion(queueId: string) {
  const queue = await prisma.socialPostQueue.findUniqueOrThrow({
    where: { id: queueId },
  });
  return prisma.socialImprovementSuggestion.create({
    data: {
      mediaId: queue.mediaId,
      socialAccountId: queue.socialAccountId,
      socialPostQueueId: queue.id,
      suggestionType: SocialImprovementSuggestionType.IMPROVE_CTA,
      priority: 40,
      title: "CTA and hook rewrite candidate",
      description:
        "Create a human-reviewed variant with a stronger article benefit and a clearer CTA. Do not auto-post from this suggestion.",
      expectedImpact: "Potential lift in URL clicks after manual review.",
      status: SocialImprovementSuggestionStatus.PROPOSED,
    },
  });
}
