# Public dependencies and offline application build use the same OpenSSL base.
ARG NODE_BASE=node@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32
FROM ${NODE_BASE} AS base
RUN --network=default apk add --no-cache openssl

FROM base AS toolchain
RUN --network=default corepack enable pnpm && corepack prepare pnpm@11.7.0 --activate
ENV COREPACK_ENABLE_NETWORK=0 NEXT_TELEMETRY_DISABLED=1 CHECKPOINT_DISABLE=1 DO_NOT_TRACK=1 SCARF_NO_ANALYTICS=true

FROM toolchain AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN --network=default export DATABASE_URL='postgresql://validation:validation@127.0.0.1:1/validation?schema=public' && pnpm install --frozen-lockfile && pnpm exec prisma generate

FROM toolchain AS builder
WORKDIR /app
ENV npm_config_offline=true
ENV DATABASE_URL=postgresql://validation:validation@127.0.0.1:1/validation?schema=public
ENV AUTO_POSTING_ENABLED=false SYNC_WORKER_ENABLED=false SNS_POST_WORKER_ENABLED=false OPERATIONS_AUTOMATION_ENABLED=false OPERATIONS_DRY_RUN_MODE=true
ENV GOOGLE_API_REAL_CONNECTION_ENABLED=false GA4_API_ENABLED=false GOOGLE_SEARCH_CONSOLE_API_ENABLED=false WORDPRESS_MOCK_MODE=true CANVA_MOCK_MODE=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --network=none pnpm exec prisma generate
RUN --network=none pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "server.js"]
