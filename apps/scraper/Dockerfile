FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/
COPY apps/scraper/package.json ./apps/scraper/

RUN bun install --filter 'scraper'

COPY apps/scraper ./apps/scraper
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue

FROM deps AS build
RUN bun run scraper:build

FROM base AS release
COPY --from=build /app/apps/scraper/dist ./dist
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production

USER bun
EXPOSE 5003/tcp
ENTRYPOINT [ "bun", "run", "./dist/main.js" ]