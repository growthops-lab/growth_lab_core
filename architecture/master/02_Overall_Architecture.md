# 02 Overall Architecture

## 1. Purpose

Describe the top-level Growth Lab Core architecture.

## 2. Scope

Includes Next.js, TypeScript, PostgreSQL, Prisma, workers, API integrations, dashboards, and document governance.

## 3. Background

Growth Lab Core coordinates media operations across content, SNS, affiliate revenue, analytics, campaign management, and reporting.

## 4. Design Policy

- Use Next.js for dashboard and server actions.
- Use PostgreSQL as the primary database.
- Use Prisma as the domain persistence layer.
- Use workers for scheduled and background processing.
- Use mock mode for risky or external operations by default.

## 5. Architecture Overview

```text
Dashboard / Server Actions
  -> Domain Libraries
  -> Prisma
  -> PostgreSQL

Workers
  -> Scheduled jobs
  -> Safe execution gates
  -> Logs and snapshots

External APIs
  -> OAuth / token storage
  -> API clients
  -> Quota and error logs
```

## 6. Requirements

### 6.1 Functional Requirements

- Manage media, posts, assets, revenue, SEO, operations, campaigns, and reports.
- Preserve source attribution and confidence levels.
- Support mock and real API modes.

### 6.2 Non-Functional Requirements

- Local-first MVP operation.
- Docker-compatible PostgreSQL.
- Incremental phase expansion.

## 7. Operation Policy

Real external actions must be disabled by default until credentials, approvals, and limits are configured.

## 8. Security and Compliance

External credentials must be encrypted or omitted; sensitive data must not be exported.

## 9. Scalability

The architecture uses domain modules so future integrations can be added without replacing existing phases.

## 10. Risks

- Domain coupling can grow if cross-module data is linked directly instead of via controlled relation models.
- Workers can duplicate work without idempotency.

## 11. Review Points

- Are safe defaults preserved?
- Are cross-domain features using relation and attribution models?

## 12. Architecture Decision Records

See ADR-0001 for the initial master architecture policy.
