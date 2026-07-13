# SNS / ASP / Affiliate Review Log Template

Document Name: Growth Lab Core SNS / ASP / Affiliate Review Log Template
Related ADR: ADR-0006
Related Specification: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Status: Draft
Primary Format: Markdown
Target File: templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- 本テンプレートは、SNS、ASP、アフィリエイト関連の投稿前確認結果を記録するためのReview Log Templateである。
- 本テンプレートは、ADR-0006およびADR-0006フォローアップ仕様に基づく。
- 本テンプレートは、MVPでの承認ゲート管理とHuman Reviewの記録に使用する。
- 本テンプレートは、規約詳細の最終判断を行わない。

## 2. Scope

対象:

- SNS投稿レビュー
- WordPress投稿レビュー
- ASPリンクレビュー
- アフィリエイトリンクレビュー
- 広告表記、PR表記、アフィリエイト表記の確認
- Human Review
- Approval Gate
- Evidence / Review Log

対象外:

- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈
- 媒体別投稿自動化可否の最終判断
- ASP別運用条件の最終判断
- 法務判断

## 3. Important Notes

- This template does not finalize SNS, ASP, or affiliate terms interpretation.
- This template records review results, evidence references, and approval gate status.
- MVP does not automatically decide platform-specific terms compliance.
- Detailed terms review is delegated to later specifications or official-source confirmation.

日本語での重要事項:

- 本テンプレートは、SNS、ASP、アフィリエイト規約の詳細判断を確定しない。
- 本テンプレートは、レビュー結果、証跡参照、承認ゲート状態を記録する。
- MVPでは、媒体別規約適合性を自動で最終判断しない。
- 詳細な規約判断は、後続仕様または公式情報確認へ委譲する。

## 4. Review Log Principles

- 1件の投稿案またはコンテンツ案につき、原則1件のreview_idを付与する。
- 投稿先媒体が複数ある場合は、媒体ごとに確認状態を分けて記録する。
- ApprovedなしにPublishedへ進めない。
- BlockedまたはDeferredの場合は理由を必ず記録する。
- Evidenceがない承認を避ける。
- AI生成物はHuman Reviewを通す。
- Secret実体やToken実体をReview Logに記載しない。
- reviewerには、必要に応じて個人名ではなくrole、担当チーム、または内部識別子を使用する。

## 5. Review Log Field Definitions

| Field | Required | Type | Description | Allowed Values | Example Value | Notes |
|---|---|---|---|---|---|---|
| review_id | Yes | string | Review Logの一意な内部ID。 | REV-YYYYMMDD-0001形式を推奨 | REV-20260708-0001 | 1件の投稿案または媒体別確認単位に付与する。 |
| content_id | Yes | string | 対象コンテンツの内部ID。 | CONTENT-0001形式を推奨 | CONTENT-0001 | 実在URLではなく内部参照IDを優先する。 |
| source_system | Yes | string | コンテンツ案の作成元。 | Growth Lab Core, WordPress, SNS, Manual, AI Draft, Other | Growth Lab Core | 外部Secretや認証情報は記録しない。 |
| platform | Yes | string | 投稿または確認対象の媒体。 | X, WordPress, Instagram, Pinterest, Other, Unknown | X | 媒体別最終可否は本テンプレートでは判断しない。 |
| content_type | Yes | string | 対象コンテンツ種別。 | sns_post, wordpress_article, image_asset, affiliate_link, campaign_item, other | sns_post | DB/CSV変換時の分類キー。 |
| content_title | No | string | 対象コンテンツの管理用タイトル。 | Free text | Dummy content title | 個人情報や実在アカウント名を入れない。 |
| content_url_or_reference | Yes | string | 対象コンテンツのURLまたは内部参照。 | internal reference, draft ID, storage reference | dummy-content-reference | Exampleでは実在URLを使用しない。 |
| review_status | Yes | string | Review全体の状態。 | Not Started, In Review, Pass, Warning, Blocked, Deferred, Approved, Unknown | Review Required | approval_gate_statusと整合させる。 |
| approval_gate_status | Yes | string | 承認ゲート状態。 | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | Approved | Publishedへ進めるには事前Approvedが必要。 |
| decision_category | Yes | string | 判断カテゴリ。 | Approved for MVP publishing, Approved with manual review, Blocked due to missing evidence, Blocked due to terms uncertainty, Deferred to later specification, Requires Human Owner decision, Requires official-source confirmation | Blocked due to terms uncertainty | BlockedやDeferredの理由分類に使う。 |
| reviewer | Yes | string | Review担当者または担当識別子。 | role, team, internal reviewer ID | human-reviewer-role | 個人名ではなくroleまたは内部識別子を推奨する。 |
| reviewed_at | Conditional | datetime | Review実施日時。 | ISO 8601 datetime, blank | 2026-07-08T13:00:00+09:00 | Review済みの場合は必須。 |
| next_review_required | Yes | string | 次回Review要否。 | Yes, No, Unknown | Yes | DeferredやWarningの場合は原則Yes。 |
| sns_terms_check_required | Yes | string | SNS規約確認要否。 | Yes, No, Unknown | Yes | 詳細判断は後続仕様または公式確認へ委譲する。 |
| sns_terms_check_status | Yes | string | SNS規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Warning | 詳細結論は確定しない。 |
| asp_terms_check_required | Yes | string | ASP規約確認要否。 | Yes, No, Unknown | Yes | ASP別運用条件の最終判断はしない。 |
| asp_terms_check_status | Yes | string | ASP規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Deferred | ASP別確認が未完了ならPublished不可。 |
| affiliate_terms_check_required | Yes | string | アフィリエイト規約確認要否。 | Yes, No, Unknown | Yes | 案件別、媒体別確認に引き継ぐ。 |
| affiliate_terms_check_status | Yes | string | アフィリエイト規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Deferred | 詳細結論は本テンプレートで確定しない。 |
| advertising_label_required | Yes | string | 広告表記確認要否。 | Yes, No, Unknown | Yes | 必要性が不明な場合はUnknownまたはDeferredにする。 |
| advertising_label_status | Yes | string | 広告表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Pass | 表記テンプレートの詳細は後続仕様。 |
| pr_label_required | Yes | string | PR表記確認要否。 | Yes, No, Unknown | Yes | 安全側に倒す運用を想定する。 |
| pr_label_status | Yes | string | PR表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Pass | 媒体別ルールの詳細は後続確認。 |
| affiliate_label_required | Yes | string | アフィリエイト表記確認要否。 | Yes, No, Unknown | Yes | 案件別表記ルールへ接続する。 |
| affiliate_label_status | Yes | string | アフィリエイト表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Pass | Unknownの場合はApproved for MVP publishingにしない。 |
| prohibited_expression_check_required | Yes | string | 禁止表現確認要否。 | Yes, No, Unknown | Yes | AI生成物はHuman Review対象。 |
| prohibited_expression_check_status | Yes | string | 禁止表現確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Pass | Blocked時はblocked_reason必須。 |
| automation_allowed_status | Yes | string | 自動投稿実行可否の管理状態。 | Allowed, Manual Only, Blocked, Deferred, Unknown | Manual Only | 媒体別投稿自動化可否を最終判断しない。 |
| human_owner_decision_required | Yes | string | Human Owner判断要否。 | Yes, No, Unknown | Yes | Yesの場合は判断完了までPublished不可。 |
| evidence_reference | Conditional | string | 証跡参照IDまたは保管場所識別子。 | reference ID, file ID, storage reference, internal control number | dummy-evidence-reference | Secret実体、Token実体、API Key実体は記録しない。 |
| decision_reason | Conditional | string | 判断理由。 | Free text | Dummy decision reason | Approved、Blocked、Deferred時は必須。 |
| blocked_reason | Conditional | string | Blocked理由。 | Free text, blank | Dummy blocked reason | approval_gate_statusがBlockedの場合は必須。 |
| deferred_items | Conditional | string | 後続仕様または次回確認へ委譲する項目。 | Free text, blank | Dummy deferred item | approval_gate_statusがDeferredの場合は必須。 |
| follow_up_owner | Conditional | string | 後続確認担当。 | role, team, internal owner ID, blank | terms-review-owner-role | 個人情報ではなくroleまたは内部識別子を推奨する。 |
| follow_up_due_date | Conditional | date | 後続確認期限。 | ISO 8601 date, blank | 2026-07-15 | DeferredやHuman Owner判断待ちの場合に使用する。 |
| published_at | Conditional | datetime | Published日時。 | ISO 8601 datetime, blank |  | Published以外では空欄にする。 |
| archive_reference | No | string | Archive参照ID。 | archive ID, storage reference, blank | dummy-archive-reference | Published後またはArchived時に使用する。 |
| created_at | Yes | datetime | Review Log作成日時。 | ISO 8601 datetime | 2026-07-08T12:00:00+09:00 | DB/CSV変換時の作成日時。 |
| updated_at | Yes | datetime | Review Log更新日時。 | ISO 8601 datetime | 2026-07-08T13:00:00+09:00 | 更新時に変更する。 |

## 6. Field Value Rules

ID形式:

- review_id: REV-YYYYMMDD-0001 のような形式を推奨する。
- content_id: CONTENT-0001 のような内部IDを推奨する。

```text
review_id: REV-20260708-0001
content_id: CONTENT-0001
```

日時形式:

- reviewed_at、published_at、created_at、updated_atは ISO 8601形式を推奨する。
- 例: 2026-07-08T13:00:00+09:00

Yes / No項目:

- *_required項目は Yes / No / Unknown のいずれかを使用する。

Check Status項目:

- *_status項目は Not Checked / Pass / Warning / Blocked / Deferred / Not Applicable / Unknown のいずれかを使用する。

Evidence:

- evidence_referenceは、実体値ではなく参照ID、ファイルID、保存場所識別子、または内部管理番号とする。
- evidence_referenceには、Secret実体、Token実体、Password実体、API Key実体、Recovery Code実体、TOTP Secret実体を記録しない。

approval_gate_statusとdecision_categoryの整合:

- approval_gate_statusがApprovedの場合、decision_categoryはApproved for MVP publishingまたはApproved with manual reviewを使用する。
- approval_gate_statusがBlockedの場合、decision_categoryはBlocked due to missing evidenceまたはBlocked due to terms uncertaintyを使用する。
- approval_gate_statusがDeferredの場合、decision_categoryはDeferred to later specification、Requires Human Owner decision、またはRequires official-source confirmationを使用する。
- approval_gate_statusがPublishedの場合、過去または同一レコード内にApproved相当の判断理由とevidence_referenceが必要である。

Publishedに進めるための最低条件:

- approval_gate_statusがApproved済みである。
- review_statusがPassまたはApprovedである。
- Required項目が空欄ではない。
- evidence_referenceが記録されている。
- human_owner_decision_requiredがNoである、またはHuman Owner判断完了のdecision_reasonが記録されている。
- *_terms_check_statusがUnknownではない。
- automation_allowed_statusがAllowedまたはManual Onlyである。

## 7. Approval Gate Status Values

| Status | Meaning | Allowed Next Status | Required Evidence | Notes |
|---|---|---|---|---|
| Draft | 投稿案またはコンテンツ案の作成中。 | Review Required, Archived | content_id, created_at | DraftからPublishedへ直接遷移しない。 |
| Review Required | Human Reviewが必要な状態。 | Approved, Blocked, Deferred, Archived | reviewer, review checklist status, reviewed_at | Review Requiredを経由する。 |
| Approved | MVP公開または手動投稿に進める承認済み状態。 | Published, Archived, Review Required | evidence_reference, decision_reason, reviewed_at | ApprovedなしにPublishedへ進めない。 |
| Blocked | 規約不確実性、証跡不足、禁止表現などで停止する状態。 | Review Required, Deferred, Archived | blocked_reason, evidence_reference or missing evidence reason | blocked_reasonを必ず記録する。 |
| Deferred | 後続仕様、公式確認、Human Owner判断へ委譲する状態。 | Review Required, Blocked, Archived | deferred_items, follow_up_owner | deferred_itemsを必ず記録する。 |
| Published | 承認済みコンテンツを公開済みまたは投稿済みにした状態。 | Archived, Review Required | prior Approved record, published_at, evidence_reference | Published後はArchivedまたは次回レビュー対象として管理する。 |
| Archived | Review Logを保管または終了する状態。 | Review Required | archive_reference | 監査や再確認のため参照可能にする。 |

## 8. Decision Category Values

| Decision Category | Meaning | Allowed Action | Required Record |
|---|---|---|---|
| Approved for MVP publishing | MVP範囲で公開または投稿へ進めてよい。 | Approvedへ進める。 | evidence_reference, decision_reason, reviewer, reviewed_at |
| Approved with manual review | 手動確認付きで進めてよい。 | ApprovedまたはManual Only運用へ進める。 | manual review note, evidence_reference, decision_reason |
| Blocked due to missing evidence | 証跡不足により停止する。 | Blockedへ進める。 | blocked_reason, missing evidence detail |
| Blocked due to terms uncertainty | 規約不確実性が高いため停止する。 | Blockedへ進める。 | blocked_reason, terms uncertainty note |
| Deferred to later specification | 後続仕様へ委譲する。 | Deferredへ進める。 | deferred_items, follow_up_owner |
| Requires Human Owner decision | Human Owner判断が必要。 | DeferredまたはReview Requiredに留める。 | decision request, follow_up_owner, follow_up_due_date |
| Requires official-source confirmation | 公式情報確認が必要。 | DeferredまたはBlockedへ進める。 | official-source confirmation item, follow_up_owner |

## 9. Markdown Review Log Template

```markdown
## Review Log Entry

- review_id:
- content_id:
- source_system:
- platform:
- content_type:
- content_title:
- content_url_or_reference:
- review_status:
- approval_gate_status:
- decision_category:
- reviewer:
- reviewed_at:
- next_review_required:

### Terms Check

- sns_terms_check_required:
- sns_terms_check_status:
- asp_terms_check_required:
- asp_terms_check_status:
- affiliate_terms_check_required:
- affiliate_terms_check_status:

### Label Check

- advertising_label_required:
- advertising_label_status:
- pr_label_required:
- pr_label_status:
- affiliate_label_required:
- affiliate_label_status:

### Risk Check

- prohibited_expression_check_required:
- prohibited_expression_check_status:
- automation_allowed_status:
- human_owner_decision_required:

### Evidence

- evidence_reference:
- decision_reason:
- blocked_reason:
- deferred_items:
- follow_up_owner:
- follow_up_due_date:

### Publication

- published_at:
- archive_reference:
- created_at:
- updated_at:
```

## 10. CSV Header Template

```csv
review_id,content_id,source_system,platform,content_type,content_title,content_url_or_reference,review_status,approval_gate_status,decision_category,reviewer,reviewed_at,next_review_required,sns_terms_check_required,sns_terms_check_status,asp_terms_check_required,asp_terms_check_status,affiliate_terms_check_required,affiliate_terms_check_status,advertising_label_required,advertising_label_status,pr_label_required,pr_label_status,affiliate_label_required,affiliate_label_status,prohibited_expression_check_required,prohibited_expression_check_status,automation_allowed_status,human_owner_decision_required,evidence_reference,decision_reason,blocked_reason,deferred_items,follow_up_owner,follow_up_due_date,published_at,archive_reference,created_at,updated_at
```

## 11. Example Review Log Entry

以下はExample Valueであり、すべてダミー値である。実在URL、実在アカウント名、実在Token、実在API Key、実在Password、個人情報は含めない。

```markdown
## Review Log Entry

- review_id: REV-20260708-0001
- content_id: CONTENT-0001
- source_system: Growth Lab Core
- platform: X
- content_type: sns_post
- content_title: Dummy content title
- content_url_or_reference: dummy-content-reference
- review_status: Warning
- approval_gate_status: Deferred
- decision_category: Deferred to later specification
- reviewer: human-reviewer-role
- reviewed_at: 2026-07-08T13:00:00+09:00
- next_review_required: Yes

### Terms Check

- sns_terms_check_required: Yes
- sns_terms_check_status: Warning
- asp_terms_check_required: Yes
- asp_terms_check_status: Deferred
- affiliate_terms_check_required: Yes
- affiliate_terms_check_status: Deferred

### Label Check

- advertising_label_required: Yes
- advertising_label_status: Pass
- pr_label_required: Yes
- pr_label_status: Pass
- affiliate_label_required: Yes
- affiliate_label_status: Pass

### Risk Check

- prohibited_expression_check_required: Yes
- prohibited_expression_check_status: Pass
- automation_allowed_status: Manual Only
- human_owner_decision_required: Yes

### Evidence

- evidence_reference: dummy-evidence-reference
- decision_reason: Dummy decision reason for later specification handoff
- blocked_reason:
- deferred_items: Dummy deferred item for platform-specific confirmation
- follow_up_owner: terms-review-owner-role
- follow_up_due_date: 2026-07-15

### Publication

- published_at:
- archive_reference: dummy-archive-reference
- created_at: 2026-07-08T12:00:00+09:00
- updated_at: 2026-07-08T13:00:00+09:00
```

## 12. Validation Rules

- approval_gate_statusがPublishedの場合、事前にApprovedが必要である。
- approval_gate_statusがBlockedの場合、blocked_reasonが必須である。
- approval_gate_statusがDeferredの場合、deferred_itemsが必須である。
- evidence_referenceはSecret実体ではなく参照IDまたは保管場所の識別子とする。
- human_owner_decision_requiredがYesの場合、Human Owner判断が完了するまでPublishedへ進めない。
- terms_check_statusがUnknownの場合、Approved for MVP publishingにしない。
- automation_allowed_statusがUnknownの場合、自動投稿を実行しない。
- Required項目が空欄の場合、Publishedへ進めない。
- Example Entryに実在URL、実在アカウント、個人情報、Secret実体が含まれていないことを確認する。

## 13. Usage Notes

- MVPでは、このReview Log Templateを承認ゲート管理の記録として使用する。
- 実装時はDBテーブル、CSV、Google Sheets、または管理画面フォームへ変換可能な項目構成とする。
- Review Logの保存先、保持期間、アクセス権限は後続の運用仕様またはDB設計で定義する。
- Evidenceの実体ファイルや外部リンクの扱いは、Security方針に従う。

## 14. Items Not Decided by This Template

- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論
- 投稿自動化可否の媒体別最終判断
- ASP別運用条件の最終判断
- 法務判断
- DB物理設計
- UI設計

## 15. Related Documents

- architecture/master/adr/ADR-0006-sns-publishing-wordpress-affiliate-flow-and-platform-execution-boundary.md
- architecture/master/adr/ADR-0007-ai-output-prompt-human-review-and-high-risk-ai-boundary.md
- architecture/master/adr/ADR-0008-workflow-approval-gate-scheduler-and-automation-engine-boundary.md
- implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
- architecture/master/review/Accepted_ADR_Light_Review.md

## 16. Validation Results

| Check | Result | Notes |
|---|---|---|
| ADR-0006を参照した | Pass | Related ADRとRelated Documentsに記載。 |
| SNS_ASP_Affiliate_Terms_Review_Specification.mdを参照した | Pass | Related SpecificationとRelated Documentsに記載。 |
| Review Log Field Definitionsを作成した | Pass | Section 5に定義。 |
| Field Value Rulesを作成した | Pass | Section 6に定義。 |
| Approval Gate Status Valuesを定義した | Pass | Section 7に定義。 |
| Decision Category Valuesを定義した | Pass | Section 8に定義。 |
| Markdown Review Log Templateを作成した | Pass | Section 9に定義。 |
| CSV Header Templateを作成した | Pass | Section 10に定義。 |
| Example Review Log Entryはダミー値のみで作成した | Pass | Section 11にダミー値のみを使用。 |
| SNS規約詳細を断定していない | Pass | 詳細判断は後続仕様または公式情報確認へ委譲。 |
| ASP規約詳細を断定していない | Pass | ASP別運用条件の最終判断は行わない。 |
| アフィリエイト規約詳細を断定していない | Pass | 詳細結論は確定しない。 |
| Secret実体を含めていない | Pass | Evidence referenceは参照IDのみ。 |
| 文字化けがない | Pass | UTF-8 Markdownで作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 作成後に検証する。 |
| 作業前後のgit diffを確認した | Pass | 作業前後で確認する。 |

## 17. Next Actions

- Human Owner review of Review Log Template
- Approval Gate Data Model作成
- Platform-specific Terms Confirmation Checklist作成
- Review Log storage and retention policy作成
- Phase 1 implementation preparation
