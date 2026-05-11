FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/redis/package.json ./packages/redis/
COPY packages/queue/package.json ./packages/queue/
COPY apps/api/package.json ./apps/api/

RUN bun install --filter 'api'

COPY apps/api ./apps/api
COPY packages/auth ./packages/auth
COPY packages/db ./packages/db
COPY packages/redis ./packages/redis
COPY packages/queue ./packages/queue

FROM deps AS build
RUN bun run api:build

FROM base AS release
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production

USER bun
EXPOSE 5000/tcp
ENTRYPOINT ["bun", "run", "./dist/main.js"]