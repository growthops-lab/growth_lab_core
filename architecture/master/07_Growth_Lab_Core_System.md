# 07 Growth Lab Core System Architecture

## 1. Purpose

Define the Growth Lab Core application architecture.

## 2. Scope

Covers Next.js, TypeScript, Prisma, PostgreSQL, server actions, workers, dashboards, Docker, and environment configuration.

## 3. Background

Growth Lab Core is a local-first MVP that has evolved through phased implementation.

## 4. Design Policy

- Keep domain logic in `src/lib`.
- Keep UI actions in `app/*-actions.ts`.
- Use Prisma schema as the database contract.
- Use `.env` and `.env.example` for configuration.
- Use mock mode for risky external operations by default.

## 5. Architecture Overview

```text
app
  page and server actions
src/lib
  domain services and safety gates
src/workers
  background workers
prisma
  schema and seed
public
  local generated assets
```

## 6. Requirements

### 6.1 Functional Requirements

- Dashboard operations for all implemented phases.
- Domain-specific smoke tests.
- Seed data for local operation.

### 6.2 Non-Functional Requirements

- TypeScript strict compatibility.
- ESLint clean.
- Buildable with Next.js.

## 7. Operation Policy

All new phases must include validation steps: Prisma validate, typecheck, lint, seed if changed, smoke when available, and build.

## 8. Security and Compliance

Secrets must remain in environment variables and encrypted storage where applicable.

## 9. Scalability

New domains should extend the existing pattern instead of introducing unrelated architecture.

## 10. Risks

- Large dashboard page can become hard to maintain.
- Cross-domain logic can become tightly coupled.

## 11. Review Points

- Is the implementation consistent with existing phase patterns?
- Are validation scripts updated?

## 12. Architecture Decision Records

Major architectural changes require ADRs.
