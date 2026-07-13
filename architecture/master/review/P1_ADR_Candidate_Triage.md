# P1 ADR Candidate Triage

Document Name: Growth Lab Core P1 ADR Candidate Triage
Target: P1 candidates from ADR_Candidate_Index.md
Status: Draft
Primary Format: Markdown
Target File: architecture/master/review/P1_ADR_Candidate_Triage.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本文書は、ADR_Candidate_Index.mdでP1に分類されたADR候補をMVP実装準備向けにトリアージするための文書である。

本文書は正式ADRではない。本文書は、正式ADR化の優先順位を決めるための判断材料である。

本文書は、MVP作成を進めるSNS運用チーム開発部門チャットの実装準備に使用する。

## 2. Scope
- ADR_Candidate_Index.mdのP1候補
- MVP Impact High / Medium候補
- Formal ADR Required Now Yes候補
- Human Owner Decision候補
- Duplicate / Overlap候補

## 3. Important Notes
- This triage document is not a formal ADR.
- This triage document does not create, accept, reject, or supersede any ADR.
- Index IDs are not ADR numbers.
- Source Candidate IDs are not final ADR numbers unless formal ADR files exist.
- Human Owner approval is required before creating or accepting any formal ADR.
- Codex can support classification and recommendation, but cannot approve ADRs.
- This document must not contain Secret material.

## 4. Source Summary

| Item | Count | Notes |
| --- | --- | --- |
| Total ADR candidates | 209 | From ADR_Candidate_Index.md |
| P1 candidates | 67 | Triage target; matches expected 67. |
| P2 candidates | 106 | Reference only |
| P3 candidates | 25 | Reference only |
| Human Owner Decision candidates | 11 | Review required |
| MVP-Relevant candidates | 78 | Includes P1 and other priorities |
| Formal ADR Required Now Yes | 67 | Must be triaged before formal ADR creation |

## 5. Triage Classification Rules

| Triage Class | Meaning | Formal ADR Timing | Notes |
| --- | --- | --- | --- |
| MVP Critical ADR | MVP着手前に正式ADR化が必要 | Before MVP implementation | 原則10テーマ以内に絞る |
| MVP Required Decision | MVP中またはPhase 1準備中に判断 | During MVP or Phase 1 preparation | Decision Logまたは後続ADR候補 |
| MVP Deferred | MVP後でよい | After MVP | Future Improvement |
| Human Owner Decision | Owner判断が必要 | Before formal ADR drafting | 事業、運用、コスト、リスク判断 |
| Duplicate / Consolidate | 他候補と統合 | Consolidate before drafting | ADR作成数を減らす |

## 6. Triage Summary

| Triage Class | Count | Notes |
| --- | --- | --- |
| MVP Critical ADR | 9 | Representative candidates for 9 consolidated critical ADR themes. |
| MVP Required Decision | 0 | Decision can occur during MVP or Phase 1 preparation. |
| MVP Deferred | 0 | Not a direct MVP blocker. |
| Human Owner Decision | 1 | Owner decision required before formal ADR drafting. |
| Duplicate / Consolidate | 57 | Fold into consolidated ADR themes. |
| Total P1 reviewed | 67 | Must match actual P1 target count; matches ADR_Candidate_Index.md. |

## 7. MVP Critical ADR Candidates

| Rank | Index ID | Source Candidate ID | Candidate Title | Category | Source Chapter | Reason | Recommended ADR Theme |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ACI-CH01-005, ACI-CH04-008, ACI-CH09-001, ACI-CH09-006, ACI-CH09-007, ACI-CH09-010, ACI-CH09-014, ACI-CH09-015 | ADR-0005, ADR-0006, ADR-0028, ADR-0072, ADR-0073, ADR-0076, ADR-0080, ADR-0081 | API First Integration Policy | API and OAuth, Architecture Principles, SNS Platform | 01 Architecture Principles, 04 SNS Platform, 09 API and OAuth | Representative candidate for a consolidated MVP-critical ADR theme. | OAuth Scope and Official API Integration Boundary |
| 2 | ACI-CH01-006, ACI-CH03-008, ACI-CH09-009, ACI-CH10-001, ACI-CH10-004, ACI-CH10-005, ACI-CH10-006, ACI-CH10-007, ACI-CH10-008, ACI-CH10-009, ACI-CH10-010, ACI-CH10-011, ACI-CH10-012 | ADR-0005, ADR-0007, ADR-0023, ADR-0075, ADR-0082, ADR-0083, ADR-0084, ADR-0085, ADR-0086, ADR-0087, ADR-0088, ADR-0089 | Security by Design and Secret Management Policy | API and OAuth, Architecture Principles, Mail Platform, Security | 01 Architecture Principles, 03 Mail Platform, 09 API and OAuth, 10 Security | Representative candidate for a consolidated MVP-critical ADR theme. | Security, Secret, Token, and Access Control Boundary |
| 3 | ACI-CH02-003, ACI-CH03-002, ACI-CH03-004, ACI-CH04-002, ACI-CH04-004, ACI-CH04-007, ACI-CH07-003, ACI-CH08-002, ACI-CH10-015 | ADR-0011, ADR-0019, ADR-0027, ADR-0092 | Identity-Centric Architecture | Core System, Database, Mail Platform, Overall Architecture, SNS Platform, Security | 02 Overall Architecture, 03 Mail Platform, 04 SNS Platform, 07 Growth Lab Core System, 08 Database, 10 Security | Representative candidate for a consolidated MVP-critical ADR theme. | Identity, Mail, SNS Account, and Account Lifecycle Boundary |
| 4 | ACI-CH03-007, ACI-CH04-006, ACI-CH05-007, ACI-CH05-008, ACI-CH05-009, ACI-CH06-007, ACI-CH07-012, ACI-CH08-001, ACI-CH08-005, ACI-CH08-006, ACI-CH08-007, ACI-CH08-008, ACI-CH08-009, ACI-CH08-010, ACI-CH08-011 | ADR-0005, ADR-0022, ADR-0026, ADR-0036, ADR-0037, ADR-0038, ADR-0045, ADR-0057, ADR-0062, ADR-0063, ADR-0064, ADR-0065, ADR-0066, ADR-0067 | Mail Account Registry Policy | AI Platform, Core System, Database, Mail Platform, SNS Platform, WordPress Platform | 03 Mail Platform, 04 SNS Platform, 05 WordPress Platform, 06 AI Platform, 07 Growth Lab Core System, 08 Database | Representative candidate for a consolidated MVP-critical ADR theme. | Database, Registry, ID, and Relation Design Boundary |
| 5 | ACI-CH04-009, ACI-CH04-010, ACI-CH05-010 | ADR-0029, ADR-0030, ADR-0039 | SNS Publishing Boundary Policy | SNS Platform, WordPress Platform | 04 SNS Platform, 05 WordPress Platform | Representative candidate for a consolidated MVP-critical ADR theme. | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary |
| 6 | ACI-CH06-006, ACI-CH06-008 | ADR-0044, ADR-0046 | Prompt Management Policy | AI Platform | 06 AI Platform | Representative candidate for a consolidated MVP-critical ADR theme. | AI Output, Prompt, Human Review, and High-Risk AI Boundary |
| 7 | ACI-CH07-009, ACI-CH07-010, ACI-CH11-004, ACI-CH11-005, ACI-CH11-012, ACI-CH11-016, ACI-CH13-004, ACI-CH13-005 | ADR-0054, ADR-0055, ADR-0097, ADR-0101 | Workflow and Approval Gate Policy | Core System, Operations, Roadmap | 07 Growth Lab Core System, 11 Operations, 13 Roadmap | Representative candidate for a consolidated MVP-critical ADR theme. | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary |
| 8 | ACI-CH07-011, ACI-CH08-004, ACI-CH09-002, ACI-CH09-004, ACI-CH09-005, ACI-CH10-003 | ADR-0012, ADR-0052, ADR-0056 | Integration Adapter Policy | API and OAuth, Core System, Database, Security | 07 Growth Lab Core System, 08 Database, 09 API and OAuth, 10 Security | Representative candidate for a consolidated MVP-critical ADR theme. | Integration Adapter and Core System Module Boundary |
| 9 | ACI-CH11-015, ACI-CH13-017, ACI-CH13-018 | ADR-0100, ADR-0124, ADR-0125 | Secret Rotation Operations Policy | Operations, Roadmap | 11 Operations, 13 Roadmap | Representative candidate for a consolidated MVP-critical ADR theme. | MVP Implementation Architecture Boundary |

## 8. MVP Required Decision Candidates

No MVP Required Decision candidates after consolidation.

## 9. MVP Deferred Candidates

No MVP Deferred P1 candidates.

## 10. Human Owner Decision Candidates

| Index ID | Source Candidate ID | Candidate Title | Category | Decision Needed | Reason | Suggested Question for Owner |
| --- | --- | --- | --- | --- | --- | --- |
| ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | API and OAuth | Approve risk, cost, operation, or external execution boundary before formal ADR drafting. | Human Owner should decide risk, approval, or external execution tolerance before formal ADR drafting. | Should External API Approval Gate Policy be decided before MVP implementation or deferred? |

## 11. Duplicate or Consolidation Groups

| Group ID | Recommended ADR Theme | Index IDs | Source Candidate IDs | Source Chapters | Suggested Handling | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ACG-001 | OAuth Scope and Official API Integration Boundary | ACI-CH01-005, ACI-CH04-008, ACI-CH09-001, ACI-CH09-006, ACI-CH09-007, ACI-CH09-010, ACI-CH09-014, ACI-CH09-015 | ADR-0005, ADR-0006, ADR-0028, ADR-0072, ADR-0073, ADR-0076, ADR-0080, ADR-0081 | 01 Architecture Principles, 04 SNS Platform, 09 API and OAuth | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-002 | Security, Secret, Token, and Access Control Boundary | ACI-CH01-006, ACI-CH03-008, ACI-CH09-009, ACI-CH10-001, ACI-CH10-004, ACI-CH10-005, ACI-CH10-006, ACI-CH10-007, ACI-CH10-008, ACI-CH10-009, ACI-CH10-010, ACI-CH10-011, ACI-CH10-012 | ADR-0005, ADR-0007, ADR-0023, ADR-0075, ADR-0082, ADR-0083, ADR-0084, ADR-0085, ADR-0086, ADR-0087, ADR-0088, ADR-0089 | 01 Architecture Principles, 03 Mail Platform, 09 API and OAuth, 10 Security | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-003 | Identity, Mail, SNS Account, and Account Lifecycle Boundary | ACI-CH02-003, ACI-CH03-002, ACI-CH03-004, ACI-CH04-002, ACI-CH04-004, ACI-CH04-007, ACI-CH07-003, ACI-CH08-002, ACI-CH10-015 | ADR-0011, ADR-0019, ADR-0027, ADR-0092 | 02 Overall Architecture, 03 Mail Platform, 04 SNS Platform, 07 Growth Lab Core System, 08 Database, 10 Security | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-004 | Database, Registry, ID, and Relation Design Boundary | ACI-CH03-007, ACI-CH04-006, ACI-CH05-007, ACI-CH05-008, ACI-CH05-009, ACI-CH06-007, ACI-CH07-012, ACI-CH08-001, ACI-CH08-005, ACI-CH08-006, ACI-CH08-007, ACI-CH08-008, ACI-CH08-009, ACI-CH08-010, ACI-CH08-011 | ADR-0005, ADR-0022, ADR-0026, ADR-0036, ADR-0037, ADR-0038, ADR-0045, ADR-0057, ADR-0062, ADR-0063, ADR-0064, ADR-0065, ADR-0066, ADR-0067 | 03 Mail Platform, 04 SNS Platform, 05 WordPress Platform, 06 AI Platform, 07 Growth Lab Core System, 08 Database | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-005 | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary | ACI-CH04-009, ACI-CH04-010, ACI-CH05-010 | ADR-0029, ADR-0030, ADR-0039 | 04 SNS Platform, 05 WordPress Platform | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-006 | AI Output, Prompt, Human Review, and High-Risk AI Boundary | ACI-CH06-006, ACI-CH06-008 | ADR-0044, ADR-0046 | 06 AI Platform | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-007 | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | ACI-CH07-009, ACI-CH07-010, ACI-CH11-004, ACI-CH11-005, ACI-CH11-012, ACI-CH11-016, ACI-CH13-004, ACI-CH13-005 | ADR-0054, ADR-0055, ADR-0097, ADR-0101 | 07 Growth Lab Core System, 11 Operations, 13 Roadmap | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-008 | Integration Adapter and Core System Module Boundary | ACI-CH07-011, ACI-CH08-004, ACI-CH09-002, ACI-CH09-004, ACI-CH09-005, ACI-CH10-003 | ADR-0012, ADR-0052, ADR-0056 | 07 Growth Lab Core System, 08 Database, 09 API and OAuth, 10 Security | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |
| ACG-009 | MVP Implementation Architecture Boundary | ACI-CH11-015, ACI-CH13-017, ACI-CH13-018 | ADR-0100, ADR-0124, ADR-0125 | 11 Operations, 13 Roadmap | Create one formal ADR theme after Human Owner approval; do not draft one ADR per candidate. | Consolidates related P1 candidates into a smaller MVP decision set. |

## 12. Recommended First ADR Draft Wave

| Draft Order | Recommended ADR Theme | Related Index IDs | Why First | Required Human Owner Decision | Suggested ADR Draft Title |
| --- | --- | --- | --- | --- | --- |
| 1 | OAuth Scope and Official API Integration Boundary | ACI-CH01-005, ACI-CH04-008, ACI-CH09-001, ACI-CH09-006, ACI-CH09-007, ACI-CH09-010, ACI-CH09-014, ACI-CH09-015 | High MVP impact and likely implementation rework if left undecided. | Yes | OAuth Scope and Official API Integration Boundary ADR Draft |
| 2 | Security, Secret, Token, and Access Control Boundary | ACI-CH01-006, ACI-CH03-008, ACI-CH09-009, ACI-CH10-001, ACI-CH10-004, ACI-CH10-005, ACI-CH10-006, ACI-CH10-007, ACI-CH10-008, ACI-CH10-009, ACI-CH10-010, ACI-CH10-011, ACI-CH10-012 | High MVP impact and likely implementation rework if left undecided. | Review recommended | Security, Secret, Token, and Access Control Boundary ADR Draft |
| 3 | Identity, Mail, SNS Account, and Account Lifecycle Boundary | ACI-CH02-003, ACI-CH03-002, ACI-CH03-004, ACI-CH04-002, ACI-CH04-004, ACI-CH04-007, ACI-CH07-003, ACI-CH08-002, ACI-CH10-015 | High MVP impact and likely implementation rework if left undecided. | Review recommended | Identity, Mail, SNS Account, and Account Lifecycle Boundary ADR Draft |
| 4 | Database, Registry, ID, and Relation Design Boundary | ACI-CH03-007, ACI-CH04-006, ACI-CH05-007, ACI-CH05-008, ACI-CH05-009, ACI-CH06-007, ACI-CH07-012, ACI-CH08-001, ACI-CH08-005, ACI-CH08-006, ACI-CH08-007, ACI-CH08-008, ACI-CH08-009, ACI-CH08-010, ACI-CH08-011 | High MVP impact and likely implementation rework if left undecided. | Review recommended | Database, Registry, ID, and Relation Design Boundary ADR Draft |
| 5 | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary | ACI-CH04-009, ACI-CH04-010, ACI-CH05-010 | High MVP impact and likely implementation rework if left undecided. | Review recommended | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary ADR Draft |
| 6 | AI Output, Prompt, Human Review, and High-Risk AI Boundary | ACI-CH06-006, ACI-CH06-008 | High MVP impact and likely implementation rework if left undecided. | Review recommended | AI Output, Prompt, Human Review, and High-Risk AI Boundary ADR Draft |
| 7 | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | ACI-CH07-009, ACI-CH07-010, ACI-CH11-004, ACI-CH11-005, ACI-CH11-012, ACI-CH11-016, ACI-CH13-004, ACI-CH13-005 | High MVP impact and likely implementation rework if left undecided. | Review recommended | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary ADR Draft |
| 8 | Integration Adapter and Core System Module Boundary | ACI-CH07-011, ACI-CH08-004, ACI-CH09-002, ACI-CH09-004, ACI-CH09-005, ACI-CH10-003 | High MVP impact and likely implementation rework if left undecided. | Review recommended | Integration Adapter and Core System Module Boundary ADR Draft |
| 9 | MVP Implementation Architecture Boundary | ACI-CH11-015, ACI-CH13-017, ACI-CH13-018 | High MVP impact and likely implementation rework if left undecided. | Review recommended | MVP Implementation Architecture Boundary ADR Draft |

## 13. P1 Candidate Full Triage Table

| Index ID | Source Candidate ID | Candidate Title | Category | MVP Impact | Formal ADR Required Now | Triage Class | Recommended ADR Theme | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ACI-CH01-005 | ADR-0006 | API First Integration Policy | Architecture Principles | High | Yes | MVP Critical ADR | OAuth Scope and Official API Integration Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH01-006 | ADR-0007 | Security by Design and Secret Management Policy | Architecture Principles | High | Yes | MVP Critical ADR | Security, Secret, Token, and Access Control Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH02-003 | ADR-0011 | Identity-Centric Architecture | Overall Architecture | High | Yes | MVP Critical ADR | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH03-002 | ADR-0011 | Identity-Centric Architecture | Mail Platform | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH03-004 | ADR-0019 | One Mail Address per SNS Account Policy | Mail Platform | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH03-007 | ADR-0022 | Mail Account Registry Policy | Mail Platform | High | Yes | MVP Critical ADR | Database, Registry, ID, and Relation Design Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH03-008 | ADR-0023 | Mail Recovery and TOTP Relationship Policy | Mail Platform | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-002 | ADR-0011 | Identity-Centric Architecture | SNS Platform | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-004 | ADR-0019 | One Mail Address per SNS Account Policy | SNS Platform | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-006 | ADR-0026 | SNS Account Registry Policy | SNS Platform | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-007 | ADR-0027 | SNS Account Lifecycle Policy | SNS Platform | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-008 | ADR-0028 | SNS API and OAuth Policy | SNS Platform | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH04-009 | ADR-0029 | SNS Publishing Boundary Policy | SNS Platform | High | Yes | MVP Critical ADR | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH04-010 | ADR-0030 | SNS Automation Boundary Policy | SNS Platform | High | Yes | Duplicate / Consolidate | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH05-007 | ADR-0036 | WordPress Site Registry Policy | WordPress Platform | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH05-008 | ADR-0037 | Article Registry Policy | WordPress Platform | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH05-009 | ADR-0038 | Affiliate Link Registry Policy | WordPress Platform | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH05-010 | ADR-0039 | WordPress REST API Policy | WordPress Platform | High | Yes | Duplicate / Consolidate | SNS Publishing, WordPress Affiliate Flow, and Platform Execution Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH06-006 | ADR-0044 | Prompt Management Policy | AI Platform | High | Yes | MVP Critical ADR | AI Output, Prompt, Human Review, and High-Risk AI Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH06-007 | ADR-0045 | AI Output Registry Policy | AI Platform | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH06-008 | ADR-0046 | Human Review and Approval Gate Policy | AI Platform | High | Yes | Duplicate / Consolidate | AI Output, Prompt, Human Review, and High-Risk AI Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH07-003 | ADR-0011 | Identity-Centric Architecture | Core System | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH07-009 | ADR-0054 | Workflow and Approval Gate Policy | Core System | High | Yes | MVP Critical ADR | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH07-010 | ADR-0055 | Scheduler and Automation Engine Policy | Core System | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH07-011 | ADR-0056 | Integration Adapter Policy | Core System | High | Yes | MVP Critical ADR | Integration Adapter and Core System Module Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH07-012 | ADR-0057 | Registry to Database Migration Policy | Core System | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-001 | ADR-0005 | Core Architecture Principles | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-002 | ADR-0011 | Identity-Centric Architecture | Database | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-004 | ADR-0052 | Growth Lab Core System Architecture | Database | High | Yes | Duplicate / Consolidate | Integration Adapter and Core System Module Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-005 | ADR-0057 | Registry to Database Migration Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-006 | ADR-0062 | Database Architecture | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-007 | ADR-0063 | PostgreSQL Initial Database Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-008 | ADR-0064 | Prisma ORM Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-009 | ADR-0065 | Registry to Database Migration Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-010 | ADR-0066 | Database ID Design Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH08-011 | ADR-0067 | Database Relation Design Policy | Database | High | Yes | Duplicate / Consolidate | Database, Registry, ID, and Relation Design Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-001 | ADR-0005 | Core Architecture Principles | API and OAuth | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-002 | ADR-0012 | Integration Layer Policy | API and OAuth | High | Yes | Duplicate / Consolidate | Integration Adapter and Core System Module Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-004 | ADR-0052 | Growth Lab Core System Architecture | API and OAuth | High | Yes | Duplicate / Consolidate | Integration Adapter and Core System Module Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-005 | ADR-0056 | Integration Adapter Policy | API and OAuth | High | Yes | Duplicate / Consolidate | Integration Adapter and Core System Module Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-006 | ADR-0072 | API and OAuth Architecture | API and OAuth | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-007 | ADR-0073 | API First Integration Policy | API and OAuth | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-009 | ADR-0075 | Token Reference and Secret Boundary Policy | API and OAuth | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-010 | ADR-0076 | API Adapter Policy | API and OAuth | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH09-014 | ADR-0080 | External API Approval Gate Policy | API and OAuth | High | Yes | Human Owner Decision | OAuth Scope and Official API Integration Boundary | Human Owner should decide risk, approval, or external execution tolerance before formal ADR drafting. |
| ACI-CH09-015 | ADR-0081 | API and OAuth Scale Gate Policy | API and OAuth | High | Yes | Duplicate / Consolidate | OAuth Scope and Official API Integration Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-001 | ADR-0005 | Core Architecture Principles | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-003 | ADR-0052 | Growth Lab Core System Architecture | Security | High | Yes | Duplicate / Consolidate | Integration Adapter and Core System Module Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-004 | ADR-0075 | Token Reference and Secret Boundary Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-005 | ADR-0082 | Security Architecture | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-006 | ADR-0083 | Secret Management Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-007 | ADR-0084 | Token Protection Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-008 | ADR-0085 | Password and 2FA Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-009 | ADR-0086 | TOTP and Recovery Code Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-010 | ADR-0087 | Access Control and Role Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-011 | ADR-0088 | AI Input Secret Protection Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-012 | ADR-0089 | Automation Security Boundary Policy | Security | High | Yes | Duplicate / Consolidate | Security, Secret, Token, and Access Control Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH10-015 | ADR-0092 | Account Lifecycle and Offboarding Policy | Security | High | Yes | Duplicate / Consolidate | Identity, Mail, SNS Account, and Account Lifecycle Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH11-004 | ADR-0054 | Workflow and Approval Gate Policy | Operations | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH11-005 | ADR-0055 | Scheduler and Automation Engine Policy | Operations | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH11-012 | ADR-0097 | Approval Operations Policy | Operations | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH11-015 | ADR-0100 | Secret Rotation Operations Policy | Operations | High | Yes | MVP Critical ADR | MVP Implementation Architecture Boundary | Representative candidate for a consolidated MVP-critical ADR theme. |
| ACI-CH11-016 | ADR-0101 | Scheduler and Automation Operations Policy | Operations | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH13-004 | ADR-0054 | Workflow and Approval Gate Policy | Roadmap | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH13-005 | ADR-0055 | Scheduler and Automation Engine Policy | Roadmap | High | Yes | Duplicate / Consolidate | Workflow, Approval Gate, Scheduler, and Automation Engine Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH13-017 | ADR-0124 | API and OAuth Roadmap Policy | Roadmap | High | Yes | Duplicate / Consolidate | MVP Implementation Architecture Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |
| ACI-CH13-018 | ADR-0125 | Security Before Automation Roadmap Policy | Roadmap | High | Yes | Duplicate / Consolidate | MVP Implementation Architecture Boundary | Consolidate into the recommended ADR theme instead of creating a separate ADR. |

## 14. Risks and Notes
- P1候補をすべて正式ADR化するとMVP前作業が過大になる。
- MVP Critical ADRは判断を絞り込むための分類であり、正式承認ではない。
- Human Owner承認なしにADR作成、Accepted化、設計決定を行わない。
- Git上の既存差分がある場合、今回作業との差分を混同しない。
- 今回の分類はDraftであり、Human Ownerレビュー後に確定する。

## 15. Validation Results

| Check | Result | Notes |
| --- | --- | --- |
| ADR_Candidate_Index.mdを確認した | Pass | Source file was read. |
| P1候補を抽出した | Pass | 67 P1 candidates extracted. |
| P1候補をすべてトリアージした | Pass | 67 P1 candidates triaged. |
| P1実件数とTriage Summary合計が一致している | Pass | 67 equals 67. |
| MVP Critical ADRを原則10テーマ以内に絞った | Pass | 9 themes. |
| Duplicate / Consolidate候補を確認した | Pass | 9 consolidation groups created. |
| Recommended First ADR Draft Waveを作成した | Pass | 9 draft wave themes. |
| 正式ADRファイルを新規作成していない | Pass | No file was created under architecture/master/adr. |
| ADR-0001を変更していない | Pass | Read-only. |
| ADR READMEを変更していない | Pass | Read-only. |
| 00から14章を変更していない | Pass | Read-only. |
| READMEを変更していない | Pass | Read-only. |
| ADR_Candidate_Index.mdを変更していない | Pass | Read-only. |
| Completion Declarationを変更していない | Pass | Read-only. |
| Completion Checklistを変更していない | Pass | Read-only. |
| Index IDを正式ADR番号として扱っていない | Pass | Index IDs remain triage references only. |
| Secret実体を含めていない | Pass | Validated after generation. |
| 文字化けがない | Pass | Validated after generation. |
| 置換文字がない | Pass | Validated after generation. |
| コードブロック数が偶数 | Pass | Validated after generation. |
| 作業前後のgit diffを確認した | Pass | Pre-work diff/status recorded; post-work diff/status validated after generation. |

## 16. Next Actions
- Human Owner review of P1 ADR Candidate Triage
- Decide MVP Critical ADR themes for first formal ADR draft wave
- Create formal ADR drafts only after Human Owner approval
- Continue Phase 1 implementation preparation
- Create Glossary and terminology rule proposal
- Create Markdown / ADR / Scale Gate validation script
