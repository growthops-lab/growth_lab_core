# 11 Operations Architecture

## 1. Purpose

Define operations architecture for Growth Lab Core.

## 2. Scope

Covers workers, scheduled tasks, freshness checks, alert detection, notifications, health checks, reports, and manual review.

## 3. Background

The platform requires ongoing monitoring and repeatable safe operations across content and social workflows.

## 4. Design Policy

- Dry-run or mock mode by default.
- Record task runs.
- Detect data freshness and anomalies.
- Notify humans without exposing secrets.

## 5. Architecture Overview

Operations uses scheduled tasks, task runs, data freshness records, alert incidents, notification events, and health snapshots.

## 6. Requirements

### 6.1 Functional Requirements

- Run scheduled sync and detection tasks.
- Track successes and failures.
- Create alerts and notifications.
- Support manual pause/resume.

### 6.2 Non-Functional Requirements

- Idempotent workers.
- Observable failures.
- No uncontrolled external sending.

## 7. Operation Policy

Automation may generate alerts and recommendations, but business-impacting decisions remain human reviewed.

## 8. Security and Compliance

Notifications must not include tokens, passwords, webhooks, or authorization headers.

## 9. Scalability

Workers must support more tasks without duplicate processing through locks and leases.

## 10. Risks

- Duplicate task execution.
- Alert fatigue.
- Stale data.

## 11. Review Points

- Are failed tasks visible?
- Are workers disabled safely when configured off?

## 12. Architecture Decision Records

New operational automation categories require ADR review.
