FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS prerelease
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/
COPY apps/scraper/package.json ./apps/scraper/

RUN bun install --filter 'scraper'

COPY apps/scraper ./apps/scraper
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue

FROM base AS release
COPY --from=prerelease /app ./
ENV NODE_ENV=production

USER bun
EXPOSE 5003/tcp
ENTRYPOINT [ "bun", "run", "scraper:start" ]