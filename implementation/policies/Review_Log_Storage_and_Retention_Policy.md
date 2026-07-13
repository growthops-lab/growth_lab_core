# Review Log Storage and Retention Policy

Document Name: Growth Lab Core Review Log Storage and Retention Policy
Related ADR: ADR-0003 / ADR-0005 / ADR-0006 / ADR-0008
Related Template: templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
Related Data Model: implementation/data_models/Approval_Gate_Data_Model.md
Related Checklist: implementation/checklists/Platform_Specific_Terms_Confirmation_Checklist.md
Related Specification: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Status: Draft
Primary Format: Markdown
Target File: implementation/policies/Review_Log_Storage_and_Retention_Policy.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- 本ポリシーは、Review Log、Evidence Reference、Approval Gate関連データの保存と保持に関する方針を定義する。
- 本ポリシーは、ADR-0003、ADR-0005、ADR-0006、ADR-0008に基づく。
- 本ポリシーは、MVPでのHuman Review、Approval Gate、Evidence管理の運用基準として使用する。
- 本ポリシーは、物理DB実装、クラウドサービス選定、法務判断を確定しない。

## 2. Scope

対象:

- Review Log
- Approval Gate記録
- Evidence Reference
- Human Review記録
- Decision Reason
- Blocked Reason
- Deferred Items
- Published / Archived状態
- Access Controlの基本方針
- Retentionの基本方針
- Backup / Recoveryの基本方針

対象外:

- 物理DB実装
- SQLマイグレーション
- API設計
- UI設計
- 外部ストレージサービスの最終選定
- 法務判断
- 個人情報保護法などの法的最終判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

- This policy does not implement a physical storage system.
- This policy does not finalize legal, privacy, SNS, ASP, or affiliate terms interpretation.
- This policy defines MVP storage, retention, access control, and audit principles.
- Secret values, tokens, API keys, passwords, and recovery codes must not be stored in Review Logs.
- Evidence should be stored as references, not as exposed secret or credential values.

日本語での重要事項:

- 本ポリシーは、物理ストレージを実装しない。
- 本ポリシーは、法務、個人情報、SNS規約、ASP規約、アフィリエイト規約の最終判断を行わない。
- 本ポリシーは、MVPにおける保存、保持、アクセス制御、監査の基本方針を定義する。
- Review LogにはSecret、Token、API Key、Password、Recovery Codeなどの実体値を保存しない。
- Evidenceは、実体値ではなく参照IDまたは安全な保管先識別子として記録する。

## 4. Relationship to ADRs and Related Documents

- ADR-0003は、Secret、Token、Access Controlの境界を定義する。
- ADR-0005は、Database、Registry、ID、Relation設計の境界を定義する。
- ADR-0006は、SNS、WordPress、ASP、アフィリエイト連携に関する実行境界を定義する。
- ADR-0008は、Workflow、Approval Gate、Scheduler、Automation Engineの境界を定義する。
- Review Log Templateは、記録すべき項目を定義する。
- Approval Gate Data Modelは、承認ゲートの論理データモデルを定義する。
- Platform-specific Terms Confirmation Checklistは、媒体別の確認項目を定義する。
- 本ポリシーは、これらの記録をどのように保存、保持、参照、保護するかを定義する。

## 5. Data Categories

| Data Category | Description | Sensitivity | Storage Handling | Retention Handling | Notes |
|---|---|---|---|---|---|
| Review Log | 投稿前確認、判断理由、確認状態の記録。 | Medium | 構造化データとして保存する。 | Suggested MVP retention: MVP期間中およびPhase 1移行後も保持。 | 後続仕様で保持年数を確定する。 |
| Approval Gate Record | Draft、Review Required、Approved、Blocked、Deferred、Published、Archivedの状態記録。 | Medium | 状態変更を追跡可能に保存する。 | 関連コンテンツが有効な間は保持。 | ApprovedなしPublishedを防止するため保持する。 |
| Evidence Reference | 証跡IDまたは安全な保管先識別子。 | Medium to High | 実体ではなく参照IDとして保存する。 | 関連Review Logが保持される間は保持。 | Secret実体は含めない。 |
| Human Review Result | Reviewer、reviewed_at、review_statusなどの確認結果。 | Medium | Review Logと関連付けて保存する。 | Review Logと同じ期間を推奨。 | 個人名ではなくroleや内部識別子を推奨。 |
| Decision Reason | Approved、Blocked、Deferredの判断理由。 | Medium | 追跡可能なテキストとして保存する。 | 関連Approval Gate Recordと同じ期間を推奨。 | 法務判断の確定文として扱わない。 |
| Blocked Reason | Blockedの理由。 | Medium | Approval Gate Recordに関連付ける。 | Blocked Recordと同じ期間を推奨。 | 再レビュー時の根拠にする。 |
| Deferred Items | 後続仕様または公式情報確認へ委譲する項目。 | Medium | follow_up_ownerと関連付ける。 | Deferred Recordと同じ期間を推奨。 | 未解決のままApprovedにしない。 |
| Published Record | Published状態とpublished_atの記録。 | Medium | Approval Gate Recordとして保存する。 | 関連コンテンツが有効な間は保持。 | Publishedには事前Approvedが必要。 |
| Archived Record | 参照頻度が下がった記録の保管状態。 | Medium | 削除ではなく参照可能な状態で保存する。 | アーカイブ後も参照可能な状態で保持。 | 再レビュー時は理由を記録する。 |
| Audit Log | 重要な状態変更、判断変更、証跡参照変更の記録。 | High | 改ざん防止を意識して保存する。 | 変更追跡が必要な期間は保持。 | 物理方式は後続仕様で定義する。 |
| Secret or Credential Value | Secret、Token、API Key、Password、Recovery Code、TOTP Secretなど。 | Prohibited | Review Log保存禁止。 | 保持しない。混入時は即時隔離と除去。 | 安全なSecret Storeまたは保管先を使用する。 |
| Personal Data | 個人を識別しうる情報。 | High | 最小化し、必要な場合のみ扱う。 | 後続の法務、運用、情報管理仕様で確定。 | Human Owner判断へ回す。 |

## 6. Storage Principles

- Review Logは、MVPで追跡可能な構造化データとして保存する。
- Evidenceは、Review Log本文に実体を貼り付けず、evidence_referenceとして記録する。
- Secret、Token、API Key、PasswordはReview Logに保存しない。
- 個人情報は必要最小限にする。
- 投稿内容、判断理由、承認状態、証跡参照は後から追跡できるようにする。
- 直接編集による履歴消失を避ける。
- 重要な状態変更はAudit Logとして記録する。
- MVPでは物理ストレージの最終選定を行わず、論理保存方針として定義する。

## 7. Retention Policy

保持期間は法的最終判断ではなく、MVPの推奨値またはポリシー上の仮置きである。具体的な年数、法定保存期間、削除義務は本ポリシーでは確定しない。必要な場合は後続の法務、運用、情報管理仕様で確定する。

| Record Type | Suggested MVP Retention | Archive Timing | Deletion Timing | Owner | Notes |
|---|---|---|---|---|---|
| Review Log | MVP期間中およびPhase 1移行後も保持。 | 対象コンテンツの運用終了後にArchivedを検討。 | 原則削除せず、無効化またはArchivedを優先。 | Human Owner / Operator | To be finalized by later legal, operational, or information management specifications. |
| Approval Gate Record | 関連コンテンツが有効な間は保持。 | Published後または運用終了後にArchivedを検討。 | 削除は例外扱い。 | Human Owner | Approved、Blocked、Deferredの判断根拠を保持する。 |
| Evidence Reference | 関連Review Logが保持される間は保持。 | Evidence原本の扱いに合わせてArchivedを検討。 | Secret混入時は参照を無効化または除去。 | Human Owner / Operator | Evidence実体の保持は後続仕様で定義する。 |
| Audit Log | 変更追跡が必要な期間は保持。 | 運用上参照頻度が下がった時点でArchivedを検討。 | 原則削除しない。 | Auditor / Human Owner | 改ざん防止方式は後続仕様で定義する。 |
| Published Record | 関連コンテンツが有効な間は保持。 | 公開終了または再レビュー後にArchivedを検討。 | 削除は例外扱い。 | Operator / Human Owner | published_atと事前Approved記録を保持する。 |
| Archived Record | アーカイブ後も参照可能な状態で保持。 | Archived移行時。 | 後続仕様で削除条件を確定。 | Human Owner | Archivedは削除ではない。 |
| Blocked Record | Blocked理由が解消されるまで保持し、解消後も履歴として保持。 | 再レビュー完了後にArchivedを検討。 | 原則削除せず無効化を優先。 | Reviewer / Human Owner | blocked_reasonを保持する。 |
| Deferred Record | deferred_itemsが解消されるまで保持し、解消後も履歴として保持。 | 後続確認完了後にArchivedを検討。 | 原則削除せず無効化を優先。 | Reviewer / Human Owner | official-source confirmation待ちを追跡する。 |

## 8. Access Control Policy

| Role | Read Access | Write Access | Approve Access | Delete or Invalidate Access | Notes |
|---|---|---|---|---|---|
| Human Owner | Full logical read access | Full logical write access | Yes | Yes, with required reason | Human Ownerのみ最終承認できる。 |
| Reviewer | Review対象範囲のみ | Review Log作成、確認結果更新 | No, unless delegated by Human Owner | No | 最終承認権限はHuman Ownerに従う。 |
| Operator | 運用上必要な範囲 | 状態更新、Archive補助 | No | Invalidate request only | 運用上必要な範囲で閲覧、更新できる。 |
| Developer | 原則最小限 | 原則なし、または検証用ダミーデータのみ | No | No | 本番実データの閲覧を最小化する。 |
| Auditor | 監査対象範囲を読み取り | No | No | No | 監査目的で読み取り中心とする。 |
| System | 自動処理結果の読み取り | 自動処理結果の記録 | No | No | Human Owner承認を代替しない。 |

## 9. Evidence Reference Policy

- evidence_referenceは証跡実体ではなく、参照IDまたは安全な保管先識別子である。
- EvidenceにSecret、Token、API Key、Passwordを含めない。
- Evidenceが外部リンクの場合、アクセス権限と公開範囲を確認する。
- Evidenceがスクリーンショットやファイルの場合、個人情報や認証情報が含まれていないか確認する。
- Evidenceの原本保管先、保持期間、削除ルールは後続の運用仕様で詳細化する。

| Evidence Type | Allowed in Review Log | Required Handling | Notes |
|---|---|---|---|
| Evidence ID | Yes | 参照IDとして記録する。 | 例: dummy-evidence-reference。 |
| Internal reference path | Yes | 内部保管先識別子として記録する。 | 実在する秘密URLや認証情報を含めない。 |
| External URL reference | Conditional | 公開範囲とアクセス権限を確認する。 | 私的アクセスURLや認証付きURLの実体値は避ける。 |
| Screenshot reference | Yes | ファイル参照IDとして記録する。 | 画像内の個人情報や認証情報を確認する。 |
| File reference | Yes | ファイルIDまたは管理番号として記録する。 | 原本保管先は後続仕様で定義する。 |
| Secret value | No | Review Logへ保存しない。 | 混入時は即時隔離と除去。 |
| Token value | No | Review Logへ保存しない。 | 安全な保管先を使用する。 |
| API key value | No | Review Logへ保存しない。 | 参照IDのみ許可。 |
| Password value | No | Review Logへ保存しない。 | 実体値の記録は禁止。 |

## 10. Audit Log Policy

- Approval Gate Status変更はAudit Log対象とする。
- Approved、Blocked、Deferred、Published、Archivedへの変更は記録対象とする。
- decision_reason、blocked_reason、deferred_itemsの変更は記録対象とする。
- Human Owner承認の有無は記録対象とする。
- Audit Logは改ざん防止を意識した保存方針とする。

| Event | Audit Required | Required Fields | Notes |
|---|---|---|---|
| Draft created | Yes | approval_gate_id, content_id, created_at | 初回作成を記録する。 |
| Review Required set | Yes | approval_gate_id, review_id, changed_at | Review Requiredを経由したことを確認する。 |
| Approved set | Yes | approval_gate_id, reviewer, reviewed_at, decision_reason | Human Owner承認または承認方針を記録する。 |
| Blocked set | Yes | approval_gate_id, blocked_reason, changed_at | blocked_reason必須。 |
| Deferred set | Yes | approval_gate_id, deferred_items, follow_up_owner | deferred_items必須。 |
| Published set | Yes | approval_gate_id, published_at, prior Approved reference | ApprovedなしPublishedを防止する。 |
| Archived set | Yes | approval_gate_id, archive_reference, changed_at | Archivedは削除ではない。 |
| decision_reason changed | Yes | old reference, new reference, change_reason | 上書きではなく変更履歴を残す。 |
| evidence_reference changed | Yes | old reference, new reference, change_reason | Evidence実体は記録しない。 |
| human_owner_decision changed | Yes | decision status, decision_reason, changed_at | SystemはHuman Owner承認を代替しない。 |

## 11. Update, Correction, Deletion, and Invalidation Policy

- Review Logの誤記修正は可能だが、修正理由を残す。
- 承認済み記録の上書きは避け、訂正履歴を残す。
- 削除よりもInvalidatedまたはArchivedによる無効化を優先する。
- Secret混入が発覚した場合は、即時隔離、削除、再発防止記録を行う。
- 個人情報混入が発覚した場合は、Human Owner判断に回す。

| Action | Allowed | Required Record | Notes |
|---|---|---|---|
| Update | Yes | updated_at, updated_by role, update_reason | 通常更新は履歴を残す。 |
| Correction | Yes | correction_reason, corrected_fields, corrected_at | 誤記修正時に使用する。 |
| Deletion | Conditional | deletion_reason, Human Owner decision | デフォルト操作にしない。 |
| Invalidation | Yes | invalidation_reason, invalidated_at | 削除より優先する。 |
| Archive | Yes | archive_reference, archived_at | Archivedは削除ではない。 |
| Secret removal | Yes, immediate | incident note, removed_fields, prevention_action | Secret混入時は即時隔離と除去。 |
| Personal data review | Conditional | review_reason, Human Owner decision | 個人情報混入時はHuman Owner判断へ回す。 |

## 12. Archive Policy

- Published後、運用上参照頻度が下がった記録はArchivedへ移行できる。
- Archivedは削除ではない。
- Archived後も監査、確認、再レビューのために参照可能とする。
- ArchivedからReview Requiredへ戻す場合は理由を記録する。

## 13. Backup and Recovery Policy

- MVPでは、Review LogおよびApproval Gate関連データのバックアップ方針を定義する。
- バックアップ対象にはReview Log、Approval Gate Record、Evidence Reference、Audit Logを含める。
- Secret実体はバックアップ対象に含めない。
- 復旧時は、Approval Gate状態とReview Logの整合を確認する。
- バックアップ頻度、保存先、保持期間の詳細は後続の運用仕様で確定する。

## 14. Security and Secret Handling Policy

- Review LogにSecret実体を保存しない。
- Review LogにToken実体を保存しない。
- Review LogにAPI Key実体を保存しない。
- Review LogにPassword実体を保存しない。
- Review LogにRecovery Code実体を保存しない。
- Review LogにTOTP Secret実体を保存しない。
- Evidence Referenceにも認証情報の実体を含めない。
- 認証情報が必要な場合は、Secret Storeまたは安全な保管先を使用する。

## 15. MVP Storage Handling

MVPで実施する:

- Review Log項目の構造化
- Evidence Referenceの記録
- Approval Gate状態の記録
- Human Review結果の記録
- 最小限のアクセス制御方針
- 削除より無効化、アーカイブを優先する方針

MVPで実施しない:

- 物理DBの最終設計
- SQLマイグレーション
- クラウドストレージの最終選定
- 法務判断
- 個人情報保護に関する最終判断
- SNS、ASP、アフィリエイト規約の最終判断

## 16. Items Deferred to Later Specifications

- 物理DBスキーマ
- SQLマイグレーション
- Review Log保存先の最終選定
- Evidence実体の保存先
- バックアップ頻度
- 保持年数
- 削除手続きの詳細
- 法務確認
- 個人情報保護に関する確認
- アクセス権限の実装方式
- 監査ログの改ざん防止方式

## 17. Items Not Decided by This Policy

- 物理DB実装
- SQL
- APIエンドポイント
- UI設計
- クラウドサービス選定
- 法的保存期間
- 個人情報保護法上の最終判断
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論
- 投稿自動化可否の媒体別最終判断

## 18. Validation Results

| Check | Result | Notes |
|---|---|---|
| Review Log Templateを参照した | Pass | Related Templateに記載。 |
| Approval Gate Data Modelを参照した | Pass | Related Data Modelに記載。 |
| Platform-specific Terms Confirmation Checklistを参照した | Pass | Related Checklistに記載。 |
| ADR-0003を参照した | Pass | Related ADRに記載。 |
| ADR-0005を参照した | Pass | Related ADRに記載。 |
| ADR-0006を参照した | Pass | Related ADRに記載。 |
| ADR-0008を参照した | Pass | Related ADRに記載。 |
| Data Categoriesを定義した | Pass | Section 5に定義。 |
| Storage Principlesを定義した | Pass | Section 6に定義。 |
| Retention Policyを定義した | Pass | Section 7に定義。 |
| Access Control Policyを定義した | Pass | Section 8に定義。 |
| Evidence Reference Policyを定義した | Pass | Section 9に定義。 |
| Audit Log Policyを定義した | Pass | Section 10に定義。 |
| Update, Correction, Deletion, and Invalidation Policyを定義した | Pass | Section 11に定義。 |
| Archive Policyを定義した | Pass | Section 12に定義。 |
| Backup and Recovery Policyを定義した | Pass | Section 13に定義。 |
| Security and Secret Handling Policyを定義した | Pass | Section 14に定義。 |
| 物理DB実装をしていない | Pass | 論理ポリシーに限定。 |
| SQLを作成していない | Pass | SQL文なし。 |
| 法務判断をしていない | Pass | 後続仕様へ委譲。 |
| SNS規約詳細を断定していない | Pass | 詳細判断は後続仕様または公式情報確認へ委譲。 |
| ASP規約詳細を断定していない | Pass | 詳細結論は確定しない。 |
| アフィリエイト規約詳細を断定していない | Pass | 詳細結論は確定しない。 |
| Secret実体を含めていない | Pass | 参照IDのみを扱う。 |
| 文字化けがない | Pass | UTF-8 Markdownで作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 作成後に検証する。 |
| 作業前後のgit diffを確認した | Pass | 作業前後で確認する。 |

## 19. Next Actions

- Human Owner review of Review Log Storage and Retention Policy
- Approval Gate API design
- Review Log storage implementation planning
- Access control implementation planning
- Evidence storage specification
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
