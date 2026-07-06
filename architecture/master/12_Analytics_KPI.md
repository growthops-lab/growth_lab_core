# 12 Analytics and KPI Architecture

## 1. Purpose

Define analytics and KPI architecture for Growth Lab Core.

## 2. Scope

Covers GA4, Search Console, SNS performance, revenue, ROI, Growth Score, campaign reports, and business insights.

## 3. Background

Growth decisions require reliable, attributed, and confidence-marked data.

## 4. Design Policy

- Separate mock, CSV, manual, and API sources.
- Preserve data confidence.
- Separate pending and approved revenue.
- Store snapshots for reproducibility.

## 5. Architecture Overview

Analytics flows from source imports and API syncs into daily metrics, performance snapshots, ROI snapshots, Growth Score snapshots, recommendations, and reports.

## 6. Requirements

### 6.1 Functional Requirements

- Track traffic, clicks, impressions, conversions, revenue, cost, ROI, and campaign performance.
- Create improvement recommendations.
- Generate reports for human review.

### 6.2 Non-Functional Requirements

- Source traceability.
- Double-count prevention.
- Human-reviewable insights.

## 7. Operation Policy

Insights must support decision-making but must not automatically change budget, pause campaigns, publish content, or increase posting volume.

## 8. Security and Compliance

Exports must exclude private credentials and unnecessary internal identifiers.

## 9. Scalability

Analytics models must support multiple media properties and campaigns.

## 10. Risks

- Double-counted revenue.
- Low-confidence data presented as certain.
- Unreviewed recommendations.

## 11. Review Points

- Is data confidence displayed?
- Are ROI conditions stored in snapshots?

## 12. Architecture Decision Records

New KPI definitions require ADR review.
