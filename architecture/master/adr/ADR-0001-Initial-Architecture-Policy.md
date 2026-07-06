# Architecture Decision Record

## ADR ID

ADR-0001

## Title

Initial Architecture Policy for Growth Lab Core

## Status

Accepted

## Date

2026-07-06

## Context

Growth Lab Core requires a master architecture specification to manage SNS operation, mail platform, WordPress media platform, AI operation, analytics, security, and operations in an integrated manner.

## Decision

Create Growth Lab Core Master Architecture Specification as the highest-level architecture document and Single Source of Truth.

## Alternatives Considered

- Manage each area with separate documents only.
- Create only operation manuals.
- Create only implementation task instructions.

## Reason

A master architecture specification is required to keep design, implementation, operation, and future improvements consistent.

## Impact

All lower-level documents and implementation tasks must follow the master architecture.

## Risks

The document may become outdated if it is not maintained.

## Review Condition

Review when major changes occur in SNS platforms, mail platforms, WordPress, AI tools, API policies, security requirements, or Growth Lab Core system design.
