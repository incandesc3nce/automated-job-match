FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/redis/package.json ./packages/redis/
COPY packages/queue/package.json ./packages/queue/
COPY apps/llm-worker/package.json ./apps/llm-worker/

RUN bun install --filter 'llm-worker'

COPY apps/llm-worker ./apps/llm-worker
COPY packages/db ./packages/db
COPY packages/redis ./packages/redis
COPY packages/queue ./packages/queue

FROM deps AS build
RUN bun run llm-worker:build

FROM base AS release
COPY --from=build /app/apps/llm-worker/dist ./dist
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production

USER bun
EXPOSE 5002/tcp
ENTRYPOINT [ "bun", "run", "./dist/main.js" ]