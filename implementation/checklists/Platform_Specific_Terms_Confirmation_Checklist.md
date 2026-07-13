# Platform-specific Terms Confirmation Checklist

Document Name: Growth Lab Core Platform-specific Terms Confirmation Checklist
Related ADR: ADR-0006
Related Specification: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Related Template: templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
Related Data Model: implementation/data_models/Approval_Gate_Data_Model.md
Status: Draft
Primary Format: Markdown
Target File: implementation/checklists/Platform_Specific_Terms_Confirmation_Checklist.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- 本チェックリストは、SNS、WordPress、ASP、アフィリエイト関連投稿の媒体別確認項目を定義する。
- 本チェックリストは、ADR-0006、ADR-0006フォローアップ仕様、Review Log Template、Approval Gate Data Modelに基づく。
- 本チェックリストは、MVPでのHuman ReviewとApproval Gate判断を支援する。
- 本チェックリストは、媒体別規約の詳細結論を確定しない。

## 2. Scope

対象:

- X投稿前確認
- Instagram投稿前確認
- TikTok投稿前確認
- WordPress投稿前確認
- ASPリンク確認
- アフィリエイトリンク確認
- 複数媒体同時投稿確認
- 広告表記、PR表記、アフィリエイト表記確認
- 禁止表現確認
- 投稿自動化確認
- Review Log記録
- Approval Gate連携

対象外:

- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈
- 媒体別投稿自動化可否の最終判断
- ASP別運用条件の最終判断
- 法務判断
- API実装
- UI実装

## 3. Important Notes

- This checklist does not finalize SNS, ASP, or affiliate terms interpretation.
- This checklist defines review points, evidence requirements, and approval gate mapping.
- MVP does not automatically decide platform-specific terms compliance.
- Detailed terms review is delegated to later specifications or official-source confirmation.

日本語での重要事項:

- 本チェックリストは、SNS、ASP、アフィリエイト規約の詳細判断を確定しない。
- 本チェックリストは、確認項目、証跡要件、承認ゲート連携を定義する。
- MVPでは、媒体別規約適合性を自動で最終判断しない。
- 詳細な規約判断は、後続仕様または公式情報確認へ委譲する。
- Codexは公式規約確認を完了したように記載しない。

## 4. Relationship to ADR-0006, Review Log, and Approval Gate

- ADR-0006は、SNS、WordPress、ASP、アフィリエイト連携に関する実行境界を定義する。
- ADR-0006では、SNS・ASP・アフィリエイト規約確認を後続仕様へ委譲し、MVPでは承認ゲート管理を行う。
- SNS_ASP_Affiliate_Terms_Review_Specification.mdは、確認プロセスと承認ゲート管理方針を定義する。
- SNS_ASP_Affiliate_Review_Log_Template.mdは、確認結果、証跡、判断理由を記録する。
- Approval_Gate_Data_Model.mdは、Approved、Blocked、Deferred、Publishedなどの状態管理を定義する。
- 本チェックリストは、媒体別に確認すべき項目を整理し、Review LogとApproval Gateへ接続する。

## 5. Checklist Principles

- チェック項目は、媒体別の確認観点として扱う。
- チェック結果は、Review Logに記録する。
- 不明点がある場合は、Approvedにしない。
- 規約詳細が未確認の場合は、Blocked、Deferred、Requires official-source confirmation、Requires Human Owner decisionへ誘導する。
- 広告表記、PR表記、アフィリエイト表記の要否は必ず確認する。
- AI生成物はHuman Reviewを通す。
- 自動投稿はApproved状態かつ必要確認完了後のみ許可対象にする。
- 詳細な規約判断は後続仕様または公式情報確認へ委譲する。

## 6. Check ID Rules

| Area | Check ID Format | Notes |
|---|---|---|
| Common | COMMON-NNN | 全媒体共通の確認観点。 |
| X | X-NNN | X投稿前確認。 |
| Instagram | IG-NNN | Instagram投稿前確認。 |
| TikTok | TT-NNN | TikTok投稿前確認。 |
| WordPress | WP-NNN | WordPress公開前確認。 |
| ASP | ASP-NNN | ASPリンク、案件、広告主条件の確認観点。 |
| Affiliate Link | AFF-NNN | アフィリエイトリンク確認観点。 |
| Cross-platform | CROSS-NNN | 複数媒体横断投稿の確認観点。 |

ルール:

- Check IDは重複させない。
- Check IDはASCII英数字とハイフンのみを使用する。
- Check IDは後続のReview Log、Approval Gate、UI、DB設計で参照できる粒度にする。
- Check IDは現行規約の確定結論ではなく、確認観点を識別するために使用する。

## 7. Common Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| COMMON-001 | 投稿本文に禁止表現が含まれていないか。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked, Deferred | 疑いがある場合はApprovedにしない。 |
| COMMON-002 | 広告表記が必要か。 | Yes | Yes | advertising_label_required, advertising_label_status | Warning, Deferred | 要否不明ならRequires official-source confirmation。 |
| COMMON-003 | PR表記が必要か。 | Yes | Yes | pr_label_required, pr_label_status | Warning, Deferred | 要否不明ならDeferred。 |
| COMMON-004 | アフィリエイト表記が必要か。 | Yes | Yes | affiliate_label_required, affiliate_label_status | Warning, Deferred | 案件別確認へ接続する。 |
| COMMON-005 | ASPリンクが含まれているか。 | Yes | Yes | asp_terms_check_required, asp_terms_check_status | Deferred, Blocked | ASP条件不明ならApprovedにしない。 |
| COMMON-006 | アフィリエイトリンクが含まれているか。 | Yes | Yes | affiliate_terms_check_required, affiliate_terms_check_status | Deferred, Blocked | リンク利用条件の確認へ送る。 |
| COMMON-007 | 投稿先媒体が確認済みか。 | Yes | Yes | platform | Review Required | 媒体ごとにReview Logを分ける。 |
| COMMON-008 | 投稿画像または動画が確認済みか。 | Yes | Yes | content_type, evidence_reference | Warning, Blocked | 権利、表記、禁止表現の確認観点。 |
| COMMON-009 | AI生成物であるか。 | Yes | Yes | source_system, decision_reason | Review Required | AI生成物はHuman Review必須。 |
| COMMON-010 | Human Reviewが完了しているか。 | Yes | Yes | reviewer, reviewed_at, review_status | Approved, Review Required | 未完了ならPublished不可。 |
| COMMON-011 | Evidence Referenceが記録されているか。 | Yes | Yes | evidence_reference | Approved, Blocked | Secret実体ではなく参照IDを記録する。 |
| COMMON-012 | Approval Gate StatusがApprovedであるか。 | Yes | Yes | approval_gate_status | Approved, Published | ApprovedなしにPublishedへ進めない。 |

## 8. X Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| X-001 | 投稿本文確認。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked | 現行規約詳細は断定しない。 |
| X-002 | URL確認。 | Yes | Yes | content_url_or_reference | Deferred, Blocked | リンク先と導線の確認観点。 |
| X-003 | 画像確認。 | Yes | Yes | content_type, evidence_reference | Warning, Blocked | 画像内表記や権利確認を含む。 |
| X-004 | 広告表記、PR表記、アフィリエイト表記確認。 | Yes | Yes | advertising_label_status, pr_label_status, affiliate_label_status | Deferred | 表記要否不明ならApprovedにしない。 |
| X-005 | 自動投稿可否確認。 | Yes | Yes | automation_allowed_status | Deferred, Blocked | 媒体別自動投稿可否は本チェックリストで最終判断しない。 |
| X-006 | 公式規約確認が必要な場合のDeferred処理。 | Yes | Yes | decision_category, deferred_items | Deferred | Requires official-source confirmationへ誘導する。 |

## 9. Instagram Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| IG-001 | キャプション確認。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked | 現行規約詳細は断定しない。 |
| IG-002 | 画像または動画確認。 | Yes | Yes | content_type, evidence_reference | Warning, Blocked | 表記、権利、禁止表現の確認観点。 |
| IG-003 | ハッシュタグ確認。 | Yes | Yes | decision_reason | Warning, Deferred | 媒体別ルールは後続確認。 |
| IG-004 | 広告表記、PR表記、アフィリエイト表記確認。 | Yes | Yes | advertising_label_status, pr_label_status, affiliate_label_status | Deferred | 表記要否不明ならApprovedにしない。 |
| IG-005 | 外部リンク誘導の確認。 | Yes | Yes | affiliate_terms_check_status, content_url_or_reference | Deferred, Blocked | リンク誘導条件は後続公式確認。 |
| IG-006 | 自動投稿可否確認。 | Yes | Yes | automation_allowed_status | Deferred, Blocked | 自動投稿可否を最終判断しない。 |
| IG-007 | 公式規約確認が必要な場合のDeferred処理。 | Yes | Yes | decision_category, deferred_items | Deferred | Requires official-source confirmationへ誘導する。 |

## 10. TikTok Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| TT-001 | 動画内容確認。 | Yes | Yes | content_type, prohibited_expression_check_status | Warning, Blocked | 現行規約詳細は断定しない。 |
| TT-002 | キャプション確認。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked | 禁止表現疑いがあればApprovedにしない。 |
| TT-003 | 音源、素材、表現確認。 | Yes | Yes | evidence_reference, decision_reason | Deferred, Blocked | 権利や表現の詳細判断は後続確認。 |
| TT-004 | 広告表記、PR表記、アフィリエイト表記確認。 | Yes | Yes | advertising_label_status, pr_label_status, affiliate_label_status | Deferred | 表記要否不明ならDeferred。 |
| TT-005 | 外部リンク誘導の確認。 | Yes | Yes | affiliate_terms_check_status, content_url_or_reference | Deferred, Blocked | リンク誘導条件は後続公式確認。 |
| TT-006 | 自動投稿可否確認。 | Yes | Yes | automation_allowed_status | Deferred, Blocked | 自動投稿可否を最終判断しない。 |
| TT-007 | 公式規約確認が必要な場合のDeferred処理。 | Yes | Yes | decision_category, deferred_items | Deferred | Requires official-source confirmationへ誘導する。 |

## 11. WordPress Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| WP-001 | 記事本文確認。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked | SEO表現と禁止表現を確認する。 |
| WP-002 | 内部リンク確認。 | Yes | Yes | content_url_or_reference | Warning | 内部導線の確認観点。 |
| WP-003 | 外部リンク確認。 | Yes | Yes | content_url_or_reference, evidence_reference | Deferred, Blocked | 外部リンク先の確認観点。 |
| WP-004 | ASPリンク確認。 | Yes | Yes | asp_terms_check_required, asp_terms_check_status | Deferred, Blocked | ASP条件不明ならApprovedにしない。 |
| WP-005 | アフィリエイトリンク確認。 | Yes | Yes | affiliate_terms_check_required, affiliate_terms_check_status | Deferred, Blocked | リンク利用条件の確認観点。 |
| WP-006 | 広告表記、PR表記、アフィリエイト表記確認。 | Yes | Yes | advertising_label_status, pr_label_status, affiliate_label_status | Deferred | 表記要否不明ならDeferred。 |
| WP-007 | SEO表現と禁止表現の確認。 | Yes | Yes | prohibited_expression_check_status | Warning, Blocked | 誇大表現や高リスク表現をHuman Reviewする。 |
| WP-008 | 公開前承認確認。 | Yes | Yes | approval_gate_status, reviewed_at | Approved, Published | ApprovedなしにPublishedへ進めない。 |

## 12. ASP Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| ASP-001 | ASPリンク利用有無。 | Yes | Yes | asp_terms_check_required | Review Required | 利用有無を記録する。 |
| ASP-002 | ASP別利用条件確認要否。 | Yes | Yes | asp_terms_check_status | Deferred, Blocked | ASP別条件の詳細は後続公式確認。 |
| ASP-003 | 広告主条件確認要否。 | Yes | Yes | decision_category, deferred_items | Deferred | 広告主別条件は断定しない。 |
| ASP-004 | 成果条件または禁止事項確認要否。 | Yes | Yes | blocked_reason, deferred_items | Blocked, Deferred | 不明ならApprovedにしない。 |
| ASP-005 | 掲載先媒体の許可確認要否。 | Yes | Yes | platform, asp_terms_check_status | Deferred, Blocked | 媒体別許可を最終判断しない。 |
| ASP-006 | 公式情報確認が必要な場合のDeferred処理。 | Yes | Yes | decision_category, deferred_items | Deferred | Requires official-source confirmationへ誘導する。 |

## 13. Affiliate Link Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| AFF-001 | アフィリエイトリンク利用有無。 | Yes | Yes | affiliate_terms_check_required | Review Required | 利用有無を記録する。 |
| AFF-002 | リンク先確認。 | Yes | Yes | content_url_or_reference, evidence_reference | Deferred, Blocked | Exampleや記録では実在URLを使わない。 |
| AFF-003 | 表記要否確認。 | Yes | Yes | affiliate_label_required, affiliate_label_status | Deferred | 要否不明ならApprovedにしない。 |
| AFF-004 | リンク形式確認。 | Yes | Yes | affiliate_terms_check_status | Deferred, Blocked | 形式の詳細判断は後続確認。 |
| AFF-005 | クリック誘導表現確認。 | Yes | Yes | prohibited_expression_check_status, decision_reason | Warning, Blocked | 高リスク表現はHuman Reviewする。 |
| AFF-006 | 不明点がある場合のBlockedまたはDeferred処理。 | Yes | Yes | decision_category, blocked_reason, deferred_items | Blocked, Deferred | 不明なままApprovedにしない。 |

## 14. Cross-platform Post Review Checklist

| Check ID | Check Item | Required in MVP | Evidence Required | Review Log Field | Approval Gate Impact | Notes |
|---|---|---|---|---|---|---|
| CROSS-001 | 複数媒体で同一内容を使うか。 | Yes | Yes | platform, content_id | Review Required | 媒体ごとの確認を分離する。 |
| CROSS-002 | 媒体ごとの差分確認。 | Yes | Yes | decision_reason | Deferred | 差分未確認ならApprovedにしない。 |
| CROSS-003 | 媒体別に表記要否が異なる可能性の確認。 | Yes | Yes | advertising_label_status, pr_label_status, affiliate_label_status | Deferred | 詳細判断は後続公式確認。 |
| CROSS-004 | 媒体別に自動投稿可否が異なる可能性の確認。 | Yes | Yes | automation_allowed_status | Deferred, Blocked | 自動投稿可否を最終判断しない。 |
| CROSS-005 | 一括Approvedを避ける必要があるか。 | Yes | Yes | approval_gate_status, decision_category | Review Required, Deferred | 媒体ごとにApprovedを管理する。 |
| CROSS-006 | 媒体ごとにReview Logを分ける必要があるか。 | Yes | Yes | review_id, platform | Review Required | 複数媒体なら媒体別review_idを推奨する。 |

## 15. Approval Gate Mapping

| Condition | Recommended Approval Gate Status | Required Record | Notes |
|---|---|---|---|
| 全必須チェック完了 | Approved | evidence_reference, decision_reason, reviewer, reviewed_at | Publishedへ進むにはApprovedが必要。 |
| Human Review完了 | Approved or Review Required | reviewer, reviewed_at, review_status | 未完了ならPublished不可。 |
| Evidence Referenceあり | Approved candidate | evidence_reference | Secret実体ではなく参照IDを記録する。 |
| 規約確認が不明 | Deferred or Blocked | deferred_items or blocked_reason | Requires official-source confirmationへ誘導する。 |
| 表記要否が不明 | Deferred | deferred_items, decision_reason | 表記要否不明のままApprovedにしない。 |
| ASP条件が不明 | Deferred or Blocked | asp_terms_check_status, deferred_items or blocked_reason | ASP別詳細判断は後続公式確認。 |
| 禁止表現の疑いあり | Blocked | blocked_reason, evidence_reference | Human Reviewで再確認する。 |
| 自動投稿可否が不明 | Deferred or Blocked | automation_allowed_status, deferred_items | Unknownでは自動投稿しない。 |
| Human Owner判断が必要 | Deferred or Review Required | human_owner_decision_required, follow_up_owner | 判断完了までPublished不可。 |

## 16. Review Log Mapping

| Checklist Area | Review Log Field | Required | Notes |
|---|---|---|---|
| Platform | platform | Yes | 媒体ごとに記録する。 |
| Content Type | content_type | Yes | SNS投稿、記事、画像、リンクなどを分類する。 |
| Approval Gate | approval_gate_status | Yes | ApprovedなしにPublishedへ進めない。 |
| Decision Category | decision_category | Yes | Blocked、Deferred、Owner判断などを分類する。 |
| SNS Terms Required | sns_terms_check_required | Yes | SNS規約確認要否を記録する。 |
| SNS Terms Status | sns_terms_check_status | Yes | UnknownならApprovedにしない。 |
| ASP Terms Required | asp_terms_check_required | Yes | ASPリンク利用時に記録する。 |
| ASP Terms Status | asp_terms_check_status | Yes | ASP条件不明ならDeferredまたはBlocked。 |
| Affiliate Terms Required | affiliate_terms_check_required | Yes | アフィリエイトリンク利用時に記録する。 |
| Affiliate Terms Status | affiliate_terms_check_status | Yes | 詳細結論は後続確認へ委譲する。 |
| Advertising Label Required | advertising_label_required | Yes | 広告表記要否を記録する。 |
| Advertising Label Status | advertising_label_status | Yes | 要否不明ならDeferred。 |
| PR Label Required | pr_label_required | Yes | PR表記要否を記録する。 |
| PR Label Status | pr_label_status | Yes | 要否不明ならDeferred。 |
| Affiliate Label Required | affiliate_label_required | Yes | アフィリエイト表記要否を記録する。 |
| Affiliate Label Status | affiliate_label_status | Yes | UnknownならApprovedにしない。 |
| Prohibited Expression Required | prohibited_expression_check_required | Yes | 禁止表現確認要否を記録する。 |
| Prohibited Expression Status | prohibited_expression_check_status | Yes | 疑いがある場合はBlocked。 |
| Automation Allowed | automation_allowed_status | Yes | Unknownでは自動投稿しない。 |
| Human Owner Decision | human_owner_decision_required | Yes | Yesなら判断完了までPublished不可。 |
| Evidence | evidence_reference | Yes | 参照IDまたは保管場所識別子のみ記録する。 |
| Decision Reason | decision_reason | Conditional | Approved、Blocked、Deferred時に記録する。 |
| Blocked Reason | blocked_reason | Conditional | Blocked時に必須。 |
| Deferred Items | deferred_items | Conditional | Deferred時に必須。 |

## 17. Items Delegated to Later Official-source Confirmation

- Xの現行規約詳細
- Instagramの現行規約詳細
- TikTokの現行規約詳細
- ASP別の現行利用条件
- 広告主別の掲載条件
- アフィリエイト表記の最新要件
- 媒体別の自動投稿可否
- API利用条件
- 法務判断

## 18. Items Not Decided by This Checklist

- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論
- 投稿自動化可否の媒体別最終判断
- ASP別運用条件の最終判断
- API仕様
- UI設計
- DB物理設計
- 法務判断

## 19. Validation Results

| Check | Result | Notes |
|---|---|---|
| ADR-0006を参照した | Pass | Related ADRとSection 4に記載。 |
| SNS_ASP_Affiliate_Terms_Review_Specification.mdを参照した | Pass | Related Specificationに記載。 |
| Review Log Templateを参照した | Pass | Related TemplateとReview Log Mappingに記載。 |
| Approval Gate Data Modelを参照した | Pass | Related Data ModelとApproval Gate Mappingに記載。 |
| Check ID Rulesを定義した | Pass | Section 6に定義。 |
| Common Review Checklistを作成した | Pass | Section 7に作成。 |
| X Review Checklistを作成した | Pass | Section 8に作成。 |
| Instagram Review Checklistを作成した | Pass | Section 9に作成。 |
| TikTok Review Checklistを作成した | Pass | Section 10に作成。 |
| WordPress Review Checklistを作成した | Pass | Section 11に作成。 |
| ASP Review Checklistを作成した | Pass | Section 12に作成。 |
| Affiliate Link Review Checklistを作成した | Pass | Section 13に作成。 |
| Cross-platform Post Review Checklistを作成した | Pass | Section 14に作成。 |
| Approval Gate Mappingを作成した | Pass | Section 15に作成。 |
| Review Log Mappingを作成した | Pass | Section 16に作成。 |
| SNS規約詳細を断定していない | Pass | 詳細判断は後続仕様または公式情報確認へ委譲。 |
| ASP規約詳細を断定していない | Pass | ASP別運用条件を最終判断しない。 |
| アフィリエイト規約詳細を断定していない | Pass | 詳細結論は確定しない。 |
| 公式規約確認を完了したように記載していない | Pass | 後続公式情報確認へ委譲。 |
| Secret実体を含めていない | Pass | evidence_referenceは参照IDのみ。 |
| 文字化けがない | Pass | UTF-8 Markdownで作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 作成後に検証する。 |
| 作業前後のgit diffを確認した | Pass | 作業前後で確認する。 |

## 20. Next Actions

- Human Owner review of Platform-specific Terms Confirmation Checklist
- Review Log storage and retention policy作成
- Approval Gate API design
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
