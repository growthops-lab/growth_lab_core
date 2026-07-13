# Master Architecture Improvement Proposal

Document Name: Growth Lab Core Master Architecture Improvement Proposal
Target: architecture/master 00 to 14
Status: Proposal Draft
Proposal Date: 2026-07-08
Author: Codex

---

## 1. Purpose

本提案書は、Growth Lab Core Master Architecture 00章から14章までを通して確認したうえで、今後の改善、最適化、運用品質向上に役立つ提案を整理するものである。

本作業では、既存の00章から14章、README、ADR、CHANGELOGを直接修正していない。
提案のみを `architecture/master/review` 配下に記録する。

---

## 2. Overall Assessment

全14章は、Master Architecture v1.0 Draftとしての骨格を満たしている。

特に以下は良好である。

- 00から14までの章構成が揃っている。
- 各章の先頭見出しと章番号は整合している。
- READMEに章一覧とScale Gate Naming Referenceがある。
- Secret、Token、Password、API Key実体を含めない方針が一貫している。
- 07から14の責任分界は概ね明確である。
- Related ADRsは、02から14では正式ADRファイルが存在するものに整理されている。
- 禁止マーカー、文字化け、置換文字は検出されなかった。
- 実装詳細、SQL全文、Prisma Schema全文、API endpoint詳細、Runbook全文への入り込みは見られなかった。

一方で、v1.0 Draft完成後の保守性を高めるため、以下の改善を提案する。

---

## 3. Proposal Summary

| ID | Priority | Theme | Proposal | Target |
|---|---|---|---|---|
| MA-IP-0001 | P1 | ADR Governance | Future ADR候補表記を全章で統一する | 00, 01, 02-14 |
| MA-IP-0002 | P1 | Scale Gate Naming | 08から12に残る07章Gate短縮参照を正式名へ統一する | 08-12 |
| MA-IP-0003 | P1 | Completion Readiness | v1.0 Draft完成宣言前チェックリストを作成する | review |
| MA-IP-0004 | P2 | Traceability | 章間責任分界マトリクスを作成する | review or README |
| MA-IP-0005 | P2 | ADR Operations | ADR Candidate Indexを作成する | review, later adr |
| MA-IP-0006 | P2 | Terminology | 用語集と表記ルールを作成する | review or README |
| MA-IP-0007 | P2 | Validation | Markdown/ADR/Scale Gate検証スクリプトを検討する | tools or scripts |
| MA-IP-0008 | P3 | Documentation UX | READMEに各章への相対リンクを追加する | README |
| MA-IP-0009 | P3 | Review Cadence | 定期レビューの運用サイクルを明文化する | 00, 11, 14 |
| MA-IP-0010 | P3 | Release Notes | v1.0 Draft完成宣言メモを作成する | review |

---

## 4. Detailed Proposals

### MA-IP-0001: Future ADR候補表記を全章で統一する

Priority: P1
Target:
- 00_Document_Governance.md
- 01_Architecture_Principles.md
- 02_Overall_Architecture.md から 14_ADR.md

Current State:
- 02から14では、Related ADRsとFuture ADR candidatesの分離が概ね整理されている。
- 00章では、未作成ADRが「想定される追加ADRの例」として記載されている。
- 01章以降では「今後追加が想定されるADR」という表現が多い。

Issue:
意味は通るが、章ごとにFuture ADR候補欄の見出し名と書式が異なるため、将来の機械検査やADR Index生成で扱いづらい。

Proposal:
- 全章でFuture ADR候補の見出し名を統一する。
- 推奨表記は `Future ADR candidates` または日本語の「今後追加が想定されるADR」に統一する。
- 1 ADR 1行の形式を標準にする。
- Candidate番号は予約ではなく目安であることを14章またはREADMEから参照できるようにする。

Expected Benefit:
- ADR候補の重複検査が容易になる。
- 正式ADRとCandidateの混同を防げる。
- 14章のADR Candidate Policyと全章の書式が揃う。

---

### MA-IP-0002: 08から12に残る07章Gate短縮参照を正式名へ統一する

Priority: P1
Target:
- 08_Database.md
- 09_API_OAuth.md
- 10_Security.md
- 11_Operations.md
- 12_Analytics_KPI.md

Current State:
- 07章とREADMEでは `Growth Lab Core System Scale Gate` が正式名として使われている。
- 08から12の一部文脈では「07章のSystem Scale Gate」という短縮参照が残っている。

Issue:
読めば同じGateだと分かるが、READMEのScale Gate Naming Referenceと完全には一致していない。

Proposal:
- 08から12に残る「07章のSystem Scale Gate」を `07章のGrowth Lab Core System Scale Gate` に統一する。
- 「System Scale Gate」をAliasとして残す必要がある場合は、READMEまたは07章でAlias明記を行う。

Expected Benefit:
- Scale Gate名の機械検査が安定する。
- Roadmap、Analytics、Operationsから参照する統合Gateの名称が明確になる。
- 将来の完成宣言レビューで表記揺れを減らせる。

---

### MA-IP-0003: v1.0 Draft完成宣言前チェックリストを作成する

Priority: P1
Target:
- architecture/master/review

Current State:
- Cross Review、Findings、Fix Reportは存在する。
- 完成宣言に進める状態だが、宣言前の最終チェックリストは独立ファイルとしては存在しない。

Proposal:
以下のファイルを作成する。

```text
architecture/master/review/Master_Architecture_v1_Draft_Completion_Checklist.md
```

チェック項目例:

- 00から14の存在確認
- README章一覧確認
- Related ADRs確認
- Future ADR candidates確認
- Scale Gate名称確認
- Secret実体なし確認
- 禁止マーカーなし確認
- 文字化けなし確認
- CHANGELOG反映確認
- Backup存在確認
- Review/Fix Report存在確認

Expected Benefit:
- v1.0 Draft完成宣言の根拠が明確になる。
- 後続の実装フェーズへ移る際の安心感が増す。

---

### MA-IP-0004: 章間責任分界マトリクスを作成する

Priority: P2
Target:
- architecture/master/review
- 将来的にはREADMEまたは02_Overall_Architecture.md

Current State:
- 各章内に責任分界は記載されている。
- ただし、全章を横断した一覧表はREADMEにはない。

Proposal:
以下のような責任分界マトリクスを作成する。

| Chapter | Owns | Delegates To | Must Not Own |
|---|---|---|---|
| 07 | Core System, Workflow, Scheduler | 08, 09, 10, 11, 12, 13, 14 | DB physical schema |
| 08 | Entity, Relation, Migration | 10, 11 | Secret実体管理 |
| 09 | API, OAuth, Scope, Token Reference | 10 | Secret Store実装 |
| 10 | Security, Secret, Access Control | 11 | Runbook全文 |
| 11 | Operations, Runbook方針 | 12, 13 | KPI計算式詳細 |
| 12 | KPI, ROI, Analytics | 13 | 実装順序決定 |
| 13 | Phase, Stage, Roadmap | 14 | ADR運用全体 |
| 14 | ADR Lifecycle, Index, Supersede | Each chapter | 個別章設計の置換 |

Expected Benefit:
- 新規開発時に「どの章を見るべきか」が分かりやすくなる。
- CodexやClaude Codeが責任分界を誤って越えにくくなる。

---

### MA-IP-0005: ADR Candidate Indexを作成する

Priority: P2
Target:
- architecture/master/review
- 将来的には architecture/master/adr

Current State:
- ADR候補は各章に分散している。
- 正式ADRはADR-0001のみ存在する。

Proposal:
まずreview配下に非公式の候補一覧を作成する。

```text
architecture/master/review/ADR_Candidate_Index_Proposal.md
```

含める項目:

- Candidate ID
- Candidate Title
- Source Chapter
- Category
- Suggested Priority
- Formal ADR Required Now
- Notes

Expected Benefit:
- Candidate番号が目安であることを保ちながら、重複と抜け漏れを管理できる。
- ADR正式作成の優先順位を決めやすくなる。

---

### MA-IP-0006: 用語集と表記ルールを作成する

Priority: P2
Target:
- architecture/master/review
- 将来的にはREADMEまたは00_Document_Governance.md

Current State:
- 各章で用語は概ね一貫している。
- ただし、以下のような用語は将来の誤解を防ぐため、用語集化するとよい。

Candidate Terms:

- Secret実体
- Secret Reference
- Token実体
- Token Reference
- Credential Reference
- Registry
- Entity
- Scale Gate
- Review
- Candidate ADR
- Active ADR
- Decision Log
- CHANGELOG
- Roadmap Gate
- Roadmap Scale Gate

Proposal:
`Master_Architecture_Glossary_Proposal.md` をreview配下に作成し、正式化する場合はREADMEまたは00章へ反映する。

Expected Benefit:
- 新規参加者やAI支援ツールが文脈を誤読しにくくなる。
- Secret ReferenceとSecret実体など、重要な境界が安定する。

---

### MA-IP-0007: Markdown/ADR/Scale Gate検証スクリプトを検討する

Priority: P2
Target:
- tools
- scripts

Current State:
- 手動または一時的なスクリプトで検証している。
- 今後も章更新が続く場合、検証の再現性が重要になる。

Proposal:
以下を検査するスクリプトを作成する。

- 00から14の存在確認
- 先頭見出し確認
- コードフェンス偶数確認
- 禁止マーカー確認
- 文字化け確認
- Related ADRsが実在ADRのみを参照しているか
- Future ADR candidatesの重複確認
- Scale Gate正式名称確認
- Secretらしき値の簡易検出

Expected Benefit:
- 毎回のレビュー品質が安定する。
- v1.0 Draft以降の更新時に差分リスクを抑えられる。

Note:
本提案書ではスクリプト作成は行わない。

---

### MA-IP-0008: READMEに各章への相対リンクを追加する

Priority: P3
Target:
- architecture/master/README.md

Current State:
- READMEのDocument Structureは表形式になっている。
- File列は現在テキストであり、Markdownリンクではない。

Proposal:
File列を相対リンクにする。

Example:

```markdown
[00_Document_Governance.md](./00_Document_Governance.md)
```

Expected Benefit:
- GitHubやVSCode上で章間移動がしやすくなる。
- 人間レビューの作業効率が上がる。

---

### MA-IP-0009: 定期レビューの運用サイクルを明文化する

Priority: P3
Target:
- 00_Document_Governance.md
- 11_Operations.md
- 14_ADR.md

Current State:
- Review、CHANGELOG、ADR、Operationsの方針は存在する。
- ただし、Master Architecture全体をいつ再レビューするかは独立した運用サイクルとしてはやや見えにくい。

Proposal:
以下のレビューサイクルを提案する。

- Minor document update: 対象章レビュー
- Cross chapter impact: 関連章レビュー
- New platform integration: 07から14の横断レビュー
- Before production expansion: Scale Gate review plus ADR candidate review
- Quarterly: Full Master Architecture health review

Expected Benefit:
- 更新漏れと章間不整合を早期に検出できる。
- ADR、CHANGELOG、Roadmapの連携が安定する。

---

### MA-IP-0010: v1.0 Draft完成宣言メモを作成する

Priority: P3
Target:
- architecture/master/review

Proposal:
完成宣言前チェック後、以下を作成する。

```text
architecture/master/review/Master_Architecture_v1_Draft_Completion_Declaration.md
```

含める項目:

- Completion date
- Reviewed scope
- Known remaining proposals
- No P0/P1 blockers statement
- Next phase recommendation
- Sign-off note for human owner

Expected Benefit:
- 「完成扱いにする根拠」が明文化される。
- 次の実装フェーズに入りやすくなる。

---

## 5. Per-Chapter Proposal Notes

| Chapter | Proposal Notes |
|---|---|
| 00 Document Governance | Future ADR候補の見出しを他章と揃えるとよい。定期レビューサイクルもここに置ける。 |
| 01 Architecture Principles | Future ADR候補をコードブロックまたは1 ADR 1行形式で統一するとよい。 |
| 02 Overall Architecture | 全体責任分界マトリクスへのリンクを追加すると、各章への委譲が見やすくなる。 |
| 03 Mail Platform | コードブロックとFuture ADR候補は改善済み。今後はMarkdown lint対象にするとよい。 |
| 04 SNS Platform | SNS Scale GateとGrowth Lab Core System Scale Gateの関係をREADME表から参照できるとよい。 |
| 05 WordPress Platform | WordPress Scale GateとAnalytics/KPIの接続を将来マトリクス化するとよい。 |
| 06 AI Platform | AI入力に含めない情報の境界が重要。用語集化の恩恵が大きい。 |
| 07 Growth Lab Core System | 正式Gate名は整っている。関連章からの短縮参照を統一するとさらによい。 |
| 08 Database | 「07章のSystem Scale Gate」短縮参照を正式名へ寄せる提案あり。 |
| 09 API and OAuth | Token ReferenceとSecret実体の境界を用語集から参照できるとよい。 |
| 10 Security | Secret実体、Secret Reference、Credential Referenceの用語統一を強化するとよい。 |
| 11 Operations | 定期レビュー、Runbook、Incident、Scale Gate材料整理の周期を表にすると運用しやすい。 |
| 12 Analytics and KPI | Missing Data、Guardrail KPI、Roadmap Metricsを用語集化すると誤用を防げる。 |
| 13 Roadmap | Stop or Deferを正式判断として扱う方針は良い。完成宣言メモとの接続を推奨。 |
| 14 ADR | CandidateとActive ADRの区別は明確。ADR Candidate Indexへの接続を推奨。 |

---

## 6. Suggested Next Steps

### 6.1 Before Completion Declaration

1. 本提案書を人間レビューする。
2. P1提案のみ実施するか判断する。
3. v1.0 Draft完成宣言前チェックリストを作成する。
4. 軽量な再レビューを実施する。

### 6.2 After Completion Declaration

1. ADR Candidate Indexを作成する。
2. 用語集を作成する。
3. 検証スクリプトを作成する。
4. READMEのリンク化を行う。
5. 定期レビュー運用を開始する。

---

## 7. Non-Goals

本提案書では以下を行わない。

- 00から14の章本文修正
- README修正
- ADRファイル作成
- CHANGELOG修正
- 設計方針の新規決定
- ADRのAccepted化
- Scale Gate方針変更
- Roadmap PhaseやStage変更

---

## 8. Conclusion

Growth Lab Core Master Architectureは、v1.0 Draft完成に近い状態にある。
現在の残課題は、重大な設計矛盾というより、完成宣言後の保守性、検索性、検証性、AI支援作業の安全性を高めるための最適化が中心である。

推奨は、まず以下の3点を次工程にすることである。

1. v1.0 Draft完成宣言前チェックリスト作成
2. ADR Candidate Index提案作成
3. 用語集提案作成

これにより、Master Architectureを完成扱いにした後も、継続的に安全に拡張できる基盤になる。
