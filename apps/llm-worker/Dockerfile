FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS prerelease
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/
COPY apps/llm-worker/package.json ./apps/llm-worker/

RUN bun install --filter 'llm-worker'

COPY apps/llm-worker ./apps/llm-worker
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue

FROM base AS release
COPY --from=prerelease /app ./

USER bun
EXPOSE 5002/tcp
ENTRYPOINT [ "bun", "run", "llm-worker:start" ]