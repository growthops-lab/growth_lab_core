# 06 AI Platform Architecture

## 1. Purpose

Define AI usage architecture for Growth Lab Core.

## 2. Scope

Covers AI-generated posts, article drafts, rewrite suggestions, image metadata, recommendations, reports, and insights.

## 3. Background

AI accelerates content and analysis but must not replace human approval for publication or business decisions.

## 4. Design Policy

- AI output is draft or recommendation by default.
- Human approval is required for external publication.
- AI-generated content must be traceable.
- Sensitive data must be excluded from prompts and exports.

## 5. Architecture Overview

AI assists across SNS, WordPress, SEO, campaigns, reports, and business insights through domain-specific workflows.

## 6. Requirements

### 6.1 Functional Requirements

- Generate drafts.
- Generate rewrite suggestions.
- Generate reports and recommendations.
- Store prompts and outputs when appropriate.

### 6.2 Non-Functional Requirements

- Explainable outputs.
- Safe prompt boundaries.
- Human review gates.

## 7. Operation Policy

AI recommendations must not automatically change budgets, publish content, pause campaigns, or increase posting volume.

## 8. Security and Compliance

Do not include tokens, secrets, passwords, raw personal data, or private credentials in AI prompts.

## 9. Scalability

AI workflows must be modular and reusable by domain.

## 10. Risks

- Hallucinated recommendations.
- Policy violations in generated posts.
- Sensitive data exposure.

## 11. Review Points

- Is AI output labeled and reviewable?
- Are high-risk actions human-gated?

## 12. Architecture Decision Records

Model and provider changes require ADR review.
