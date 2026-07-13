# Growth Lab Core Master Architecture Specification

Version: 1.0 Draft

## Positioning

Growth Lab Core Master Architecture Specification is the highest-level architecture specification for Growth Lab Core.

This document set defines the master architecture for SNS operation, mail platform, WordPress media platform, AI operation, analytics, security, and operations.

All lower-level specifications, implementation instructions, operation manuals, automation rules, and future improvements must follow this master architecture.

## Single Source of Truth

Growth Lab Core Master Architecture Specification is the Single Source of Truth for design, development, operation, and continuous improvement.

If a lower-level document conflicts with this specification, this specification takes priority.

## Document Structure

| Chapter | File | Title | Status | Notes |
|---|---|---|---|---|
| 00 | 00_Document_Governance.md | Document Governance | Completed / Reflected | Document governance and SSOT policy |
| 01 | 01_Architecture_Principles.md | Architecture Principles | Completed / Reflected | Core architecture principles |
| 02 | 02_Overall_Architecture.md | Overall Architecture | Completed / Reflected | Overall system architecture |
| 03 | 03_Mail_Platform.md | Mail Platform | Completed / Reflected | Mail platform architecture |
| 04 | 04_SNS_Platform.md | SNS Platform | Completed / Reflected | SNS platform architecture |
| 05 | 05_WordPress_Platform.md | WordPress Platform | Completed / Reflected | WordPress and affiliate media architecture |
| 06 | 06_AI_Platform.md | AI Platform | Completed / Reflected | AI platform architecture |
| 07 | 07_Growth_Lab_Core_System.md | Growth Lab Core System | Completed / Reflected | Core system, workflow, scheduler, automation |
| 08 | 08_Database.md | Database | Completed / Reflected | Database architecture |
| 09 | 09_API_OAuth.md | API and OAuth | Completed / Reflected | API and OAuth architecture |
| 10 | 10_Security.md | Security | Completed / Reflected | Security architecture |
| 11 | 11_Operations.md | Operations | Completed / Reflected | Operations architecture |
| 12 | 12_Analytics_KPI.md | Analytics and KPI | Completed / Reflected | Analytics and KPI architecture |
| 13 | 13_Roadmap.md | Roadmap | Completed / Reflected | Roadmap architecture |
| 14 | 14_ADR.md | ADR | Completed / Reflected | Architecture Decision Record policy |

## Scale Gate Naming Reference

| Chapter | Formal Scale Gate Name | Notes |
|---|---|---|
| 03 | Mail Scale Gate | Mail account and mail operation expansion readiness |
| 04 | SNS Scale Gate | SNS account and platform expansion readiness |
| 05 | WordPress Scale Gate | WordPress and affiliate media expansion readiness |
| 06 | AI Scale Gate | AI usage and AI output operation expansion readiness |
| 07 | Growth Lab Core System Scale Gate | Core system, workflow, scheduler, automation, monitoring readiness |
| 08 | Database Scale Gate | Database migration and data integrity readiness |
| 09 | API and OAuth Scale Gate | API, OAuth, scope, webhook, rate limit, retry readiness |
| 10 | Security Scale Gate | Secret, access control, incident, security readiness |
| 11 | Operations Scale Gate | Daily, weekly, monthly operations and runbook readiness |
| 12 | Analytics and KPI Scale Gate | KPI, analytics, ROI, report, dashboard readiness |
| 13 | Roadmap Scale Gate | Integrated roadmap expansion readiness |

## Core Architecture Principles

1. Compliance First
2. API First
3. Security by Design
4. AI First
5. Automation First
6. Scalability
7. Observability
8. Cost Optimization
9. Single Source of Truth
10. Continuous Improvement

## Document Policy

- Markdown is the primary source format.
- Word documents are generated for human review.
- All files must be saved as UTF-8.
- Architecture Decision Records must be used for important design decisions.
- This document set must be updated whenever the Growth Lab Core architecture changes.
