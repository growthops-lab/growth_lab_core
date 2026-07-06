# 00 Document Governance

## 1. Purpose

Define how Growth Lab Core architecture documents are created, reviewed, maintained, exported, and superseded.

## 2. Scope

This governance applies to all documents under `architecture`, `implementation`, `manuals`, `templates`, `changelog`, and `docs_export`.

## 3. Background

Growth Lab Core spans SNS operations, WordPress, affiliate media, AI workflows, analytics, security, and reporting. A controlled document system is required to keep implementation and operations aligned.

## 4. Design Policy

- Markdown is the canonical source.
- Exported Word, PDF, or review copies are secondary artifacts.
- Important design decisions must be captured as ADRs.
- Existing useful content must not be deleted during document updates.
- Existing files must be backed up before overwrite.

## 5. Architecture Overview

The document system is organized as a master architecture set, domain architecture folders, templates, changelog, and export artifacts.

## 6. Requirements

### 6.1 Functional Requirements

- Provide a single master architecture document set.
- Provide reusable templates.
- Provide ADR management.
- Provide export and changelog locations.

### 6.2 Non-Functional Requirements

- UTF-8 encoding.
- Plain Markdown.
- Stable file names.
- Easy review by Codex, Claude Code, ChatGPT, and humans.

## 7. Operation Policy

Update the master architecture when major platform, security, API, database, or operations changes occur.

## 8. Security and Compliance

Do not store secrets, API tokens, passwords, webhook URLs, personal data, or raw credentials in architecture documents.

## 9. Scalability

The document set must support versioned growth from 1.0 Draft to future 1.1 and 2.0 releases.

## 10. Risks

- Documents can become outdated.
- Implementation can drift from architecture.
- Exported copies can be mistaken for canonical sources.

## 11. Review Points

- Are documents still aligned with the implemented system?
- Are ADRs present for important decisions?
- Are exports clearly secondary?

## 12. Architecture Decision Records

ADR records are stored in `architecture/master/adr`.
