# P2 Cron Fail-Closed Design

## 1. Purpose

Prevent the `GET /api/cron/publish-due` entrypoint from invoking publication
processing unless cron authentication has been explicitly configured and
successfully presented.

## 2. Scope

- `app/api/cron/publish-due/route.ts`
- `src/lib/approval-gate/http/cron-publish-due-route.test.ts`
- This design record

## 3. Behaviour

1. If `CRON_SECRET` is absent, empty, or whitespace-only, return HTTP `503`
   with `{ "error": "Service unavailable" }` and do not invoke
   `publishDuePosts()`.
2. If `CRON_SECRET` is configured but the `Authorization` header is absent or
   does not exactly equal `Bearer <CRON_SECRET>`, return HTTP `401` and do not
   invoke `publishDuePosts()`.
3. Only a matching `Authorization` header may invoke `publishDuePosts()`.
4. Neither responses nor tests disclose any deployed credential value.

## 4. Validation

The unit test mocks `publishDuePosts()`; it does not connect to Prisma, a real
database, an identity provider, or an external service. The acceptance suite
also requires the repository test, lint, typecheck, formatting, OpenAPI lint,
build, and whitespace-diff checks to pass.

## 5. Explicit non-scope

- Reading, creating, or changing `CRON_SECRET` or any other credential.
- Real database connection, migration, seed, or data mutation.
- OIDC/IdP changes.
- X or other external-service calls, scheduled production execution, and
  production release.
