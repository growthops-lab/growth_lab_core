# 04 SNS Platform Architecture

## 1. Purpose

Define SNS platform architecture for Growth Lab Core.

## 2. Scope

Covers X, Instagram, Pinterest, TikTok, Threads, Facebook, media upload, approval, posting, performance, and improvement loops.

## 3. Background

SNS supports traffic generation for affiliate media. Direct affiliate links can be prohibited by ASP or platform policy and must be controlled.

## 4. Design Policy

- Use official APIs only.
- No scraping or browser automation.
- AI-generated posts require human approval.
- Approved posts only can be scheduled or posted.
- X is used as a traffic channel to WordPress, not direct A8.net ad-link publication.

## 5. Architecture Overview

SNS uses API connection records, token records, post queues, safety checks, rate logs, execution logs, and performance snapshots.

## 6. Requirements

### 6.1 Functional Requirements

- Manage social accounts and API connections.
- Queue approved posts.
- Detect direct affiliate links and short URL risk.
- Stop posting on API limit or unknown status.
- Store performance and attribution separately.

### 6.2 Non-Functional Requirements

- Idempotent execution.
- Rate-limit aware.
- Human-review first.

## 7. Operation Policy

Growth Score or recommendations may suggest improvements but must not automatically increase posting volume.

## 8. Security and Compliance

Never log access tokens, refresh tokens, OAuth codes, code verifiers, or Authorization headers.

## 9. Scalability

The SNS domain must support 20 or more media properties and multiple platform accounts.

## 10. Risks

- Duplicate posting.
- Posting prohibited links.
- Exceeding API limits.

## 11. Review Points

- Is mock mode default?
- Are approval, link, risk, and dedup checks enforced?

## 12. Architecture Decision Records

Platform-specific policy changes require ADR review.
