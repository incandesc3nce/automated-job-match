FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS prerelease
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/queue/package.json ./packages/queue/
COPY apps/api/package.json ./apps/api/

RUN bun install --filter 'api'

COPY apps/api ./apps/api
COPY packages/auth ./packages/auth
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue

FROM base AS release
COPY --from=prerelease /app ./

USER bun
EXPOSE 5000/tcp
ENTRYPOINT ["bun", "run", "api:start"]