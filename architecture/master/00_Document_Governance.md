# 00 Document Governance

Document Name: Growth Lab Core Master Architecture Specification  
Japanese Name: SNS Operation Foundation Design Specification Ver.1.0  
Version: 1.0 Draft  
Status: Draft  
Primary Format: Markdown  
Target File: architecture/master/00_Document_Governance.md

---

## 1. Purpose

This chapter defines the document governance rules for the Growth Lab Core Master Architecture Specification.

Growth Lab Core Master Architecture Specification is the highest-level architecture specification for Growth Lab Core. It governs design, implementation, operation, improvement, security, analytics, WordPress media, SNS operations, AI workflows, reporting, and future expansion.

This chapter exists to keep the specification maintainable over time. It defines document management policy, document hierarchy, version management, change management, review and approval process, Architecture Decision Records, conflict resolution, file management, roles, responsibilities, and update checklist.

This chapter is not only a writing guide. It is the architecture governance foundation for Growth Lab Core.

---

## 2. Positioning of This Specification

Growth Lab Core Master Architecture Specification is the Single Source of Truth for Growth Lab Core architecture.

This specification defines integrated policy for the following areas:

- SNS operation architecture
- Mail platform architecture
- WordPress and affiliate media architecture
- AI operation architecture
- Analytics and KPI architecture
- Database architecture
- API and OAuth architecture
- Security, authentication, and permission architecture
- Operations and incident response architecture
- Expansion roadmap and change management policy

The specification started as an SNS operation foundation design document, but Growth Lab Core has expanded to cover SNS, mail, WordPress, AI, analytics, campaigns, reporting, and operations. Therefore, this document set is positioned as the master architecture for the whole system.

Lower-level implementation instructions, operation manuals, Codex task instructions, Claude Code instructions, and export documents must follow this specification.

---

## 3. Governance Principles

Document governance for Growth Lab Core follows these principles.

### 3.1 Single Source of Truth

Important architecture decisions must be recorded in this master architecture document set.

### 3.2 Markdown as Primary Source

Markdown is the canonical source format. Word, PDF, and other exported documents are secondary artifacts for review, sharing, and approval.

### 3.3 Architecture Before Implementation

Implementation must follow this specification or a related lower-level specification. If implementation changes architecture, this specification or an ADR must be updated.

### 3.4 Decision Traceability

Important decisions must be recorded as Architecture Decision Records. ADRs must explain context, decision, alternatives, reason, impact, risks, and review condition.

### 3.5 Chapter-Based Review

The specification is maintained chapter by chapter. Each chapter can be reviewed, updated, and approved independently before being integrated into a complete version.

### 3.6 Human and AI Readability

The specification must be readable by humans and AI tools such as Codex, Claude Code, and ChatGPT. File names, headings, structure, and terminology must remain consistent.

---

## 4. Single Source of Truth Policy

Growth Lab Core Master Architecture Specification is the authoritative source for system design and operation policy.

If a lower-level document conflicts with this specification, this specification takes priority.

The following rules apply:

- Top-level architecture decisions must be recorded in this document set.
- Lower-level specifications must not contradict this document set.
- Implementation tasks must reference the applicable architecture chapter.
- Operation manuals must follow the architecture and security policy.
- Exported Word or PDF files must not be treated as canonical sources.
- If Word or PDF output differs from Markdown, Markdown takes priority.
- When implementation changes architecture, the relevant architecture document must be updated.

Implementation-only changes that alter behavior without updating the related specification are not allowed as a normal operating practice.

---

## 5. Document Hierarchy

Growth Lab Core documents are managed in this hierarchy:

```text
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
```

Higher-level documents define policy, constraints, and architecture decisions. Lower-level documents define implementation and operation details.

---

## 6. Document Types

Growth Lab Core uses the following document types.

### 6.1 Master Architecture Specification

Defines the highest-level architecture, principles, cross-domain policies, and governance rules.

### 6.2 System Architecture Specification

Defines domain-level architecture for mail, SNS, WordPress, AI, database, API/OAuth, security, operations, and analytics.

### 6.3 Implementation Specification

Defines how implementation should be performed, including file structure, configuration, validation, and coding constraints.

### 6.4 Operation Manual

Defines daily operation, account management, incident response, backup, recovery, maintenance, and review procedures.

### 6.5 Codex Task Instruction

Defines precise local file creation, update, backup, validation, and completion requirements for Codex.

### 6.6 Claude Code Task Instruction

Defines implementation, refactoring, code repair, and verification work intended for Claude Code or similar coding tools.

### 6.7 Architecture Decision Record

Records important architecture decisions and their reasons.

### 6.8 Changelog

Records what changed, when it changed, and why it changed.

### 6.9 Export Documents

Stores generated Word, PDF, or review copies. Exported files are not canonical.

---

## 7. Source Format and Export Policy

Markdown is the primary source format for Growth Lab Core architecture.

Markdown is used because it is:

- Easy for Codex, Claude Code, ChatGPT, and humans to read.
- Suitable for diff and version control.
- Easy to split by chapter.
- Easy to convert to Word or PDF.
- Suitable for long-term maintenance.

The policy is:

- Markdown files in `architecture/master` are canonical.
- Word, PDF, and other exports are secondary.
- Changes made in exported files must be reflected back into Markdown.
- Codex and Claude Code must reference Markdown files.
- Human review may use Word or PDF, but final source updates must be done in Markdown.

Export documents are stored in:

```text
docs_export
```

---

## 8. Version Management

The specification uses semantic versioning:

```text
Major.Minor.Patch
```

Examples:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

### 8.1 Major Version

Major versions are used for architecture-level changes that affect system direction, platform strategy, security model, data architecture, or operation model.

### 8.2 Minor Version

Minor versions are used for adding chapters, expanding platform support, adding governance details, or adding new operating policies without breaking the existing architecture.

### 8.3 Patch Version

Patch versions are used for wording fixes, typo corrections, small clarifications, and non-structural updates.

### 8.4 Draft Status

Draft documents may be edited actively. Accepted documents require stricter change management and ADRs for major changes.

---

## 9. Change Management Policy

Changes to Growth Lab Core architecture documents must follow a controlled process.

Before updating a file:

1. Confirm the target file path.
2. Create a backup if the file already exists.
3. Apply the change in Markdown.
4. Preserve useful existing content unless the instruction explicitly replaces it.
5. Update the changelog.
6. Validate UTF-8, Markdown structure, and related document consistency.

Backups must be stored under:

```text
_backup/YYYYMMDD_HHMMSS/original/relative/path
```

Example:

```text
_backup/20260706_103000/architecture/master/00_Document_Governance.md
```

---

## 10. Review and Approval Process

Architecture documents are reviewed in stages.

### 10.1 Draft

The chapter is being written or updated.

### 10.2 Internal Review

The chapter is checked for completeness, consistency, security impact, and operation impact.

### 10.3 Approved

The chapter is accepted as part of the current architecture baseline.

### 10.4 Superseded

The chapter or ADR is no longer current because it was replaced by a newer version or decision.

Review must confirm:

- The chapter aligns with master architecture principles.
- Related ADRs are present where needed.
- Security and compliance risks are addressed.
- Implementation and operation impact is clear.
- The document is readable by humans and AI tools.

---

## 11. Architecture Decision Record Policy

ADRs are required for important architecture decisions.

ADRs must be stored in:

```text
architecture/master/adr
```

ADR file names must follow this pattern:

```text
ADR-0001-Short-Decision-Title.md
```

An ADR must include:

- ADR ID
- Title
- Status
- Date
- Context
- Decision
- Alternatives Considered
- Reason
- Impact
- Risks
- Review Condition

ADR status values are:

- Proposed
- Accepted
- Rejected
- Superseded

Accepted ADRs should not be rewritten except for status changes, links to superseding ADRs, or minor corrections.

---

## 12. Conflict Resolution Policy

When documents conflict, use this priority order:

1. Growth Lab Core Master Architecture Specification
2. Architecture Decision Records
3. System Architecture Specifications
4. Implementation Specifications
5. Operation Manuals
6. Codex or Claude Code task instructions
7. Exported Word, PDF, or review copies

If an ADR conflicts with an older chapter, update the chapter or create a follow-up ADR.

If implementation conflicts with architecture, either change the implementation or update the architecture through the proper process.

---

## 13. Codex and Claude Code Integration Policy

Codex and Claude Code may assist with document creation, implementation, refactoring, and validation.

Rules:

- AI tools must follow the master architecture.
- AI tools must not independently change architecture policy without explicit instruction.
- AI tools must preserve file paths and document structure.
- AI tools must create backups before overwriting existing files.
- AI tools must update changelog entries when instructed.
- AI tools must report validation results.

Codex is primarily responsible for reflecting confirmed instructions into local files. Claude Code may be used for code implementation and verification based on the architecture.

---

## 14. Changelog Policy

The changelog records document and architecture changes.

The changelog file is:

```text
changelog/CHANGELOG.md
```

Each meaningful update should record:

- What changed.
- Which file was updated.
- Whether a backup was created.
- Whether an ADR was added or updated.
- Validation results if relevant.

Duplicate changelog entries should be avoided.

---

## 15. File and Folder Management Policy

Growth Lab Core architecture files use the following structure.

### 15.1 Master Architecture Folder

```text
architecture/master
```

### 15.2 ADR Folder

```text
architecture/master/adr
```

### 15.3 Diagrams Folder

```text
architecture/master/diagrams
```

Text-based diagrams such as Mermaid and PlantUML are preferred. PNG and SVG may be used when needed.

### 15.4 Export Folder

```text
docs_export
```

### 15.5 Backup Folder

```text
_backup
```

Backups must keep the original relative path.

---

## 16. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Owner | Final responsibility for the master architecture. |
| Architect | Creates and maintains architecture policy, chapters, and ADRs. |
| Reviewer | Reviews consistency, risk, completeness, and implementation impact. |
| Implementer | Implements according to the architecture. |
| Operator | Performs daily operation and reports improvement needs. |
| AI Assistant | Supports drafting, review, risk organization, and task preparation. |
| Codex | Reflects confirmed specifications into local files and validates results. |
| Claude Code | Supports implementation, code repair, refactoring, and verification. |

Codex and Claude Code support the process, but they do not own final architecture decisions.

---

## 17. Maintenance Policy

This specification is a living document.

Review is required when:

- Growth Lab Core system design changes.
- SNS platform terms or API policies change.
- Mail platform or Google Workspace operation changes.
- WordPress or affiliate media policy changes.
- AI model, AI tool, or AI operation policy changes.
- API or OAuth specifications change.
- Security requirements change.
- Account scale or operation scale changes significantly.
- Major incidents occur.

The specification should also be reviewed at the end of major implementation phases.

---

## 18. Risks

### 18.1 Specification Drift

Implementation may advance without architecture updates.

Mitigation:

- Update related specifications when implementation changes.
- Confirm architecture update needs at task completion.
- Record changes in the changelog.

### 18.2 Lower-Level Document Conflict

Operation manuals or implementation instructions may contradict the master architecture.

Mitigation:

- Maintain conflict resolution priority.
- Review related documents when chapters change.

### 18.3 Missing ADRs

Important decisions may be made without traceability.

Mitigation:

- Require ADRs for major decisions.
- Record rejected alternatives.

### 18.4 Export Documents Become Outdated

Word or PDF exports may be edited while Markdown remains unchanged.

Mitigation:

- Treat Markdown as canonical.
- Reflect export edits back into Markdown.

### 18.5 File Sprawl

Specifications can become scattered across folders.

Mitigation:

- Keep canonical files under `architecture/master`.
- Keep exports in `docs_export`.
- Keep backups in `_backup`.

### 18.6 AI Tools Reference Old Files

AI tools may use outdated documents.

Mitigation:

- Provide exact target paths.
- Update README and changelog.
- Validate file locations before tasks.

---

## 19. Required Update Checklist

Use this checklist when updating Growth Lab Core documents:

```text
Update Checklist

1. Is the target file correct?
2. Was the existing file backed up?
3. Was the canonical Markdown updated?
4. Were related lower-level documents checked?
5. Is an ADR required?
6. Was the changelog updated?
7. Is README consistency preserved?
8. Did Codex / Claude Code target paths remain correct?
9. Are exported Word / PDF updates needed?
10. Is UTF-8 encoding confirmed?
```

---

## 20. Review Points

Review this chapter using the following points:

- Is this specification clearly defined as the top-level architecture document?
- Is the Single Source of Truth policy clear?
- Is the relationship between Markdown and exports clear?
- Is document hierarchy clear?
- Are document types and roles clear?
- Is version management defined?
- Is change management defined?
- Is review and approval process defined?
- Is ADR policy defined?
- Is conflict resolution policy defined?
- Is file and folder management defined?
- Are responsibilities clear?
- Can humans, Codex, Claude Code, and ChatGPT read and use this structure?
- Can the document set expand to future versions?

---

## 21. Architecture Decision Records

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

Future ADR examples:

- ADR-0002: Markdown as Primary Source Format
- ADR-0003: Document Hierarchy and Conflict Resolution Policy
- ADR-0004: Chapter-Based Architecture Review Process

When important governance changes occur, add a new ADR as needed.

---
