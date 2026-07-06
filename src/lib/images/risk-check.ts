import { AssetApprovalStatus, LinkCheckStatus, type CreativeAsset } from "@prisma/client";

export function evaluateImageRisk(asset: Pick<CreativeAsset, "title" | "altText" | "publicUrl" | "madeWithAi">) {
  const text = `${asset.title} ${asset.altText ?? ""}`.toLowerCase();
  const blockedTerms = ["無断転載", "断定", "guaranteed cure", "100% guaranteed", "違法"];
  const warningTerms = ["医療", "法律", "投資", "金融", "最安", "必ず"];

  const blocked = blockedTerms.find((term) => text.includes(term.toLowerCase()));
  if (blocked) {
    return { status: LinkCheckStatus.BLOCKED, reason: `Blocked image risk term: ${blocked}` };
  }

  if (!asset.publicUrl || (!asset.publicUrl.startsWith("/generated-images/") && !asset.publicUrl.startsWith("http"))) {
    return { status: LinkCheckStatus.BLOCKED, reason: "Image URL is not allowed." };
  }

  const warning = warningTerms.find((term) => text.includes(term.toLowerCase()));
  if (warning) {
    return { status: LinkCheckStatus.WARNING, reason: `Manual review recommended for: ${warning}` };
  }

  return {
    status: LinkCheckStatus.SAFE,
    reason: asset.madeWithAi ? "AI-generated mock image passed Phase 3 checklist." : "Image passed Phase 3 checklist."
  };
}

export function assertAssetUsable(asset: Pick<CreativeAsset, "approvalStatus" | "riskCheckStatus">) {
  if (asset.approvalStatus !== AssetApprovalStatus.APPROVED) {
    throw new Error("Only approved images can be linked to WordPress or X posts.");
  }
  if (asset.riskCheckStatus !== LinkCheckStatus.SAFE) {
    throw new Error("Only images with a safe risk check can be linked to WordPress or X posts.");
  }
}
