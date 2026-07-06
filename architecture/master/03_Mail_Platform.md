# 03 Mail Platform Architecture

## 1. Purpose

Define the future mail platform architecture for Growth Lab Core.

## 2. Scope

Covers campaign mail, notification mail, report mail, consent, suppression, deliverability, and audit policy.

## 3. Background

Mail is planned as an operational and reporting channel, but external sending must remain controlled and compliant.

## 4. Design Policy

- Mail sending is disabled by default.
- External mail providers must be accessed through official APIs.
- Consent and suppression lists are mandatory before production sending.

## 5. Architecture Overview

Mail integrates with reports, notifications, operations alerts, and campaign summaries through a controlled delivery layer.

## 6. Requirements

### 6.1 Functional Requirements

- Create draft mail content.
- Attach generated reports.
- Track send status and failure reasons.
- Support mock delivery.

### 6.2 Non-Functional Requirements

- Deliverability-aware.
- Auditable.
- Consent-safe.

## 7. Operation Policy

Human review is required before external mail sending.

## 8. Security and Compliance

Do not store SMTP passwords or provider secrets in plaintext documents or logs.

## 9. Scalability

The mail domain must support multiple campaigns and media properties.

## 10. Risks

- Unapproved external sending.
- Leakage of private report data.

## 11. Review Points

- Is external sending disabled by default?
- Are suppression and consent controls defined?

## 12. Architecture Decision Records

Provider selection must be recorded by ADR.
