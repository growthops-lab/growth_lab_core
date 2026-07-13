# ADR Candidate Index

Document Name: Growth Lab Core ADR Candidate Index
Target: architecture/master 00 to 14
Status: Draft
Primary Format: Markdown
Target File: architecture/master/review/ADR_Candidate_Index.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本文書は、Master Architecture各章に分散しているFuture ADR candidatesを横断整理するためのIndexである。

本文書は正式ADRではない。本文書は、正式ADR作成の優先順位とMVP実装前に判断が必要な候補を整理するために使用する。

本文書は、MVP作成を進めるSNS運用チーム開発部門チャットの実装準備にも使用する。

## 2. Scope

- architecture/master 00 to 14
- README
- ADR README
- ADR-0001
- Improvement Proposal
- Completion Declaration

## 3. Important Notes

- Formal ADR files are only files under `architecture/master/adr/ADR-*.md`.
- This ADR Candidate Index is not a formal ADR.
- Index IDs are not final ADR numbers.
- Source Candidate IDs are not final ADR numbers unless formal ADR files exist.
- Candidate IDs do not reserve ADR numbers.
- Human Owner approval is required before creating or accepting any formal ADR.
- Codex can support drafting, extraction, and classification, but cannot approve ADRs.
- This document must not contain Secret material.

## 4. Formal ADR Status

```text
Formal ADR files currently confirmed:
- ADR-0001-Initial-Architecture-Policy.md

Formal ADR count:
- 1

Candidate index status:
- Draft

Formal ADR creation in this task:
- None
```

## 5. Candidate Extraction Summary

| Chapter | File | Candidate Count | P1 | P2 | P3 | Human Owner Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 00 Document Governance | 00_Document_Governance.md | 3 | 0 | 0 | 3 | 0 | Extracted from Future ADR candidates section. |
| 01 Architecture Principles | 01_Architecture_Principles.md | 8 | 2 | 0 | 6 | 0 | Extracted from Future ADR candidates section. |
| 02 Overall Architecture | 02_Overall_Architecture.md | 9 | 1 | 7 | 1 | 0 | Extracted from Future ADR candidates section. |
| 03 Mail Platform | 03_Mail_Platform.md | 9 | 4 | 3 | 1 | 1 | Extracted from Future ADR candidates section. |
| 04 SNS Platform | 04_SNS_Platform.md | 13 | 7 | 5 | 1 | 0 | Extracted from Future ADR candidates section. |
| 05 WordPress Platform | 05_WordPress_Platform.md | 13 | 4 | 8 | 1 | 0 | Extracted from Future ADR candidates section. |
| 06 AI Platform | 06_AI_Platform.md | 13 | 3 | 7 | 1 | 2 | Extracted from Future ADR candidates section. |
| 07 Growth Lab Core System | 07_Growth_Lab_Core_System.md | 16 | 5 | 10 | 1 | 0 | Extracted from Future ADR candidates section. |
| 08 Database | 08_Database.md | 15 | 10 | 5 | 0 | 0 | Extracted from Future ADR candidates section. |
| 09 API and OAuth | 09_API_OAuth.md | 15 | 10 | 4 | 0 | 1 | Extracted from Future ADR candidates section. |
| 10 Security | 10_Security.md | 16 | 12 | 3 | 0 | 1 | Extracted from Future ADR candidates section. |
| 11 Operations | 11_Operations.md | 21 | 5 | 15 | 0 | 1 | Extracted from Future ADR candidates section. |
| 12 Analytics and KPI | 12_Analytics_KPI.md | 18 | 0 | 18 | 0 | 0 | Extracted from Future ADR candidates section. |
| 13 Roadmap | 13_Roadmap.md | 24 | 4 | 15 | 0 | 5 | Extracted from Future ADR candidates section. |
| 14 ADR | 14_ADR.md | 16 | 0 | 6 | 10 | 0 | Extracted from Future ADR candidates section. |

## 6. Priority Summary

| Priority | Count | Meaning | Notes |
| --- | --- | --- | --- |
| P1 | 67 | MVP or Phase 1 relevant | Review before or during Phase 1 implementation preparation. |
| P2 | 106 | Important but not immediate blocker | Handle early after v1.0 Draft completion. |
| P3 | 25 | Future improvement | Handle as governance or documentation improvement. |
| Human Owner Decision | 11 | Requires owner decision | Business, risk, cost, provider, or roadmap decision required. |

## 7. MVP-Relevant ADR Candidates

| Index ID | Source Candidate ID | Candidate Title | Source Chapter | Category | Priority | MVP Impact | Formal ADR Required Now | Recommended Timing | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ACI-CH01-005 | ADR-0006 | API First Integration Policy | 01 Architecture Principles | Architecture Principles | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH01-006 | ADR-0007 | Security by Design and Secret Management Policy | 01 Architecture Principles | Architecture Principles | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH02-003 | ADR-0011 | Identity-Centric Architecture | 02 Overall Architecture | Overall Architecture | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH03-002 | ADR-0011 | Identity-Centric Architecture | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH03-004 | ADR-0019 | One Mail Address per SNS Account Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH03-005 | ADR-0020 | Google Workspace Scope Policy | 03 Mail Platform | Mail Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH03-007 | ADR-0022 | Mail Account Registry Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH03-008 | ADR-0023 | Mail Recovery and TOTP Relationship Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-002 | ADR-0011 | Identity-Centric Architecture | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-004 | ADR-0019 | One Mail Address per SNS Account Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-006 | ADR-0026 | SNS Account Registry Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-007 | ADR-0027 | SNS Account Lifecycle Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-008 | ADR-0028 | SNS API and OAuth Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-009 | ADR-0029 | SNS Publishing Boundary Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH04-010 | ADR-0030 | SNS Automation Boundary Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH05-007 | ADR-0036 | WordPress Site Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH05-008 | ADR-0037 | Article Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH05-009 | ADR-0038 | Affiliate Link Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH05-010 | ADR-0039 | WordPress REST API Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH06-006 | ADR-0044 | Prompt Management Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH06-007 | ADR-0045 | AI Output Registry Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH06-008 | ADR-0046 | Human Review and Approval Gate Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH06-010 | ADR-0048 | High-Risk Domain AI Usage Policy | 06 AI Platform | AI Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH06-011 | ADR-0049 | AI Cost and ROI Policy | 06 AI Platform | AI Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH07-003 | ADR-0011 | Identity-Centric Architecture | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH07-009 | ADR-0054 | Workflow and Approval Gate Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH07-010 | ADR-0055 | Scheduler and Automation Engine Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH07-011 | ADR-0056 | Integration Adapter Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH07-012 | ADR-0057 | Registry to Database Migration Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-001 | ADR-0005 | Core Architecture Principles | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-004 | ADR-0052 | Growth Lab Core System Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-006 | ADR-0062 | Database Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-007 | ADR-0063 | PostgreSQL Initial Database Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-008 | ADR-0064 | Prisma ORM Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-009 | ADR-0065 | Registry to Database Migration Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-010 | ADR-0066 | Database ID Design Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH08-011 | ADR-0067 | Database Relation Design Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-001 | ADR-0005 | Core Architecture Principles | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-002 | ADR-0012 | Integration Layer Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-004 | ADR-0052 | Growth Lab Core System Architecture | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-006 | ADR-0072 | API and OAuth Architecture | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-007 | ADR-0073 | API First Integration Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-008 | ADR-0074 | OAuth Scope Management Policy | 09 API and OAuth | API and OAuth | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH09-009 | ADR-0075 | Token Reference and Secret Boundary Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-010 | ADR-0076 | API Adapter Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH09-015 | ADR-0081 | API and OAuth Scale Gate Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-001 | ADR-0005 | Core Architecture Principles | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-003 | ADR-0052 | Growth Lab Core System Architecture | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-005 | ADR-0082 | Security Architecture | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-006 | ADR-0083 | Secret Management Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-007 | ADR-0084 | Token Protection Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-008 | ADR-0085 | Password and 2FA Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-009 | ADR-0086 | TOTP and Recovery Code Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-010 | ADR-0087 | Access Control and Role Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-011 | ADR-0088 | AI Input Secret Protection Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-012 | ADR-0089 | Automation Security Boundary Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-015 | ADR-0092 | Account Lifecycle and Offboarding Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH10-016 | ADR-0093 | Security Exception and Risk Acceptance Policy | 10 Security | Security | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH11-004 | ADR-0054 | Workflow and Approval Gate Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH11-005 | ADR-0055 | Scheduler and Automation Engine Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH11-012 | ADR-0097 | Approval Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH11-015 | ADR-0100 | Secret Rotation Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH11-016 | ADR-0101 | Scheduler and Automation Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH11-019 | ADR-0104 | Provider and Terms Change Operations Policy | 11 Operations | Operations | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-004 | ADR-0054 | Workflow and Approval Gate Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH13-005 | ADR-0055 | Scheduler and Automation Engine Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH13-014 | ADR-0121 | MVP Scope Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-015 | ADR-0122 | Priority and Dependency Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-017 | ADR-0124 | API and OAuth Roadmap Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH13-018 | ADR-0125 | Security Before Automation Roadmap Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. |
| ACI-CH13-020 | ADR-0127 | Cost and Investment Decision Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-023 | ADR-0130 | Roadmap Exception Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-024 | ADR-0131 | Provider Change Roadmap Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |

## 8. Full ADR Candidate Index

| Index ID | Source Candidate ID | Candidate Title | Source Chapter | Category | Priority | MVP Impact | Formal ADR Required Now | Recommended Timing | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ACI-CH00-001 | ADR-0002 | Markdown as Primary Source Format | 00 Document Governance | Document Governance | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH00-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | 00 Document Governance | Document Governance | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH00-003 | ADR-0004 | Chapter-Based Architecture Review Process | 00 Document Governance | Document Governance | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-001 | ADR-0002 | Markdown as Primary Source Format | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-003 | ADR-0004 | Chapter-Based Architecture Review Process | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-004 | ADR-0005 | Core Architecture Principles | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-005 | ADR-0006 | API First Integration Policy | 01 Architecture Principles | Architecture Principles | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH01-006 | ADR-0007 | Security by Design and Secret Management Policy | 01 Architecture Principles | Architecture Principles | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH01-007 | ADR-0008 | AI First Operation Policy | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-008 | ADR-0009 | Account Scalability and Optimization Policy | 01 Architecture Principles | Architecture Principles | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH02-001 | ADR-0005 | Core Architecture Principles | 02 Overall Architecture | Overall Architecture | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-002 | ADR-0010 | Overall Architecture Structure | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-003 | ADR-0011 | Identity-Centric Architecture | 02 Overall Architecture | Overall Architecture | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-004 | ADR-0012 | Integration Layer Policy | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-005 | ADR-0013 | Growth Lab Core Deployment Phases | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH02-006 | ADR-0014 | SNS to WordPress Affiliate Flow | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-007 | ADR-0015 | Observability Architecture Policy | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH02-008 | ADR-0016 | Scale Gate Policy | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-009 | ADR-0017 | Data Boundary and Security Boundary Policy | 02 Overall Architecture | Overall Architecture | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH03-001 | ADR-0005 | Core Architecture Principles | 03 Mail Platform | Mail Platform | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-002 | ADR-0011 | Identity-Centric Architecture | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-003 | ADR-0018 | Mail Platform Architecture | 03 Mail Platform | Mail Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-004 | ADR-0019 | One Mail Address per SNS Account Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-005 | ADR-0020 | Google Workspace Scope Policy | 03 Mail Platform | Mail Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH03-006 | ADR-0021 | Independent Domain Mail and Forwarding Policy | 03 Mail Platform | Mail Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH03-007 | ADR-0022 | Mail Account Registry Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH03-008 | ADR-0023 | Mail Recovery and TOTP Relationship Policy | 03 Mail Platform | Mail Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH03-009 | ADR-0024 | Mail Scale Gate Policy | 03 Mail Platform | Mail Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH04-001 | ADR-0005 | Core Architecture Principles | 04 SNS Platform | SNS Platform | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-002 | ADR-0011 | Identity-Centric Architecture | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-003 | ADR-0018 | Mail Platform Architecture | 04 SNS Platform | SNS Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-004 | ADR-0019 | One Mail Address per SNS Account Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-005 | ADR-0025 | SNS Platform Architecture | 04 SNS Platform | SNS Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-006 | ADR-0026 | SNS Account Registry Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH04-007 | ADR-0027 | SNS Account Lifecycle Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH04-008 | ADR-0028 | SNS API and OAuth Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH04-009 | ADR-0029 | SNS Publishing Boundary Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH04-010 | ADR-0030 | SNS Automation Boundary Policy | 04 SNS Platform | SNS Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH04-011 | ADR-0031 | SNS Scale Gate Policy | 04 SNS Platform | SNS Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH04-012 | ADR-0032 | SNS to WordPress Traffic Flow Policy | 04 SNS Platform | SNS Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-013 | ADR-0033 | SNS Risk Management Policy | 04 SNS Platform | SNS Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH05-001 | ADR-0005 | Core Architecture Principles | 05 WordPress Platform | WordPress Platform | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-002 | ADR-0014 | SNS to WordPress Affiliate Flow | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-003 | ADR-0025 | SNS Platform Architecture | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-004 | ADR-0032 | SNS to WordPress Traffic Flow Policy | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-005 | ADR-0034 | WordPress Platform Architecture | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-006 | ADR-0035 | Xserver Initial Hosting Policy | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH05-007 | ADR-0036 | WordPress Site Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH05-008 | ADR-0037 | Article Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH05-009 | ADR-0038 | Affiliate Link Registry Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH05-010 | ADR-0039 | WordPress REST API Policy | 05 WordPress Platform | WordPress Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH05-011 | ADR-0040 | WordPress SEO and Performance Policy | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH05-012 | ADR-0041 | WordPress Backup and Recovery Policy | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH05-013 | ADR-0042 | WordPress Scale Gate Policy | 05 WordPress Platform | WordPress Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH06-001 | ADR-0005 | Core Architecture Principles | 06 AI Platform | AI Platform | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-002 | ADR-0008 | AI First Operation Policy | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-003 | ADR-0025 | SNS Platform Architecture | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-004 | ADR-0034 | WordPress Platform Architecture | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-005 | ADR-0043 | AI Platform Architecture | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-006 | ADR-0044 | Prompt Management Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH06-007 | ADR-0045 | AI Output Registry Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH06-008 | ADR-0046 | Human Review and Approval Gate Policy | 06 AI Platform | AI Platform | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH06-009 | ADR-0047 | AI Execution Boundary Policy | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH06-010 | ADR-0048 | High-Risk Domain AI Usage Policy | 06 AI Platform | AI Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH06-011 | ADR-0049 | AI Cost and ROI Policy | 06 AI Platform | AI Platform | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH06-012 | ADR-0050 | AI Scale Gate Policy | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH06-013 | ADR-0051 | Codex and Claude Code AI Support Policy | 06 AI Platform | AI Platform | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH07-001 | ADR-0005 | Core Architecture Principles | 07 Growth Lab Core System | Core System | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-002 | ADR-0010 | Overall Architecture Structure | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-003 | ADR-0011 | Identity-Centric Architecture | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-004 | ADR-0012 | Integration Layer Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-005 | ADR-0016 | Scale Gate Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-006 | ADR-0043 | AI Platform Architecture | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-007 | ADR-0052 | Growth Lab Core System Architecture | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-008 | ADR-0053 | Domain Module Boundary Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH07-009 | ADR-0054 | Workflow and Approval Gate Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-010 | ADR-0055 | Scheduler and Automation Engine Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-011 | ADR-0056 | Integration Adapter Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-012 | ADR-0057 | Registry to Database Migration Policy | 07 Growth Lab Core System | Core System | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-013 | ADR-0058 | Audit Log Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-014 | ADR-0059 | Monitoring and Alert Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH07-015 | ADR-0060 | Local Development and Mock Mode Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH07-016 | ADR-0061 | Growth Lab Core System Scale Gate Policy | 07 Growth Lab Core System | Core System | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH08-001 | ADR-0005 | Core Architecture Principles | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-003 | ADR-0016 | Scale Gate Policy | 08 Database | Database | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-004 | ADR-0052 | Growth Lab Core System Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-006 | ADR-0062 | Database Architecture | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-007 | ADR-0063 | PostgreSQL Initial Database Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-008 | ADR-0064 | Prisma ORM Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-009 | ADR-0065 | Registry to Database Migration Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-010 | ADR-0066 | Database ID Design Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-011 | ADR-0067 | Database Relation Design Policy | 08 Database | Database | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH08-012 | ADR-0068 | Soft Delete and Archive Policy | 08 Database | Database | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH08-013 | ADR-0069 | Database Migration Policy | 08 Database | Database | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH08-014 | ADR-0070 | Database Backup and Restore Policy | 08 Database | Database | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH08-015 | ADR-0071 | Database Scale Gate Policy | 08 Database | Database | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH09-001 | ADR-0005 | Core Architecture Principles | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-002 | ADR-0012 | Integration Layer Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-003 | ADR-0016 | Scale Gate Policy | 09 API and OAuth | API and OAuth | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-004 | ADR-0052 | Growth Lab Core System Architecture | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-006 | ADR-0072 | API and OAuth Architecture | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH09-007 | ADR-0073 | API First Integration Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH09-008 | ADR-0074 | OAuth Scope Management Policy | 09 API and OAuth | API and OAuth | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH09-009 | ADR-0075 | Token Reference and Secret Boundary Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-010 | ADR-0076 | API Adapter Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH09-011 | ADR-0077 | Webhook Policy | 09 API and OAuth | API and OAuth | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH09-012 | ADR-0078 | Rate Limit and Retry Policy | 09 API and OAuth | API and OAuth | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH09-013 | ADR-0079 | Mock Mode and Sandbox Policy | 09 API and OAuth | API and OAuth | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH09-015 | ADR-0081 | API and OAuth Scale Gate Policy | 09 API and OAuth | API and OAuth | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-001 | ADR-0005 | Core Architecture Principles | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-002 | ADR-0016 | Scale Gate Policy | 10 Security | Security | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-003 | ADR-0052 | Growth Lab Core System Architecture | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-005 | ADR-0082 | Security Architecture | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-006 | ADR-0083 | Secret Management Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-007 | ADR-0084 | Token Protection Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-008 | ADR-0085 | Password and 2FA Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-009 | ADR-0086 | TOTP and Recovery Code Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-010 | ADR-0087 | Access Control and Role Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-011 | ADR-0088 | AI Input Secret Protection Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-012 | ADR-0089 | Automation Security Boundary Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-013 | ADR-0090 | Security Incident Response Policy | 10 Security | Security | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-014 | ADR-0091 | Security Scale Gate Policy | 10 Security | Security | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-015 | ADR-0092 | Account Lifecycle and Offboarding Policy | 10 Security | Security | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH10-016 | ADR-0093 | Security Exception and Risk Acceptance Policy | 10 Security | Security | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH11-001 | ADR-0005 | Core Architecture Principles | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-002 | ADR-0016 | Scale Gate Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-003 | ADR-0052 | Growth Lab Core System Architecture | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-004 | ADR-0054 | Workflow and Approval Gate Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-005 | ADR-0055 | Scheduler and Automation Engine Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-006 | ADR-0058 | Audit Log Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-007 | ADR-0090 | Security Incident Response Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-008 | ADR-0091 | Security Scale Gate Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-009 | ADR-0094 | Operations Architecture | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-010 | ADR-0095 | Daily Weekly Monthly Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-011 | ADR-0096 | Runbook Management Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-012 | ADR-0097 | Approval Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH11-013 | ADR-0098 | Incident Response Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-014 | ADR-0099 | Backup and Restore Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-015 | ADR-0100 | Secret Rotation Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH11-016 | ADR-0101 | Scheduler and Automation Operations Policy | 11 Operations | Operations | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH11-017 | ADR-0102 | Documentation and Changelog Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-018 | ADR-0103 | Operations Scale Gate Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-019 | ADR-0104 | Provider and Terms Change Operations Policy | 11 Operations | Operations | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH11-020 | ADR-0105 | Onboarding and Offboarding Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH11-021 | ADR-0106 | Business Continuity Operations Policy | 11 Operations | Operations | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-001 | ADR-0005 | Core Architecture Principles | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-002 | ADR-0016 | Scale Gate Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-003 | ADR-0052 | Growth Lab Core System Architecture | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-004 | ADR-0058 | Audit Log Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-005 | ADR-0094 | Operations Architecture | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-006 | ADR-0103 | Operations Scale Gate Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-007 | ADR-0107 | Analytics and KPI Architecture | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-008 | ADR-0108 | KPI Definition Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-009 | ADR-0109 | Data Source and Freshness Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-010 | ADR-0110 | Missing Data Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-011 | ADR-0111 | Attribution and Tracking Parameter Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-012 | ADR-0112 | Campaign KPI Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-013 | ADR-0113 | AI Output KPI Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-014 | ADR-0114 | ROI Calculation Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-015 | ADR-0115 | Analytics Report and Dashboard Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-016 | ADR-0116 | Analytics and KPI Scale Gate Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-017 | ADR-0117 | Primary Secondary Guardrail KPI Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH12-018 | ADR-0118 | Roadmap Metrics Policy | 12 Analytics and KPI | Analytics and KPI | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-001 | ADR-0005 | Core Architecture Principles | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-002 | ADR-0016 | Scale Gate Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-003 | ADR-0052 | Growth Lab Core System Architecture | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-004 | ADR-0054 | Workflow and Approval Gate Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-005 | ADR-0055 | Scheduler and Automation Engine Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-006 | ADR-0058 | Audit Log Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-007 | ADR-0094 | Operations Architecture | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-008 | ADR-0103 | Operations Scale Gate Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-009 | ADR-0107 | Analytics and KPI Architecture | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-010 | ADR-0116 | Analytics and KPI Scale Gate Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-011 | ADR-0118 | Roadmap Metrics Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-012 | ADR-0119 | Roadmap Architecture | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-013 | ADR-0120 | Phase and Stage Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH13-014 | ADR-0121 | MVP Scope Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-015 | ADR-0122 | Priority and Dependency Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-016 | ADR-0123 | Database Migration Roadmap Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH13-017 | ADR-0124 | API and OAuth Roadmap Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH13-018 | ADR-0125 | Security Before Automation Roadmap Policy | 13 Roadmap | Roadmap | P1 | High | Yes | Before Phase 1 implementation preparation | MVP Review Needed | Unique source candidate in extracted set. |
| ACI-CH13-019 | ADR-0126 | Scale Stage Expansion Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH13-020 | ADR-0127 | Cost and Investment Decision Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-021 | ADR-0128 | Roadmap Change Management Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH13-022 | ADR-0129 | Roadmap Scale Gate Policy | 13 Roadmap | Roadmap | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH13-023 | ADR-0130 | Roadmap Exception Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-024 | ADR-0131 | Provider Change Roadmap Policy | 13 Roadmap | Roadmap | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH14-001 | ADR-0005 | Core Architecture Principles | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-002 | ADR-0016 | Scale Gate Policy | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-003 | ADR-0052 | Growth Lab Core System Architecture | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Duplicate / Overlap | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-004 | ADR-0058 | Audit Log Policy | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-005 | ADR-0094 | Operations Architecture | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-006 | ADR-0107 | Analytics and KPI Architecture | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-007 | ADR-0119 | Roadmap Architecture | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Duplicate / Overlap | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-008 | ADR-0132 | ADR Governance Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-009 | ADR-0133 | ADR Numbering and Status Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-010 | ADR-0134 | ADR Template Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-011 | ADR-0135 | ADR Supersede and Deprecation Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-012 | ADR-0136 | ADR Index Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-013 | ADR-0137 | ADR and Scale Gate Policy | 14 ADR | ADR Governance | P2 | Medium | Later | Early post-v1.0 Draft improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-014 | ADR-0138 | ADR and Codex Claude Code Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-015 | ADR-0139 | ADR Triage Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |
| ACI-CH14-016 | ADR-0140 | Decision Log Boundary Policy | 14 ADR | ADR Governance | P3 | Low | Later | Post-completion documentation governance improvement | Future Improvement | Unique source candidate in extracted set. |

## 9. Candidate Details by Chapter

### 9.1 Chapter 00 Document Governance

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH00-001 | ADR-0002 | Markdown as Primary Source Format | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH00-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH00-003 | ADR-0004 | Chapter-Based Architecture Review Process | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |

### 9.2 Chapter 01 Architecture Principles

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH01-001 | ADR-0002 | Markdown as Primary Source Format | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-003 | ADR-0004 | Chapter-Based Architecture Review Process | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-004 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-005 | ADR-0006 | API First Integration Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH01-006 | ADR-0007 | Security by Design and Secret Management Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH01-007 | ADR-0008 | AI First Operation Policy | P3 | Low | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH01-008 | ADR-0009 | Account Scalability and Optimization Policy | P3 | Low | Later | Unique source candidate in extracted set. |

### 9.3 Chapter 02 Overall Architecture

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH02-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-002 | ADR-0010 | Overall Architecture Structure | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-003 | ADR-0011 | Identity-Centric Architecture | P1 | High | Yes | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-004 | ADR-0012 | Integration Layer Policy | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-005 | ADR-0013 | Growth Lab Core Deployment Phases | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH02-006 | ADR-0014 | SNS to WordPress Affiliate Flow | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-007 | ADR-0015 | Observability Architecture Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH02-008 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH02-009 | ADR-0017 | Data Boundary and Security Boundary Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.4 Chapter 03 Mail Platform

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH03-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-002 | ADR-0011 | Identity-Centric Architecture | P1 | High | Yes | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-003 | ADR-0018 | Mail Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-004 | ADR-0019 | One Mail Address per SNS Account Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH03-005 | ADR-0020 | Google Workspace Scope Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH03-006 | ADR-0021 | Independent Domain Mail and Forwarding Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH03-007 | ADR-0022 | Mail Account Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH03-008 | ADR-0023 | Mail Recovery and TOTP Relationship Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH03-009 | ADR-0024 | Mail Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.5 Chapter 04 SNS Platform

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH04-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-002 | ADR-0011 | Identity-Centric Architecture | P1 | High | Yes | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-003 | ADR-0018 | Mail Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-004 | ADR-0019 | One Mail Address per SNS Account Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-005 | ADR-0025 | SNS Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-006 | ADR-0026 | SNS Account Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH04-007 | ADR-0027 | SNS Account Lifecycle Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH04-008 | ADR-0028 | SNS API and OAuth Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH04-009 | ADR-0029 | SNS Publishing Boundary Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH04-010 | ADR-0030 | SNS Automation Boundary Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH04-011 | ADR-0031 | SNS Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH04-012 | ADR-0032 | SNS to WordPress Traffic Flow Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH04-013 | ADR-0033 | SNS Risk Management Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.6 Chapter 05 WordPress Platform

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH05-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-002 | ADR-0014 | SNS to WordPress Affiliate Flow | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-003 | ADR-0025 | SNS Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-004 | ADR-0032 | SNS to WordPress Traffic Flow Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-005 | ADR-0034 | WordPress Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH05-006 | ADR-0035 | Xserver Initial Hosting Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH05-007 | ADR-0036 | WordPress Site Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH05-008 | ADR-0037 | Article Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH05-009 | ADR-0038 | Affiliate Link Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH05-010 | ADR-0039 | WordPress REST API Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH05-011 | ADR-0040 | WordPress SEO and Performance Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH05-012 | ADR-0041 | WordPress Backup and Recovery Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH05-013 | ADR-0042 | WordPress Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.7 Chapter 06 AI Platform

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH06-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-002 | ADR-0008 | AI First Operation Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-003 | ADR-0025 | SNS Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-004 | ADR-0034 | WordPress Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-005 | ADR-0043 | AI Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH06-006 | ADR-0044 | Prompt Management Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH06-007 | ADR-0045 | AI Output Registry Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH06-008 | ADR-0046 | Human Review and Approval Gate Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH06-009 | ADR-0047 | AI Execution Boundary Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH06-010 | ADR-0048 | High-Risk Domain AI Usage Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH06-011 | ADR-0049 | AI Cost and ROI Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH06-012 | ADR-0050 | AI Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH06-013 | ADR-0051 | Codex and Claude Code AI Support Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.8 Chapter 07 Growth Lab Core System

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH07-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-002 | ADR-0010 | Overall Architecture Structure | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-003 | ADR-0011 | Identity-Centric Architecture | P1 | High | Yes | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-004 | ADR-0012 | Integration Layer Policy | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-005 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-006 | ADR-0043 | AI Platform Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-007 | ADR-0052 | Growth Lab Core System Architecture | P2 | Medium | Later | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-008 | ADR-0053 | Domain Module Boundary Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH07-009 | ADR-0054 | Workflow and Approval Gate Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-010 | ADR-0055 | Scheduler and Automation Engine Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-011 | ADR-0056 | Integration Adapter Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-012 | ADR-0057 | Registry to Database Migration Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-013 | ADR-0058 | Audit Log Policy | P2 | Medium | Later | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH07-014 | ADR-0059 | Monitoring and Alert Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH07-015 | ADR-0060 | Local Development and Mock Mode Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH07-016 | ADR-0061 | Growth Lab Core System Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.9 Chapter 08 Database

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH08-001 | ADR-0005 | Core Architecture Principles | P1 | High | Yes | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | P1 | High | Yes | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-003 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-004 | ADR-0052 | Growth Lab Core System Architecture | P1 | High | Yes | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH08-006 | ADR-0062 | Database Architecture | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-007 | ADR-0063 | PostgreSQL Initial Database Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-008 | ADR-0064 | Prisma ORM Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-009 | ADR-0065 | Registry to Database Migration Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-010 | ADR-0066 | Database ID Design Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-011 | ADR-0067 | Database Relation Design Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH08-012 | ADR-0068 | Soft Delete and Archive Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH08-013 | ADR-0069 | Database Migration Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH08-014 | ADR-0070 | Database Backup and Restore Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH08-015 | ADR-0071 | Database Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.10 Chapter 09 API and OAuth

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH09-001 | ADR-0005 | Core Architecture Principles | P1 | High | Yes | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-002 | ADR-0012 | Integration Layer Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-003 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-004 | ADR-0052 | Growth Lab Core System Architecture | P1 | High | Yes | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-006 | ADR-0072 | API and OAuth Architecture | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH09-007 | ADR-0073 | API First Integration Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH09-008 | ADR-0074 | OAuth Scope Management Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH09-009 | ADR-0075 | Token Reference and Secret Boundary Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH09-010 | ADR-0076 | API Adapter Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH09-011 | ADR-0077 | Webhook Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH09-012 | ADR-0078 | Rate Limit and Retry Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH09-013 | ADR-0079 | Mock Mode and Sandbox Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH09-015 | ADR-0081 | API and OAuth Scale Gate Policy | P1 | High | Yes | Unique source candidate in extracted set. |

### 9.11 Chapter 10 Security

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH10-001 | ADR-0005 | Core Architecture Principles | P1 | High | Yes | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-002 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-003 | ADR-0052 | Growth Lab Core System Architecture | P1 | High | Yes | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | P1 | High | Yes | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-005 | ADR-0082 | Security Architecture | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-006 | ADR-0083 | Secret Management Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-007 | ADR-0084 | Token Protection Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-008 | ADR-0085 | Password and 2FA Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-009 | ADR-0086 | TOTP and Recovery Code Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-010 | ADR-0087 | Access Control and Role Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-011 | ADR-0088 | AI Input Secret Protection Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-012 | ADR-0089 | Automation Security Boundary Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-013 | ADR-0090 | Security Incident Response Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-014 | ADR-0091 | Security Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH10-015 | ADR-0092 | Account Lifecycle and Offboarding Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH10-016 | ADR-0093 | Security Exception and Risk Acceptance Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |

### 9.12 Chapter 11 Operations

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH11-001 | ADR-0005 | Core Architecture Principles | P2 | Medium | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-002 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-003 | ADR-0052 | Growth Lab Core System Architecture | P2 | Medium | Later | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-004 | ADR-0054 | Workflow and Approval Gate Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-005 | ADR-0055 | Scheduler and Automation Engine Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-006 | ADR-0058 | Audit Log Policy | P2 | Medium | Later | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-007 | ADR-0090 | Security Incident Response Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-008 | ADR-0091 | Security Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-009 | ADR-0094 | Operations Architecture | P2 | Medium | Later | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-010 | ADR-0095 | Daily Weekly Monthly Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-011 | ADR-0096 | Runbook Management Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-012 | ADR-0097 | Approval Operations Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH11-013 | ADR-0098 | Incident Response Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-014 | ADR-0099 | Backup and Restore Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-015 | ADR-0100 | Secret Rotation Operations Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH11-016 | ADR-0101 | Scheduler and Automation Operations Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH11-017 | ADR-0102 | Documentation and Changelog Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-018 | ADR-0103 | Operations Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH11-019 | ADR-0104 | Provider and Terms Change Operations Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH11-020 | ADR-0105 | Onboarding and Offboarding Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH11-021 | ADR-0106 | Business Continuity Operations Policy | P2 | Medium | Later | Unique source candidate in extracted set. |

### 9.13 Chapter 12 Analytics and KPI

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH12-001 | ADR-0005 | Core Architecture Principles | P2 | Medium | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-002 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-003 | ADR-0052 | Growth Lab Core System Architecture | P2 | Medium | Later | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-004 | ADR-0058 | Audit Log Policy | P2 | Medium | Later | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-005 | ADR-0094 | Operations Architecture | P2 | Medium | Later | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-006 | ADR-0103 | Operations Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-007 | ADR-0107 | Analytics and KPI Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-008 | ADR-0108 | KPI Definition Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-009 | ADR-0109 | Data Source and Freshness Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-010 | ADR-0110 | Missing Data Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-011 | ADR-0111 | Attribution and Tracking Parameter Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-012 | ADR-0112 | Campaign KPI Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-013 | ADR-0113 | AI Output KPI Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-014 | ADR-0114 | ROI Calculation Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-015 | ADR-0115 | Analytics Report and Dashboard Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-016 | ADR-0116 | Analytics and KPI Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH12-017 | ADR-0117 | Primary Secondary Guardrail KPI Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH12-018 | ADR-0118 | Roadmap Metrics Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |

### 9.14 Chapter 13 Roadmap

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH13-001 | ADR-0005 | Core Architecture Principles | P2 | Medium | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-002 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-003 | ADR-0052 | Growth Lab Core System Architecture | P2 | Medium | Later | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-004 | ADR-0054 | Workflow and Approval Gate Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-005 | ADR-0055 | Scheduler and Automation Engine Policy | P1 | High | Yes | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-006 | ADR-0058 | Audit Log Policy | P2 | Medium | Later | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-007 | ADR-0094 | Operations Architecture | P2 | Medium | Later | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-008 | ADR-0103 | Operations Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-009 | ADR-0107 | Analytics and KPI Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-010 | ADR-0116 | Analytics and KPI Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-011 | ADR-0118 | Roadmap Metrics Policy | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-012 | ADR-0119 | Roadmap Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH13-013 | ADR-0120 | Phase and Stage Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH13-014 | ADR-0121 | MVP Scope Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-015 | ADR-0122 | Priority and Dependency Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-016 | ADR-0123 | Database Migration Roadmap Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH13-017 | ADR-0124 | API and OAuth Roadmap Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH13-018 | ADR-0125 | Security Before Automation Roadmap Policy | P1 | High | Yes | Unique source candidate in extracted set. |
| ACI-CH13-019 | ADR-0126 | Scale Stage Expansion Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH13-020 | ADR-0127 | Cost and Investment Decision Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-021 | ADR-0128 | Roadmap Change Management Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH13-022 | ADR-0129 | Roadmap Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH13-023 | ADR-0130 | Roadmap Exception Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |
| ACI-CH13-024 | ADR-0131 | Provider Change Roadmap Policy | Human Owner Decision | Human Owner Decision | Human Owner Decision | Unique source candidate in extracted set. |

### 9.15 Chapter 14 ADR

| Index ID | Source Candidate ID | Candidate Title | Priority | MVP Impact | Formal ADR Required Now | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH14-001 | ADR-0005 | Core Architecture Principles | P3 | Low | Later | Source Candidate ID appears 14 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-002 | ADR-0016 | Scale Gate Policy | P2 | Medium | Later | Source Candidate ID appears 9 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-003 | ADR-0052 | Growth Lab Core System Architecture | P3 | Low | Later | Source Candidate ID appears 8 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-004 | ADR-0058 | Audit Log Policy | P2 | Medium | Later | Source Candidate ID appears 5 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-005 | ADR-0094 | Operations Architecture | P2 | Medium | Later | Source Candidate ID appears 4 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-006 | ADR-0107 | Analytics and KPI Architecture | P2 | Medium | Later | Source Candidate ID appears 3 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-007 | ADR-0119 | Roadmap Architecture | P2 | Medium | Later | Source Candidate ID appears 2 times across chapters; keep as source reference, not final ADR number. |
| ACI-CH14-008 | ADR-0132 | ADR Governance Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-009 | ADR-0133 | ADR Numbering and Status Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-010 | ADR-0134 | ADR Template Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-011 | ADR-0135 | ADR Supersede and Deprecation Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-012 | ADR-0136 | ADR Index Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-013 | ADR-0137 | ADR and Scale Gate Policy | P2 | Medium | Later | Unique source candidate in extracted set. |
| ACI-CH14-014 | ADR-0138 | ADR and Codex Claude Code Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-015 | ADR-0139 | ADR Triage Policy | P3 | Low | Later | Unique source candidate in extracted set. |
| ACI-CH14-016 | ADR-0140 | Decision Log Boundary Policy | P3 | Low | Later | Unique source candidate in extracted set. |

## 10. Duplicate or Overlapping Candidates

| Index IDs | Source Candidate IDs | Overlap Theme | Source Chapters | Suggested Handling | Notes |
| --- | --- | --- | --- | --- | --- |
| ACI-CH00-001, ACI-CH01-001 | ADR-0002 | Markdown as Primary Source Format | 00 Document Governance, 01 Architecture Principles | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH00-002, ACI-CH01-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | 00 Document Governance, 01 Architecture Principles | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH00-003, ACI-CH01-003 | ADR-0004 | Chapter-Based Architecture Review Process | 00 Document Governance, 01 Architecture Principles | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH01-004, ACI-CH02-001, ACI-CH03-001, ACI-CH04-001, ACI-CH05-001, ACI-CH06-001, ACI-CH07-001, ACI-CH08-001, ACI-CH09-001, ACI-CH10-001, ACI-CH11-001, ACI-CH12-001, ACI-CH13-001, ACI-CH14-001 | ADR-0005 | Core Architecture Principles | 01 Architecture Principles, 02 Overall Architecture, 03 Mail Platform, 04 SNS Platform, 05 WordPress Platform, 06 AI Platform, 07 Growth Lab Core System, 08 Database, 09 API and OAuth, 10 Security, 11 Operations, 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 14 chapter references detected. |
| ACI-CH01-007, ACI-CH06-002 | ADR-0008 | AI First Operation Policy | 01 Architecture Principles, 06 AI Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH02-002, ACI-CH07-002 | ADR-0010 | Overall Architecture Structure | 02 Overall Architecture, 07 Growth Lab Core System | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH02-003, ACI-CH03-002, ACI-CH04-002, ACI-CH07-003, ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | 02 Overall Architecture, 03 Mail Platform, 04 SNS Platform, 07 Growth Lab Core System, 08 Database | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 5 chapter references detected. |
| ACI-CH02-004, ACI-CH07-004, ACI-CH09-002 | ADR-0012 | Integration Layer Policy | 02 Overall Architecture, 07 Growth Lab Core System, 09 API and OAuth | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH02-006, ACI-CH05-002 | ADR-0014 | SNS to WordPress Affiliate Flow | 02 Overall Architecture, 05 WordPress Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH02-008, ACI-CH07-005, ACI-CH08-003, ACI-CH09-003, ACI-CH10-002, ACI-CH11-002, ACI-CH12-002, ACI-CH13-002, ACI-CH14-002 | ADR-0016 | Scale Gate Policy | 02 Overall Architecture, 07 Growth Lab Core System, 08 Database, 09 API and OAuth, 10 Security, 11 Operations, 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 9 chapter references detected. |
| ACI-CH03-003, ACI-CH04-003 | ADR-0018 | Mail Platform Architecture | 03 Mail Platform, 04 SNS Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH03-004, ACI-CH04-004 | ADR-0019 | One Mail Address per SNS Account Policy | 03 Mail Platform, 04 SNS Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH04-005, ACI-CH05-003, ACI-CH06-003 | ADR-0025 | SNS Platform Architecture | 04 SNS Platform, 05 WordPress Platform, 06 AI Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH04-012, ACI-CH05-004 | ADR-0032 | SNS to WordPress Traffic Flow Policy | 04 SNS Platform, 05 WordPress Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH05-005, ACI-CH06-004 | ADR-0034 | WordPress Platform Architecture | 05 WordPress Platform, 06 AI Platform | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH06-005, ACI-CH07-006 | ADR-0043 | AI Platform Architecture | 06 AI Platform, 07 Growth Lab Core System | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH07-007, ACI-CH08-004, ACI-CH09-004, ACI-CH10-003, ACI-CH11-003, ACI-CH12-003, ACI-CH13-003, ACI-CH14-003 | ADR-0052 | Growth Lab Core System Architecture | 07 Growth Lab Core System, 08 Database, 09 API and OAuth, 10 Security, 11 Operations, 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 8 chapter references detected. |
| ACI-CH07-009, ACI-CH11-004, ACI-CH13-004 | ADR-0054 | Workflow and Approval Gate Policy | 07 Growth Lab Core System, 11 Operations, 13 Roadmap | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH07-010, ACI-CH11-005, ACI-CH13-005 | ADR-0055 | Scheduler and Automation Engine Policy | 07 Growth Lab Core System, 11 Operations, 13 Roadmap | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH07-011, ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | 07 Growth Lab Core System, 09 API and OAuth | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH07-012, ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | 07 Growth Lab Core System, 08 Database | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH07-013, ACI-CH11-006, ACI-CH12-004, ACI-CH13-006, ACI-CH14-004 | ADR-0058 | Audit Log Policy | 07 Growth Lab Core System, 11 Operations, 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 5 chapter references detected. |
| ACI-CH09-009, ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | 09 API and OAuth, 10 Security | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH10-013, ACI-CH11-007 | ADR-0090 | Security Incident Response Policy | 10 Security, 11 Operations | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH10-014, ACI-CH11-008 | ADR-0091 | Security Scale Gate Policy | 10 Security, 11 Operations | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH11-009, ACI-CH12-005, ACI-CH13-007, ACI-CH14-005 | ADR-0094 | Operations Architecture | 11 Operations, 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 4 chapter references detected. |
| ACI-CH11-018, ACI-CH12-006, ACI-CH13-008 | ADR-0103 | Operations Scale Gate Policy | 11 Operations, 12 Analytics and KPI, 13 Roadmap | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH12-007, ACI-CH13-009, ACI-CH14-006 | ADR-0107 | Analytics and KPI Architecture | 12 Analytics and KPI, 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 3 chapter references detected. |
| ACI-CH12-016, ACI-CH13-010 | ADR-0116 | Analytics and KPI Scale Gate Policy | 12 Analytics and KPI, 13 Roadmap | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH12-018, ACI-CH13-011 | ADR-0118 | Roadmap Metrics Policy | 12 Analytics and KPI, 13 Roadmap | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |
| ACI-CH13-012, ACI-CH14-007 | ADR-0119 | Roadmap Architecture | 13 Roadmap, 14 ADR | Keep Source Candidate ID as-is; consolidate only after Human Owner approves formal ADR drafting. | 2 chapter references detected. |

## 11. Recommended Formal ADR Creation Order

| Order | Index ID | Source Candidate ID | Candidate Title | Reason | Recommended Timing |
| --- | --- | --- | --- | --- | --- |
| 1 | ACI-CH10-001 | ADR-0005 | Core Architecture Principles | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 2 | ACI-CH10-003 | ADR-0052 | Growth Lab Core System Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 3 | ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 4 | ACI-CH10-005 | ADR-0082 | Security Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 5 | ACI-CH10-006 | ADR-0083 | Secret Management Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 6 | ACI-CH10-007 | ADR-0084 | Token Protection Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 7 | ACI-CH10-008 | ADR-0085 | Password and 2FA Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 8 | ACI-CH10-009 | ADR-0086 | TOTP and Recovery Code Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 9 | ACI-CH10-010 | ADR-0087 | Access Control and Role Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 10 | ACI-CH10-011 | ADR-0088 | AI Input Secret Protection Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 11 | ACI-CH10-012 | ADR-0089 | Automation Security Boundary Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 12 | ACI-CH10-015 | ADR-0092 | Account Lifecycle and Offboarding Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 13 | ACI-CH10-016 | ADR-0093 | Security Exception and Risk Acceptance Policy | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. | Human Owner Decision |
| 14 | ACI-CH09-001 | ADR-0005 | Core Architecture Principles | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 15 | ACI-CH09-002 | ADR-0012 | Integration Layer Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 16 | ACI-CH09-004 | ADR-0052 | Growth Lab Core System Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 17 | ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 18 | ACI-CH09-006 | ADR-0072 | API and OAuth Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 19 | ACI-CH09-007 | ADR-0073 | API First Integration Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 20 | ACI-CH09-008 | ADR-0074 | OAuth Scope Management Policy | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. | Human Owner Decision |
| 21 | ACI-CH09-009 | ADR-0075 | Token Reference and Secret Boundary Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 22 | ACI-CH09-010 | ADR-0076 | API Adapter Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 23 | ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 24 | ACI-CH09-015 | ADR-0081 | API and OAuth Scale Gate Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 25 | ACI-CH08-001 | ADR-0005 | Core Architecture Principles | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 26 | ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 27 | ACI-CH08-004 | ADR-0052 | Growth Lab Core System Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 28 | ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 29 | ACI-CH08-006 | ADR-0062 | Database Architecture | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |
| 30 | ACI-CH08-007 | ADR-0063 | PostgreSQL Initial Database Policy | MVP data model, authentication, external integration, approval, publishing, or security behavior can be affected. | Before Phase 1 implementation preparation |

## 12. Non-Blocking Future Candidates

| Index ID | Source Candidate ID | Candidate Title | Reason for Non-Blocking | Recommended Future Timing |
| --- | --- | --- | --- | --- |
| ACI-CH00-001 | ADR-0002 | Markdown as Primary Source Format | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH00-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH00-003 | ADR-0004 | Chapter-Based Architecture Review Process | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-001 | ADR-0002 | Markdown as Primary Source Format | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-002 | ADR-0003 | Document Hierarchy and Conflict Resolution Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-003 | ADR-0004 | Chapter-Based Architecture Review Process | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-004 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-007 | ADR-0008 | AI First Operation Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH01-008 | ADR-0009 | Account Scalability and Optimization Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH02-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH02-002 | ADR-0010 | Overall Architecture Structure | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH02-004 | ADR-0012 | Integration Layer Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH02-005 | ADR-0013 | Growth Lab Core Deployment Phases | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH02-006 | ADR-0014 | SNS to WordPress Affiliate Flow | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH02-007 | ADR-0015 | Observability Architecture Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH02-008 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH02-009 | ADR-0017 | Data Boundary and Security Boundary Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH03-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH03-003 | ADR-0018 | Mail Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH03-006 | ADR-0021 | Independent Domain Mail and Forwarding Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH03-009 | ADR-0024 | Mail Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH04-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH04-003 | ADR-0018 | Mail Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH04-005 | ADR-0025 | SNS Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH04-011 | ADR-0031 | SNS Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH04-012 | ADR-0032 | SNS to WordPress Traffic Flow Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH04-013 | ADR-0033 | SNS Risk Management Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH05-002 | ADR-0014 | SNS to WordPress Affiliate Flow | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-003 | ADR-0025 | SNS Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-004 | ADR-0032 | SNS to WordPress Traffic Flow Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-005 | ADR-0034 | WordPress Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-006 | ADR-0035 | Xserver Initial Hosting Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-011 | ADR-0040 | WordPress SEO and Performance Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH05-012 | ADR-0041 | WordPress Backup and Recovery Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH05-013 | ADR-0042 | WordPress Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH06-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH06-002 | ADR-0008 | AI First Operation Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH06-003 | ADR-0025 | SNS Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH06-004 | ADR-0034 | WordPress Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH06-005 | ADR-0043 | AI Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH06-009 | ADR-0047 | AI Execution Boundary Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH06-012 | ADR-0050 | AI Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH06-013 | ADR-0051 | Codex and Claude Code AI Support Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH07-002 | ADR-0010 | Overall Architecture Structure | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-004 | ADR-0012 | Integration Layer Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-005 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH07-006 | ADR-0043 | AI Platform Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-007 | ADR-0052 | Growth Lab Core System Architecture | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-008 | ADR-0053 | Domain Module Boundary Policy | Candidate should be reviewed, but no immediate MVP blocker was identified. | Early post-v1.0 Draft improvement |
| ACI-CH07-013 | ADR-0058 | Audit Log Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH07-014 | ADR-0059 | Monitoring and Alert Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH07-015 | ADR-0060 | Local Development and Mock Mode Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH07-016 | ADR-0061 | Growth Lab Core System Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH08-003 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH08-012 | ADR-0068 | Soft Delete and Archive Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH08-013 | ADR-0069 | Database Migration Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH08-014 | ADR-0070 | Database Backup and Restore Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH08-015 | ADR-0071 | Database Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH09-003 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH09-011 | ADR-0077 | Webhook Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH09-012 | ADR-0078 | Rate Limit and Retry Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH09-013 | ADR-0079 | Mock Mode and Sandbox Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH10-002 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH10-013 | ADR-0090 | Security Incident Response Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH10-014 | ADR-0091 | Security Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-001 | ADR-0005 | Core Architecture Principles | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-002 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-003 | ADR-0052 | Growth Lab Core System Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-006 | ADR-0058 | Audit Log Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-007 | ADR-0090 | Security Incident Response Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-008 | ADR-0091 | Security Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-009 | ADR-0094 | Operations Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-010 | ADR-0095 | Daily Weekly Monthly Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-011 | ADR-0096 | Runbook Management Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-013 | ADR-0098 | Incident Response Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-014 | ADR-0099 | Backup and Restore Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-017 | ADR-0102 | Documentation and Changelog Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-018 | ADR-0103 | Operations Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-020 | ADR-0105 | Onboarding and Offboarding Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH11-021 | ADR-0106 | Business Continuity Operations Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-001 | ADR-0005 | Core Architecture Principles | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-002 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-003 | ADR-0052 | Growth Lab Core System Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-004 | ADR-0058 | Audit Log Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-005 | ADR-0094 | Operations Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-006 | ADR-0103 | Operations Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-007 | ADR-0107 | Analytics and KPI Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-008 | ADR-0108 | KPI Definition Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-009 | ADR-0109 | Data Source and Freshness Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-010 | ADR-0110 | Missing Data Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-011 | ADR-0111 | Attribution and Tracking Parameter Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-012 | ADR-0112 | Campaign KPI Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-013 | ADR-0113 | AI Output KPI Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-014 | ADR-0114 | ROI Calculation Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-015 | ADR-0115 | Analytics Report and Dashboard Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-016 | ADR-0116 | Analytics and KPI Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-017 | ADR-0117 | Primary Secondary Guardrail KPI Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH12-018 | ADR-0118 | Roadmap Metrics Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-001 | ADR-0005 | Core Architecture Principles | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-002 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-003 | ADR-0052 | Growth Lab Core System Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-006 | ADR-0058 | Audit Log Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-007 | ADR-0094 | Operations Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-008 | ADR-0103 | Operations Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-009 | ADR-0107 | Analytics and KPI Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-010 | ADR-0116 | Analytics and KPI Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-011 | ADR-0118 | Roadmap Metrics Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-012 | ADR-0119 | Roadmap Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-013 | ADR-0120 | Phase and Stage Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-016 | ADR-0123 | Database Migration Roadmap Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-019 | ADR-0126 | Scale Stage Expansion Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-021 | ADR-0128 | Roadmap Change Management Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH13-022 | ADR-0129 | Roadmap Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-001 | ADR-0005 | Core Architecture Principles | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-002 | ADR-0016 | Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-003 | ADR-0052 | Growth Lab Core System Architecture | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-004 | ADR-0058 | Audit Log Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-005 | ADR-0094 | Operations Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-006 | ADR-0107 | Analytics and KPI Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-007 | ADR-0119 | Roadmap Architecture | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-008 | ADR-0132 | ADR Governance Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-009 | ADR-0133 | ADR Numbering and Status Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-010 | ADR-0134 | ADR Template Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-011 | ADR-0135 | ADR Supersede and Deprecation Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-012 | ADR-0136 | ADR Index Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-013 | ADR-0137 | ADR and Scale Gate Policy | Important for operations, observability, analytics, scale, or roadmap quality, but not a direct MVP blocker. | Early post-v1.0 Draft improvement |
| ACI-CH14-014 | ADR-0138 | ADR and Codex Claude Code Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-015 | ADR-0139 | ADR Triage Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |
| ACI-CH14-016 | ADR-0140 | Decision Log Boundary Policy | Useful for maintainability and governance, but not required before MVP implementation. | Post-completion documentation governance improvement |

## 13. Human Owner Decision Required

| Index ID | Source Candidate ID | Candidate Title | Decision Needed | Reason |
| --- | --- | --- | --- | --- |
| ACI-CH03-005 | ADR-0020 | Google Workspace Scope Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH06-010 | ADR-0048 | High-Risk Domain AI Usage Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH06-011 | ADR-0049 | AI Cost and ROI Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH09-008 | ADR-0074 | OAuth Scope Management Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH10-016 | ADR-0093 | Security Exception and Risk Acceptance Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH11-019 | ADR-0104 | Provider and Terms Change Operations Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-014 | ADR-0121 | MVP Scope Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-015 | ADR-0122 | Priority and Dependency Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-020 | ADR-0127 | Cost and Investment Decision Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-023 | ADR-0130 | Roadmap Exception Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |
| ACI-CH13-024 | ADR-0131 | Provider Change Roadmap Policy | Human Owner decision before formal ADR drafting or policy adoption. | Human Owner decision is required because this candidate affects business, risk, cost, provider, or roadmap policy. |

## 14. Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| 00から14章を確認した | Pass | All chapter files were read for ADR candidate sections. |
| Future ADR candidatesを抽出した | Pass | 209 candidates extracted. |
| 正式ADRファイルを新規作成していない | Pass | No file was created under architecture/master/adr. |
| ADR-0001を変更していない | Pass | Read-only. |
| ADR READMEを変更していない | Pass | Read-only. |
| 00から14章を変更していない | Pass | Read-only. |
| READMEを変更していない | Pass | Read-only. |
| Completion Declarationを変更していない | Pass | Read-only. |
| Completion Checklistを変更していない | Pass | Read-only. |
| Candidate IDを正式ADR番号として確定していない | Pass | Source Candidate IDs are source references only. |
| Index IDを正式ADR番号として扱っていない | Pass | ACI IDs are candidate index IDs only. |
| Secret実体を含めていない | Pass | No secret-like values were intentionally included. |
| 文字化けがない | Pass | Validated after generation. |
| 置換文字がない | Pass | Validated after generation. |
| コードブロック数が偶数 | Pass | Validated after generation. |

## 15. Next Actions

- Human Owner review of ADR Candidate Index
- Select P1 candidates for formal ADR drafting
- Create first formal ADR drafts only after Human Owner approval
- Create Glossary and terminology rule proposal
- Create Markdown / ADR / Scale Gate validation script
- Continue Phase 1 implementation preparation
