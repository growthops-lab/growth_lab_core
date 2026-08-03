-- CreateEnum
CREATE TYPE "ApprovalGateRecordStatus" AS ENUM ('DRAFT', 'REVIEW_REQUIRED', 'APPROVED', 'BLOCKED', 'DEFERRED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApprovalGateReviewCheckStatus" AS ENUM ('NOT_CHECKED', 'PASS', 'WARNING', 'BLOCKED', 'DEFERRED', 'NOT_APPLICABLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ApprovalGateActorRole" AS ENUM ('HUMAN_OWNER', 'REVIEWER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ApprovalGateAuditEventType" AS ENUM ('APPROVAL_GATE_TRANSITION');

-- CreateTable
CREATE TABLE "ApprovalGateRecord" (
    "id" TEXT NOT NULL,
    "approvalGateId" TEXT NOT NULL,
    "status" "ApprovalGateRecordStatus" NOT NULL,
    "recordVersion" INTEGER NOT NULL DEFAULT 0,
    "reviewTerms" "ApprovalGateReviewCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "reviewDisclosure" "ApprovalGateReviewCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "reviewProhibitedExpression" "ApprovalGateReviewCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "humanOwnerDecisionRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalGateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalGateProcessedTransition" (
    "id" TEXT NOT NULL,
    "approvalGateId" TEXT NOT NULL,
    "transitionRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalGateProcessedTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalGateAuditEventRecord" (
    "id" TEXT NOT NULL,
    "approvalGateId" TEXT NOT NULL,
    "transitionRequestId" TEXT NOT NULL,
    "eventType" "ApprovalGateAuditEventType" NOT NULL,
    "fromStatus" "ApprovalGateRecordStatus" NOT NULL,
    "toStatus" "ApprovalGateRecordStatus" NOT NULL,
    "actorRole" "ApprovalGateActorRole" NOT NULL,
    "recordVersion" INTEGER NOT NULL,
    "contentReference" TEXT,
    "reviewReference" TEXT,
    "evidenceReference" TEXT,
    "publishRequestReference" TEXT,
    "archiveReference" TEXT,
    "authorizationSubjectReference" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalGateAuditEventRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalGateRecord_approvalGateId_key" ON "ApprovalGateRecord"("approvalGateId");

-- CreateIndex
CREATE INDEX "ApprovalGateRecord_status_updatedAt_idx" ON "ApprovalGateRecord"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "ApprovalGateProcessedTransition_approvalGateId_createdAt_id_idx" ON "ApprovalGateProcessedTransition"("approvalGateId", "createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalGateProcessedTransition_approvalGateId_transitionRe_key" ON "ApprovalGateProcessedTransition"("approvalGateId", "transitionRequestId");

-- CreateIndex
CREATE INDEX "ApprovalGateAuditEventRecord_approvalGateId_occurredAt_id_idx" ON "ApprovalGateAuditEventRecord"("approvalGateId", "occurredAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalGateAuditEventRecord_approvalGateId_transitionReque_key" ON "ApprovalGateAuditEventRecord"("approvalGateId", "transitionRequestId");

-- AddForeignKey
ALTER TABLE "ApprovalGateProcessedTransition" ADD CONSTRAINT "ApprovalGateProcessedTransition_approvalGateId_fkey" FOREIGN KEY ("approvalGateId") REFERENCES "ApprovalGateRecord"("approvalGateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalGateAuditEventRecord" ADD CONSTRAINT "ApprovalGateAuditEventRecord_approvalGateId_fkey" FOREIGN KEY ("approvalGateId") REFERENCES "ApprovalGateRecord"("approvalGateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalGateAuditEventRecord" ADD CONSTRAINT "ApprovalGateAuditEventRecord_approvalGateId_transitionRequ_fkey" FOREIGN KEY ("approvalGateId", "transitionRequestId") REFERENCES "ApprovalGateProcessedTransition"("approvalGateId", "transitionRequestId") ON DELETE RESTRICT ON UPDATE CASCADE;
