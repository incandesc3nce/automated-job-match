FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS dependencies

COPY package.json bun.lock ./
COPY packages/auth/package.json ./packages/auth/
COPY apps/website/package.json ./apps/website/

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --filter 'website' --no-save

FROM base AS builder

COPY --from=dependencies /app ./

COPY packages/auth ./packages/auth
COPY apps/website ./apps/website

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG API_BASE_PATH=http://api:5000
ENV API_BASE_PATH=${API_BASE_PATH}
ARG NEXT_PUBLIC_API_BASE_PATH=http://localhost:5000
ENV NEXT_PUBLIC_API_BASE_PATH=${NEXT_PUBLIC_API_BASE_PATH}

WORKDIR /app/apps/website
RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app/apps/website/.next/standalone ./


COPY --from=builder --chown=bun:bun /app/apps/website/public ./apps/website/public

RUN mkdir -p ./apps/website/.next
COPY --from=builder --chown=bun:bun /app/apps/website/.next/static ./apps/website/.next/static

USER bun
EXPOSE 3000

ENTRYPOINT ["bun", "run", "apps/website/server.js"]
