-- CreateEnum
CREATE TYPE "HumanIdentityGrantRole" AS ENUM ('HUMAN_OWNER');

-- CreateEnum
CREATE TYPE "HumanIdentityAuditEventType" AS ENUM ('LOGIN_SUCCEEDED', 'SESSION_REVOKED', 'LOGGED_OUT');

-- CreateTable
CREATE TABLE "HumanIdentity" (
    "id" TEXT NOT NULL,
    "externalSubjectHmac" TEXT NOT NULL,
    "opaqueSubjectReference" TEXT NOT NULL,
    "disabledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HumanIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanIdentityGrant" (
    "id" TEXT NOT NULL,
    "humanIdentityId" TEXT NOT NULL,
    "role" "HumanIdentityGrantRole" NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HumanIdentityGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanIdentitySession" (
    "id" TEXT NOT NULL,
    "humanIdentityId" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanIdentitySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HumanIdentityAuditEvent" (
    "id" TEXT NOT NULL,
    "humanIdentityId" TEXT NOT NULL,
    "sessionId" TEXT,
    "eventType" "HumanIdentityAuditEventType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HumanIdentityAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HumanIdentity_externalSubjectHmac_key" ON "HumanIdentity"("externalSubjectHmac");

-- CreateIndex
CREATE UNIQUE INDEX "HumanIdentity_opaqueSubjectReference_key" ON "HumanIdentity"("opaqueSubjectReference");

-- CreateIndex
CREATE INDEX "HumanIdentity_disabledAt_createdAt_idx" ON "HumanIdentity"("disabledAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "HumanIdentityGrant_humanIdentityId_role_key" ON "HumanIdentityGrant"("humanIdentityId", "role");

-- CreateIndex
CREATE INDEX "HumanIdentityGrant_role_revokedAt_idx" ON "HumanIdentityGrant"("role", "revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HumanIdentitySession_sessionTokenHash_key" ON "HumanIdentitySession"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "HumanIdentitySession_humanIdentityId_expiresAt_idx" ON "HumanIdentitySession"("humanIdentityId", "expiresAt");

-- CreateIndex
CREATE INDEX "HumanIdentitySession_expiresAt_revokedAt_idx" ON "HumanIdentitySession"("expiresAt", "revokedAt");

-- CreateIndex
CREATE INDEX "HumanIdentityAuditEvent_humanIdentityId_occurredAt_id_idx" ON "HumanIdentityAuditEvent"("humanIdentityId", "occurredAt", "id");

-- CreateIndex
CREATE INDEX "HumanIdentityAuditEvent_sessionId_occurredAt_idx" ON "HumanIdentityAuditEvent"("sessionId", "occurredAt");

-- AddForeignKey
ALTER TABLE "HumanIdentityGrant" ADD CONSTRAINT "HumanIdentityGrant_humanIdentityId_fkey" FOREIGN KEY ("humanIdentityId") REFERENCES "HumanIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanIdentitySession" ADD CONSTRAINT "HumanIdentitySession_humanIdentityId_fkey" FOREIGN KEY ("humanIdentityId") REFERENCES "HumanIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanIdentityAuditEvent" ADD CONSTRAINT "HumanIdentityAuditEvent_humanIdentityId_fkey" FOREIGN KEY ("humanIdentityId") REFERENCES "HumanIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HumanIdentityAuditEvent" ADD CONSTRAINT "HumanIdentityAuditEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "HumanIdentitySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
