# 01 Architecture Principles

## 1. Purpose

Define the principles that guide Growth Lab Core design, implementation, and operations.

## 2. Scope

Applies to product architecture, data architecture, automation, AI workflows, SNS operations, WordPress workflows, analytics, and reporting.

## 3. Background

Growth Lab Core must maximize growth while respecting platform terms, API limits, human approval, and data safety.

## 4. Design Policy

1. Compliance First
2. API First
3. Security by Design
4. AI First with Human Review
5. Automation First with Safe Defaults
6. Scalable Domain Boundaries
7. Observability
8. Cost Optimization
9. Single Source of Truth
10. Continuous Improvement

## 5. Architecture Overview

The system uses clear domain layers for media, SNS, WordPress, creative assets, affiliate revenue, analytics, campaigns, reports, and operations.

## 6. Requirements

### 6.1 Functional Requirements

- All posting workflows require approval before real publication.
- Official APIs are preferred over fragile automation.
- Domain models must preserve auditability.

### 6.2 Non-Functional Requirements

- Safe by default.
- Observable by default.
- Extensible without destructive rewrites.

## 7. Operation Policy

Automation may suggest actions, but business-impacting decisions require human review unless explicitly approved by governance.

## 8. Security and Compliance

Secrets must never appear in logs, reports, exports, screenshots, or architecture documents.

## 9. Scalability

Principles must support 20 or more media properties and multiple social/analytics platforms.

## 10. Risks

- Over-automation can violate platform rules.
- Missing observability can hide operational failure.

## 11. Review Points

- Does each feature respect the principles?
- Are human approval gates present where needed?

## 12. Architecture Decision Records

Material deviations from these principles require ADR approval.
