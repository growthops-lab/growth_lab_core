# 05 WordPress Platform Architecture

## 1. Purpose

Define WordPress architecture for Growth Lab Core media operations.

## 2. Scope

Covers WordPress sites, posts, terms, media, featured images, draft updates, rewrite workflows, and REST API integration.

## 3. Background

WordPress is the primary destination for SEO content and affiliate media traffic.

## 4. Design Policy

- Use WordPress REST API.
- Draft-first publishing workflow.
- Published post updates require special safety checks.
- Rewrites must preserve review history.

## 5. Architecture Overview

WordPress integrates with media, creative assets, affiliate placements, SEO analysis, article improvements, and campaign items.

## 6. Requirements

### 6.1 Functional Requirements

- Create and sync drafts.
- Attach featured images.
- Manage categories and tags.
- Link article improvement workflows to draft updates.

### 6.2 Non-Functional Requirements

- Idempotent draft operations.
- Human approval before publication.
- Modified timestamp conflict detection.

## 7. Operation Policy

Direct updates to published posts are disabled unless explicitly enabled and reviewed.

## 8. Security and Compliance

Application passwords and tokens must not be logged or exported.

## 9. Scalability

The WordPress layer must support many media sites and content refresh campaigns.

## 10. Risks

- Duplicate posts.
- Unsafe published post updates.
- Lost editorial context.

## 11. Review Points

- Are drafts reviewed before publishing?
- Are rewrite changes tracked and measured?

## 12. Architecture Decision Records

Publishing policy changes require ADR review.
