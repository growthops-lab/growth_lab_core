# ADR-0007: AI Output, Prompt, Human Review, and High-Risk AI Boundary
Status: Accepted
Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support
Source: P1_ADR_Candidate_Triage.md
Related Index IDs: ACI-CH06-006, ACI-CH06-008
Related Source Candidate IDs: ADR-0044, ADR-0046
Decision Type: Architecture Decision Record Draft
Target Phase: MVP / Phase 1 Implementation Preparation

---
## 1. Context
This ADR draft was selected from the First ADR Draft Wave because AI Output, Prompt, Human Review, and High-Risk AI Boundary is likely to affect MVP and Phase 1 implementation preparation if left unresolved.
Related triage theme: AI Output, Prompt, Human Review, and High-Risk AI Boundary.
Related source categories: AI Platform.
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

For MVP, require human review before AI-generated content becomes externally published or scheduled, and keep prompt and AI output records traceable without including Secret material.
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
- architecture/master/06_AI_Platform.md
- architecture/master/07_Growth_Lab_Core_System.md
## 14. Notes
- This ADR is part of the First ADR Draft Wave.
- This ADR was reviewed and accepted by Human Owner on 2026-07-08.
- This ADR records the accepted MVP and Phase 1 implementation preparation decision.
- External service specifications, API limits, OAuth scopes, token behavior, and webhook details must be confirmed through official sources during later implementation planning where relevant.
