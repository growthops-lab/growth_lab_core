# 09 API and OAuth Architecture

## 1. Purpose

Define API and OAuth architecture for Growth Lab Core integrations.

## 2. Scope

Covers Google, WordPress, Canva, X, future SNS platforms, quota handling, token handling, and mock modes.

## 3. Background

Growth Lab Core relies on official APIs and must avoid scraping or browser automation for platform operations.

## 4. Design Policy

- Official API first.
- OAuth tokens encrypted or omitted in mock mode.
- API limits and failures logged.
- Real API execution disabled by default unless explicitly configured.

## 5. Architecture Overview

Each integration should have auth, client, errors, mapping, mock, and domain-specific execution modules.

## 6. Requirements

### 6.1 Functional Requirements

- OAuth start and callback flows.
- Token refresh where applicable.
- Connection tests.
- Quota and error logging.

### 6.2 Non-Functional Requirements

- No secret logging.
- Rate-limit aware retry.
- Manual review on unknown states.

## 7. Operation Policy

Real posting, publishing, or external sending requires explicit enablement and human approval controls.

## 8. Security and Compliance

Never log access tokens, refresh tokens, client secrets, OAuth codes, code verifiers, authorization headers, or WordPress application passwords.

## 9. Scalability

New API integrations should follow existing domain module patterns.

## 10. Risks

- Token leakage.
- API quota exhaustion.
- Integration drift after platform policy changes.

## 11. Review Points

- Is the integration official API based?
- Are rate limits and errors stored?

## 12. Architecture Decision Records

New external API providers require ADR review.
