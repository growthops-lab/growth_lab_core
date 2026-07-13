# ADR-0004: Identity, Mail, SNS Account, and Account Lifecycle Boundary
Status: Accepted
Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support
Source: P1_ADR_Candidate_Triage.md
Related Index IDs: ACI-CH02-003, ACI-CH03-002, ACI-CH03-004, ACI-CH04-002, ACI-CH04-004, ACI-CH04-007, ACI-CH07-003, ACI-CH08-002, ACI-CH10-015
Related Source Candidate IDs: ADR-0011, ADR-0019, ADR-0027, ADR-0092
Decision Type: Architecture Decision Record Draft
Target Phase: MVP / Phase 1 Implementation Preparation

---
## 1. Context
This ADR draft was selected from the First ADR Draft Wave because Identity, Mail, SNS Account, and Account Lifecycle Boundary is likely to affect MVP and Phase 1 implementation preparation if left unresolved.
Related triage theme: Identity, Mail, SNS Account, and Account Lifecycle Boundary.
Related source categories: Core System, Database, Mail Platform, Overall Architecture, SNS Platform, Security.
Related Index IDs are references from the candidate index and do not reserve ADR numbers.
## 2. Problem
If this boundary remains undefined before MVP work starts, implementation choices may drift across modules, approval flows, data records, and provider integrations. Later correction could require rework in database relations, API adapters, operational workflows, or review gates.
## 3. Decision
This ADR is Accepted by Human Owner on 2026-07-08.
This ADR records the accepted architecture decision for MVP and Phase 1 implementation preparation.

本ADRは、2026-07-08にHuman OwnerによりAcceptedとして承認された。
本ADRは、MVPおよびPhase 1実装準備における採用方針を記録する。

## 4. Options Considered
- Option A: Minimal MVP approach. Implement only the smallest local rule set and defer most boundary decisions.
- Option B: Balanced controlled implementation. Define the MVP boundary now, keep provider-specific details in later implementation specifications, and preserve auditability.
- Option C: Full-scale implementation. Define broad production-scale behavior before MVP work begins.
## 5. Accepted Decision
This ADR is Accepted by Human Owner on 2026-07-08.

For MVP, maintain explicit relationships between identity, mail account, SNS account, and account lifecycle records, and avoid shared ambiguous ownership across accounts.
## 6. Rationale
- Supports MVP implementation without forcing full-scale architecture prematurely.
- Reduces rework by clarifying the boundary before code and schema work begin.
- Keeps security, approval, and audit concerns visible from the start.
- Aligns with Master Architecture responsibility boundaries and the P1 triage result.
- Leaves provider-specific details to later official documentation checks and implementation specifications.
## 7. Consequences
### Positive Consequences
- MVP implementation can proceed with clearer boundaries.
- Human Owner can review one consolidated theme instead of many duplicate candidates.
- Future ADR drafting remains traceable to P1 triage and candidate index records.
### Negative Consequences
- Some implementation details remain open until later specifications.
- Human Owner review is still required before this ADR can be accepted.
- The team must avoid treating this draft as a final decision.
### Neutral Consequences
- Related candidates remain trace references, not final ADR numbers.
- Additional ADRs may still be required after MVP scope becomes clearer.
## 8. Security and Secret Handling
- Secret実体はADRに記載しない。
- Token実体はADRに記載しない。
- Password実体はADRに記載しない。
- API Key実体はADRに記載しない。
- Recovery Code実体はADRに記載しない。
- 認証情報はSecret Storeまたは安全な保管先で扱う前提とする。
- Logs, Markdown, review documents, and ADR drafts must not include credential material.
## 9. Operations Impact
- Operational procedures may need checklist updates after Human Owner review.
- Approval flows and audit logs should reflect the final accepted policy.
- Backup, recovery, error handling, and stop conditions should be checked during implementation planning.
## 10. MVP Impact
- The MVP should implement the minimum boundary needed to avoid major rework.
- The MVP should not implement unapproved production-scale behavior.
- Phase 1 can expand after this draft is reviewed and, if appropriate, accepted through a separate approval task.
## 11. Human Owner Review Points
- この方針でMVPを開始してよいか。
- 運用負荷は許容できるか。
- セキュリティリスクは許容できるか。
- コスト増加を許容できるか。
- SNS運用チームの実務に合っているか。
- このADRテーマをFirst ADR Draft Waveの対象として維持するか。
## 12. Acceptance Conditions
- Human Ownerが内容を確認している。
- Security観点の問題がない。
- MVP実装範囲と矛盾しない。
- 00から14章のMaster Architectureと矛盾しない。
- Secret実体が含まれていない。
- 必要に応じて、公式情報確認または実装仕様への委譲事項が明記されている。
## 13. Related Documents
- architecture/master/review/P1_ADR_Candidate_Triage.md
- architecture/master/review/ADR_Candidate_Index.md
- architecture/master/14_ADR.md
- architecture/master/03_Mail_Platform.md
- architecture/master/04_SNS_Platform.md
- architecture/master/10_Security.md
## 14. Notes
- This ADR is part of the First ADR Draft Wave.
- This ADR was reviewed and accepted by Human Owner on 2026-07-08.
- This ADR records the accepted MVP and Phase 1 implementation preparation decision.
- External service specifications, API limits, OAuth scopes, token behavior, and webhook details must be confirmed through official sources during later implementation planning where relevant.
