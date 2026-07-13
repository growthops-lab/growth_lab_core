# 00 Document Governance

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/00_Document_Governance.md

## 1. Purpose

本章の目的は、Growth Lab Core Master Architecture Specification における文書管理ルールを定義することである。

Growth Lab Core Master Architecture Specification は、Growth Lab Core の設計・開発・運用・改善に関する最上位のアーキテクチャ仕様書である。本章では、この仕様書を長期的に維持・更新するために必要な文書管理方針、文書階層、変更管理、レビュー・承認プロセス、Architecture Decision Record、以下 ADR と呼ぶ、の運用方針を定義する。

本章は、以下を実現するために存在する。

- Growth Lab Core の設計思想と文書構造の一貫性を維持する。

- Codex、Claude Code、ChatGPT、人間が同じ仕様を参照できる状態を維持する。

- 仕様変更、実装変更、運用変更が発生した場合に、関連文書へ正しく反映できる状態を作る。

- 将来 Ver.1.1、Ver.2.0 以降へ拡張できる文書管理基盤を整備する。

- 設計判断の理由、却下した案、影響範囲、見直し条件を後から追跡できる状態を作る。

- Markdownを正本とし、Word、PDF、その他の出力物との関係を明確にする。

本章は、単なる文書作成ルールではない。
本章は、Growth Lab Core 全体のアーキテクチャガバナンスを支える基盤である。

## 2. Positioning of This Specification

Growth Lab Core Master Architecture Specification は、Growth Lab Core 全体の最上位アーキテクチャ仕様書である。

本仕様書は、以下の領域を統合的に定義する。

- SNS運用アーキテクチャ

- メール基盤アーキテクチャ

- WordPress・アフィリエイトブログ基盤アーキテクチャ

- AI運用アーキテクチャ

- 分析・KPIアーキテクチャ

- データベースアーキテクチャ

- API・OAuthアーキテクチャ

- セキュリティ・認証・権限管理アーキテクチャ

- 運用設計・障害対応アーキテクチャ

- 拡張設計・変更管理・ロードマップ

本仕様書は、当初「SNS運用基盤設計書 Ver.1.0」として開始されたが、Growth Lab Core の役割が SNS、メール、WordPress、AI、分析、運用を統合する「AIを活用したメディア運営プラットフォーム」へ拡張されたため、Growth Lab Core 全体の Master Architecture Specification として位置付ける。

したがって、本仕様書は単なるSNS運用マニュアルではない。
本仕様書は、Growth Lab Core の設計憲章であり、システムアーキテクチャ、運用設計、実装方針、改善方針の最上位基準である。

## 3. Governance Principles

本仕様書の文書管理では、以下の原則を採用する。

### 3.1 Single Source of Truth

Growth Lab Core に関する上位設計判断は、本仕様書に集約する。

### 3.2 Markdown as Primary Source

Markdownを正本とする。
Word、PDF、その他の出力物はレビュー・共有・承認用の二次成果物とする。

### 3.3 Architecture Before Implementation

実装は、本仕様書または関連する下位仕様書に基づいて行う。
仕様書を更新しないまま、実装だけを変更する状態は禁止する。

### 3.4 Decision Traceability

重要な設計判断はADRとして記録する。
採用理由だけでなく、却下した案、影響範囲、将来の見直し条件も記録する。

### 3.5 Chapter-Based Review

本仕様書は章単位で作成、レビュー、修正、承認する。
章ごとに完成度を高めながら、最終的にVer.1.0として統合する。

### 3.6 Human and AI Readability

本仕様書は、人間だけでなく、Codex、Claude Code、ChatGPTが読み込むことを前提に作成する。
そのため、ファイル構成、命名規則、見出し階層、用語を一貫させる。

## 4. Single Source of Truth Policy

Growth Lab Core Master Architecture Specification は、Growth Lab Core の設計・開発・運用・改善における Single Source of Truth である。

Single Source of Truth とは、仕様、設計方針、運用方針、重要な設計判断について、最終的に参照すべき唯一の正本を意味する。

本プロジェクトでは、以下を原則とする。

- Growth Lab Core に関する上位設計判断は、本仕様書に記録する。

- 下位仕様書、実装指示書、運用マニュアル、Codex作業指示書、Claude Code作業指示書は、本仕様書に従う。

- 下位文書と本仕様書に矛盾がある場合は、本仕様書を優先する。

- 実装や運用で設計変更が発生した場合は、該当する本仕様書の章を更新する。

- 仕様書を更新せずに、実装だけが変更される状態を禁止する。

- Word、PDF、その他の出力物に差異がある場合は、Markdown版を正本として扱う。

Growth Lab Core は長期運用を前提とするため、設計と実装の乖離を最小化する必要がある。
そのため、実装後に仕様書が古くなることは重大な管理リスクとする。

## 5. Document Hierarchy

Growth Lab Core に関する文書は、以下の階層で管理する。

Growth Lab Core Master Architecture Specification
    |
    +-- System Architecture Specifications
    |       |
    |       +-- Mail Platform Architecture
    |       +-- SNS Platform Architecture
    |       +-- WordPress Platform Architecture
    |       +-- AI Platform Architecture
    |       +-- Growth Lab Core System Architecture
    |       +-- Database Architecture
    |       +-- API and OAuth Architecture
    |       +-- Security Architecture
    |       +-- Operations Architecture
    |       +-- Analytics and KPI Architecture
    |
    +-- Implementation Specifications
    |       |
    |       +-- Codex Implementation Instructions
    |       +-- Claude Code Implementation Instructions
    |       +-- Configuration Specifications
    |       +-- Integration Specifications
    |
    +-- Operation Manuals
    |       |
    |       +-- Account Operation Manual
    |       +-- Mail Operation Manual
    |       +-- SNS Operation Manual
    |       +-- WordPress Operation Manual
    |       +-- Incident Response Manual
    |       +-- Maintenance Manual
    |
    +-- Architecture Decision Records
    |
    +-- Changelog
    |
    +-- Export Documents

文書階層は、上位に行くほど設計思想、原則、アーキテクチャ判断を扱い、下位に行くほど具体的な実装、設定、運用手順を扱う。

本仕様書は最上位文書である。
下位文書は本仕様書を補足するものであり、本仕様書に反する内容を含んではならない。

## 6. Document Types

Growth Lab Core では、以下の文書種別を使用する。

### 6.1 Master Architecture Specification

Growth Lab Core 全体の最上位アーキテクチャ仕様書である。

対象範囲は、SNS、メール、WordPress、AI、分析、セキュリティ、運用、拡張設計を含む。
すべての下位文書は、この文書を基準として作成する。

### 6.2 System Architecture Specification

個別領域ごとのシステムアーキテクチャを定義する文書である。

例：

- Mail Platform Architecture

- SNS Platform Architecture

- WordPress Platform Architecture

- AI Platform Architecture

- Database Architecture

- API and OAuth Architecture

- Security Architecture

- Operations Architecture

- Analytics and KPI Architecture

System Architecture Specification は、Master Architecture Specification の各章を詳細化する文書である。

### 6.3 Implementation Specification

実装方法、ファイル構成、設定内容、開発手順を定義する文書である。

Codex、Claude Code、人間の開発者が具体的な作業を行う際に参照する。

### 6.4 Operation Manual

日常運用、障害対応、アカウント管理、メール管理、SNS運用、バックアップ、復旧手順を定義する文書である。

運用担当者が実務で利用できる粒度で作成する。

### 6.5 Codex Task Instruction

Codex に対して、ローカルファイル作成、更新、バックアップ、実装、検証を依頼するための作業指示書である。

Codex Task Instruction は、確定済みの設計内容をローカル環境へ正確に反映することを主目的とする。

### 6.6 Claude Code Task Instruction

Claude Code に対して、実装、コード修正、構成変更、検証を依頼するための作業指示書である。

Claude Code Task Instruction は、実装タスクやコードベース修正に適した形式で作成する。

### 6.7 Architecture Decision Record

重要な設計判断を記録する文書である。

ADR には、判断内容、背景、採用理由、却下した案、影響範囲、リスク、将来の見直し条件を記録する。

### 6.8 Changelog

仕様書、設計書、実装指示書、運用マニュアルの変更履歴を記録する文書である。

Changelog は、どのタイミングで何が変更されたかを追跡するために使用する。

### 6.9 Export Documents

Markdownをもとに生成された Word、PDF、レビュー用ファイルを指す。

Export Documents は人間向けの閲覧、共有、承認に使用するが、正本ではない。

## 7. Source Format and Export Policy

Growth Lab Core Master Architecture Specification では、Markdownを正本とする。

Markdownを正本とする理由は以下の通りである。

- Codex、Claude Code、ChatGPT が読み込みやすい。

- Gitなどの差分管理に適している。

- 章単位で分割しやすい。

- テキストベースで長期保守しやすい。

- WordやPDFへ変換しやすい。

- 実装指示書やADRとの連携がしやすい。

- ファイルの差分、変更履歴、レビュー履歴を管理しやすい。

本プロジェクトでは、以下の方針を採用する。

- Markdownファイルを一次情報とする。

- Word、PDFはレビュー、共有、承認用の出力物とする。

- MarkdownとWord/PDFに差異がある場合は、Markdownを優先する。

- Word/PDF側を修正した場合でも、必ずMarkdownへ反映する。

- CodexやClaude CodeはMarkdownを参照する。

- 人間向けのレビューではWordまたはPDFを使用してよいが、最終的な正本更新はMarkdownで行う。

Export Documents は docs_export フォルダに保存する。
正本であるMarkdownファイルは architecture/master 配下で管理する。

## 8. Version Management

Growth Lab Core Master Architecture Specification は、バージョン番号によって管理する。

バージョン番号は、原則として以下の形式を使用する。

Major.Minor.Patch

例：

1.0.0
1.1.0
1.1.1
2.0.0

### 8.1 Major Version

Major Version は、大きな設計変更が発生した場合に更新する。

例：

- Growth Lab Core の基本構造を大きく変更する場合。

- SNS運用OSとしての方針を変更する場合。

- データベース構成を全面的に変更する場合。

- API設計またはセキュリティ設計を大幅に変更する場合。

- Ver.1 系との互換性に大きな影響がある場合。

### 8.2 Minor Version

Minor Version は、重要な章追加、設計更新、機能拡張が発生した場合に更新する。

例：

- 新しいSNSプラットフォームを正式対応対象に追加する場合。

- メール基盤の設計方針を更新する場合。

- AI運用アーキテクチャに新しい機能を追加する場合。

- KPI設計を拡張する場合。

- 新しい下位仕様書体系を追加する場合。

### 8.3 Patch Version

Patch Version は、軽微な修正に使用する。

例：

- 誤字修正。

- 表現の補足。

- 章番号の修正。

- リンク修正。

- 既存設計に影響しない説明追加。

### 8.4 Version 1.0

Ver.1.0 は、Growth Lab Core Master Architecture Specification の初期正式版を意味する。

Ver.1.0 の完成後、実装、運用、改善の基準文書として正式に利用する。

## 9. Change Management

Growth Lab Core の仕様変更、設計変更、実装変更、運用変更が発生した場合は、関連文書を更新する。

変更管理では、以下を記録する。

- 変更日

- 変更理由

- 変更対象ファイル

- 影響範囲

- 関連するADR

- レビュー結果

- 承認状況

- 未対応事項

重要な変更はADRとして記録する。
軽微な変更はChangelogに記録する。

変更時の基本フローは以下の通りである。

Change Request
  |
  v
Impact Analysis
  |
  v
Document Update
  |
  v
Review
  |
  v
Approval
  |
  v
Changelog Update
  |
  v
Publication

既存ファイルを更新する場合は、更新前に _backup フォルダへバックアップを保存する。
バックアップは、日時と元の相対パスが分かる形式で保存する。

仕様書が更新されないまま実装だけが変更される状態は禁止する。

## 10. Change Classification

変更は、影響範囲に応じて以下のように分類する。

| Classification | Description | Required Action |
| --- | --- | --- |
| Major Architecture Change | Growth Lab Core の基本設計、データ構造、認証方式、主要連携方式に影響する変更 | ADR作成、章更新、レビュー、承認が必須 |
| Platform Change | SNS、メール、WordPress、AI、APIなど個別基盤の設計変更 | 関連章更新、必要に応じてADR作成 |
| Operation Change | 運用手順、管理ルール、障害対応、アカウント管理方法の変更 | 運用章、運用マニュアル、CHANGELOGを更新 |
| Implementation Change | フォルダ構成、設定、コード、スクリプト、連携方式の変更 | 実装仕様書、必要に応じて本仕様書を更新 |
| Minor Document Change | 誤字、表現、補足説明など設計に影響しない変更 | CHANGELOGへの記録を推奨 |

変更分類に迷う場合は、上位分類として扱う。
特にセキュリティ、認証、API、SNS利用規約、個人情報、アカウント運用に関わる変更は、慎重に扱う。

## 11. Review and Approval Process

Growth Lab Core Master Architecture Specification は、章単位で作成、レビュー、修正、承認を行う。

レビュー・承認プロセスは以下の通りである。

Draft
  |
  v
Internal Review
  |
  v
Revision
  |
  v
Approved
  |
  v
Published

### 11.1 Draft

Draft は作成中の状態である。

この状態では、内容は確定していない。
設計案、検討事項、未確定事項を含んでもよい。

### 11.2 Internal Review

Internal Review は、内容確認中の状態である。

レビューでは、以下を確認する。

- 設計思想に矛盾がないか。

- 他章との整合性があるか。

- 実装可能な内容か。

- 運用担当者が理解できる内容か。

- 将来拡張に耐えられる内容か。

- リスクが適切に記載されているか。

- 利用規約、セキュリティ、認証方針に反していないか。

### 11.3 Revision

Revision は、レビュー結果を反映して修正中の状態である。

修正時は、変更理由と影響範囲を確認する。

### 11.4 Approved

Approved は、内容が承認された状態である。

Approved となった章は、実装指示書、運用マニュアル、下位仕様書の基準として利用できる。

### 11.5 Published

Published は、正本として利用可能な状態である。

Published となった文書は、Codex、Claude Code、ChatGPT、人間が共通で参照する基準文書となる。

## 12. Architecture Decision Record Policy

重要な設計判断は、Architecture Decision Record として記録する。

ADRは、なぜその設計を採用したのかを将来追跡できるようにするための文書である。

ADRは以下のフォルダで管理する。

architecture/master/adr

ADRには、以下を記録する。

- ADR ID

- タイトル

- ステータス

- 日付

- 背景

- 決定内容

- 検討した代替案

- 採用理由

- 影響範囲

- リスク

- 見直し条件

ADRのIDは以下の形式とする。

ADR-0001
ADR-0002
ADR-0003

ADRのステータスは、以下を基本とする。

Proposed
Accepted
Deprecated
Superseded

### 12.1 Proposed

提案中の設計判断を意味する。

### 12.2 Accepted

採用済みの設計判断を意味する。

### 12.3 Deprecated

現在は非推奨となった設計判断を意味する。

### 12.4 Superseded

別のADRによって置き換えられた設計判断を意味する。

ADRは原則として削除しない。
過去の判断を残すことで、設計変更の履歴を追跡可能にする。

重要な設計判断をADRに残さないことは、将来の保守性を低下させるため禁止する。

## 13. Document Update Rules

Growth Lab Core 関連文書を更新する場合は、以下のルールに従う。

### 13.1 Master Architecture Update

Growth Lab Core の基本設計、設計原則、プラットフォーム構成、セキュリティ方針、API方針、運用方針に影響する変更は、本仕様書を更新する。

### 13.2 System Architecture Update

メール基盤、SNS基盤、WordPress基盤、AI基盤、データベース、API、セキュリティなど、個別領域に関する変更は、該当するSystem Architecture Specificationを更新する。

### 13.3 Implementation Update

実装ファイル、フォルダ構成、設定ファイル、接続方式、デプロイ手順に変更がある場合は、Implementation Specificationを更新する。

### 13.4 Operation Manual Update

日常運用、障害対応、アカウント作成、メール管理、SNS運用、バックアップ手順に変更がある場合は、Operation Manualを更新する。

### 13.5 External Change Update

SNS、メールサービス、Google Workspace、WordPress、AIサービス、API仕様、利用規約、セキュリティ要件に変更が発生した場合は、関連章の見直しを行う。

### 13.6 Consistency Check

文書更新時は、以下の整合性を確認する。

- READMEとの整合性

- 該当章との整合性

- ADRとの整合性

- CHANGELOGとの整合性

- 下位文書との整合性

- CodexやClaude Codeが参照するファイルパスとの整合性

## 14. Conflict Resolution Policy

文書間に矛盾が発生した場合は、以下の優先順位に従って解決する。

1. Growth Lab Core Master Architecture Specification
2. Architecture Decision Records
3. System Architecture Specifications
4. Implementation Specifications
5. Operation Manuals
6. Codex Task Instructions / Claude Code Task Instructions
7. Export Documents

本仕様書と下位文書が矛盾する場合は、本仕様書を優先する。

ADRと下位文書が矛盾する場合は、ADRを確認し、必要に応じて本仕様書または下位文書を更新する。

実装が仕様書と矛盾する場合は、原則として実装を修正する。
ただし、実装上の制約により仕様変更が必要な場合は、仕様書を更新し、必要に応じてADRを作成する。

WordやPDFなどの出力物とMarkdown正本が矛盾する場合は、Markdownを優先する。

## 15. File and Folder Management Policy

Growth Lab Core 関連文書は、以下の方針で管理する。

### 15.1 File Naming

ファイル名は、英数字、アンダースコア、ハイフンを基本とする。

章ファイルは、章番号を先頭に付ける。

例：

00_Document_Governance.md
01_Architecture_Principles.md
02_Overall_Architecture.md

ファイル名には、原則として空白を使用しない。

### 15.2 Encoding

すべてのMarkdownファイルはUTF-8で保存する。

日本語が文字化けしないことを必ず確認する。

### 15.3 Master Architecture Folder

正本となるMaster Architecture Specificationは以下で管理する。

architecture/master

### 15.4 ADR Folder

ADRは以下で管理する。

architecture/master/adr

### 15.5 Diagrams Folder

図表、構成図、データフロー図、ER図、シーケンス図は以下で管理する。

architecture/master/diagrams

可能な限り、MermaidやPlantUMLなどのテキストベース図を優先する。
画像形式を使用する場合は、PNGまたはSVGを推奨する。

### 15.6 Export Folder

Word、PDFなどの人間向け出力物は以下で管理する。

docs_export

### 15.7 Backup Folder

重要なファイルを更新する前には、以下へバックアップを保存する。

_backup

バックアップは、日時と元の相対パスが分かる形式にする。

例：

_backup/20260706_103000/architecture/master/00_Document_Governance.md

## 16. Roles and Responsibilities

Growth Lab Core の文書管理では、以下の役割を定義する。

| Role | Responsibility |
| --- | --- |
| Owner | 仕様書全体の最終責任者 |
| Architect | 設計方針、章構成、ADRの作成・更新担当 |
| Reviewer | 内容の妥当性、整合性、リスクを確認する担当 |
| Implementer | 仕様書に基づいて実装する担当 |
| Operator | 日常運用、障害対応、改善提案を行う担当 |
| AI Assistant | 仕様書作成、レビュー、改善提案を支援するAI |
| Codex | 確定済み仕様をローカルファイルへ反映するAI開発支援ツール |
| Claude Code | 仕様書に基づく実装、コード修正、検証を支援するAI開発支援ツール |

### 16.1 Owner

Owner は、Growth Lab Core Master Architecture Specification 全体の最終責任者である。

主な責任は以下である。

- 仕様書全体の方向性を決定する。

- 重要な設計判断を承認する。

- Ver.1.0、Ver.2.0 などの正式版を承認する。

### 16.2 Architect

Architect は、Growth Lab Core の設計方針、アーキテクチャ、章構成、ADRを作成・更新する担当である。

主な責任は以下である。

- 設計思想を仕様書へ反映する。

- 章間の整合性を維持する。

- 技術的な実現可能性を確認する。

- 将来拡張性を考慮する。

### 16.3 Reviewer

Reviewer は、仕様書や設計内容を確認する担当である。

主な責任は以下である。

- 内容の妥当性を確認する。

- 矛盾や不足を指摘する。

- 運用面、セキュリティ面、実装面の観点からレビューする。

### 16.4 Implementer

Implementer は、仕様書に基づいて実装を行う担当である。

主な責任は以下である。

- 仕様書に従って実装する。

- 実装上の制約がある場合は報告する。

- 実装内容が仕様書と矛盾しないようにする。

### 16.5 Operator

Operator は、Growth Lab Core の日常運用を担当する。

主な責任は以下である。

- 運用マニュアルに基づいて作業する。

- 障害や変更点を記録する。

- 運用上の改善点を報告する。

### 16.6 AI Assistant

AI Assistant は、仕様書作成、レビュー、改善提案、文章整理を支援するAIである。

主な役割は以下である。

- 章本文の作成支援

- 設計判断の整理

- ADR案の作成

- リスク整理

- レビュー観点の提案

- CodexやClaude Code向け指示書の作成支援

### 16.7 Codex

Codex は、確定済みの仕様内容をローカルファイルへ反映するAI開発支援ツールである。

主な役割は以下である。

- フォルダ作成

- Markdownファイル作成・更新

- バックアップ作成

- CHANGELOG更新

- ファイル構成確認

- 実装補助

Codexは、設計判断を単独で決定しない。
Codexは、確定済みの設計内容を正確に反映する役割を持つ。

### 16.8 Claude Code

Claude Code は、仕様書に基づく実装、コード修正、構成変更、検証を支援するAI開発支援ツールである。

Claude Codeは、仕様書とADRに基づいて作業する。
実装中に仕様と矛盾する課題を発見した場合は、仕様書更新またはADR作成が必要である。

## 17. Maintenance Policy

Growth Lab Core Master Architecture Specification は、一度作成して終了する文書ではない。

本仕様書は、Growth Lab Core の設計・実装・運用・改善に合わせて継続的に更新する。

見直しが必要となる主な条件は以下である。

- Growth Lab Core の基本設計が変更された場合。

- SNSプラットフォームの仕様や利用規約が変更された場合。

- メール基盤やGoogle Workspaceの運用方針が変更された場合。

- WordPress基盤やアフィリエイトブログ構成が変更された場合。

- AIモデル、AIツール、AI運用方針が変更された場合。

- APIやOAuthの仕様が変更された場合。

- セキュリティ要件が変更された場合。

- アカウント数や運用規模が大きく変化した場合。

- 20アカウント規模から100アカウント以上へ拡張する場合。

- 重大な障害やインシデントが発生した場合。

本仕様書は、少なくとも主要フェーズ終了時にレビューする。

主要フェーズの例：

Phase 1: 20アカウント運用基盤構築
Phase 2: 50から100アカウント規模への拡張
Phase 3: 100から500アカウント規模への拡張
Phase 4: Growth Lab Core 自動化・AI運用拡張
Phase 5: Growth Lab Core 2.0 への発展

## 18. Risks

本章で定義する文書管理が適切に運用されない場合、以下のリスクが発生する。

### 18.1 Risk: 仕様書が更新されず実装だけが進む

実装だけが変更され、仕様書が更新されない場合、設計と実装が乖離する。

軽減策：

- 実装変更時は関連仕様書を更新する。

- CodexやClaude Codeの作業完了時に、仕様書更新の必要有無を確認する。

- CHANGELOGに変更履歴を記録する。

### 18.2 Risk: 下位文書との矛盾が発生する

運用マニュアルや実装指示書が本仕様書と矛盾すると、作業者やAIツールが誤った判断をする可能性がある。

軽減策：

- 文書間の優先順位を明確にする。

- 章更新時に関連する下位文書を確認する。

- 矛盾発見時は本仕様書を基準に修正する。

### 18.3 Risk: ADRを残さず設計判断の理由が失われる

重要な判断理由が残らない場合、将来の設計変更時に判断基準が分からなくなる。

軽減策：

- 重要な設計判断は必ずADRに記録する。

- ADRは削除せず、ステータス変更で管理する。

- 却下した案も記録する。

### 18.4 Risk: Word/PDFだけが更新されMarkdown正本が古くなる

レビュー用ファイルだけが更新され、Markdownが古くなると、CodexやClaude Codeが誤った仕様を参照する可能性がある。

軽減策：

- Markdownを正本とする方針を徹底する。

- Word/PDFの変更は必ずMarkdownへ反映する。

- Export Documentsは二次成果物として扱う。

### 18.5 Risk: ファイルが分散し正しい仕様を参照できなくなる

仕様書、指示書、マニュアルが複数の場所に分散すると、最新の正本が分からなくなる。

軽減策：

- 正本は architecture/master 配下に集約する。

- 出力物は docs_export に集約する。

- バックアップは _backup に集約する。

- READMEで文書構造を明示する。

### 18.6 Risk: AIツールが古い仕様を参照する

CodexやClaude Codeが古いファイルを参照すると、誤った実装や更新が発生する。

軽減策：

- CodexやClaude Codeには必ず対象ファイルパスを明示する。

- READMEとCHANGELOGを更新する。

- 作業前に対象ファイルの存在と更新日を確認する。

## 19. Required Update Checklist

Growth Lab Core 関連文書を更新する場合は、以下を確認する。

Update Checklist

1. 対象ファイルは正しいか
2. 既存ファイルのバックアップは作成したか
3. Markdown正本を更新したか
4. 関連する下位文書への影響は確認したか
5. ADR作成が必要な変更か確認したか
6. CHANGELOGを更新したか
7. READMEとの整合性を確認したか
8. Codex / Claude Code が参照するファイルパスに変更はないか
9. Word / PDF などの出力物を更新する必要があるか
10. 文字コードがUTF-8であることを確認したか

## 20. Review Points

本章のレビューでは、以下を確認する。

- 本仕様書がGrowth Lab Core全体の最上位仕様書として明確に定義されているか。

- Single Source of Truth の方針が明確か。

- Markdown正本、Word/PDF出力物の関係が明確か。

- 文書階層が明確か。

- 文書種別の役割が明確か。

- バージョン管理ルールが明確か。

- 変更管理ルールが明確か。

- レビュー・承認プロセスが明確か。

- ADR管理方針が明確か。

- 文書間の優先順位が明確か。

- ファイル・フォルダ管理方針が明確か。

- 役割と責任が明確か。

- Codex、Claude Code、ChatGPT、人間が共通で参照しやすい構成になっているか。

- 将来 Ver.1.1、Ver.2.0 以降へ拡張できる文書管理方針になっているか。

## 21. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

今後、本章に関連する重要な変更が発生した場合は、必要に応じてADRを追加する。

想定される追加ADRの例：

ADR-0002: Markdown as Primary Source Format
ADR-0003: Document Hierarchy and Conflict Resolution Policy
ADR-0004: Chapter-Based Architecture Review Process
