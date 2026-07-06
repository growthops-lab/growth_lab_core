# 08 Database Architecture

## 1. Purpose

Define the database architecture for Growth Lab Core.

## 2. Scope

Covers PostgreSQL, Prisma models, relations, seed data, attribution, logs, and snapshots.

## 3. Background

The database is the source of operational truth for media, content, accounts, analytics, campaigns, and reports.

## 4. Design Policy

- PostgreSQL is the primary database.
- Prisma schema is the application data contract.
- Historical measurements are stored as snapshots.
- Cross-domain attribution uses explicit relation models.

## 5. Architecture Overview

Primary domains include Media, SocialAccount, Post, WordPress, CreativeAsset, Affiliate, Revenue, Analytics, Operations, ArticleImprovement, SocialPosting, Campaign, Calendar, Report, and BusinessInsight.

## 6. Requirements

### 6.1 Functional Requirements

- Store operational records.
- Store performance snapshots.
- Store API logs and errors.
- Store approval and safety check history.

### 6.2 Non-Functional Requirements

- Referential integrity.
- Idempotency keys.
- Data confidence markers.
- Double-count protection for attribution.

## 7. Operation Policy

Schema changes require validation, client generation, database push or migration, seed verification, and build verification.

## 8. Security and Compliance

Tokens and secrets must not be stored in plaintext unless explicitly modeled as encrypted values or intentionally null in mock mode.

## 9. Scalability

Indexes must be added for status, date, platform, and relation lookups as domains grow.

## 10. Risks

- Overloaded models.
- Duplicate attribution.
- Missing source confidence.

## 11. Review Points

- Are pending and approved revenue separated?
- Are source IDs and allocation rates preserved?

## 12. Architecture Decision Records

Major schema redesigns require ADRs.
