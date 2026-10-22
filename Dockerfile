# syntax=docker/dockerfile:1

FROM node:26.12.1-bookworm-slim@sha256:28147155d47dc31abe0a46e0d12b59b2fb3d0a2dcc5dc65fce76a074180b16fe AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS deps

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY packages/braces ./packages/braces
RUN npm ci --ignore-scripts

FROM base AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public

ARG NEXT_PUBLIC_FARO_ENABLED=false
ARG NEXT_PUBLIC_FARO_URL=
ARG NEXT_PUBLIC_FARO_API_KEY=
ARG NEXT_PUBLIC_FARO_APP_NAME=portfolio
ARG NEXT_PUBLIC_FARO_ENVIRONMENT=production
ENV NEXT_PUBLIC_FARO_ENABLED=${NEXT_PUBLIC_FARO_ENABLED} \
    NEXT_PUBLIC_FARO_URL=${NEXT_PUBLIC_FARO_URL} \
    NEXT_PUBLIC_FARO_API_KEY=${NEXT_PUBLIC_FARO_API_KEY} \
    NEXT_PUBLIC_FARO_APP_NAME=${NEXT_PUBLIC_FARO_APP_NAME} \
    NEXT_PUBLIC_FARO_ENVIRONMENT=${NEXT_PUBLIC_FARO_ENVIRONMENT}
RUN npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/faro-sourcemaps ./.next/faro-sourcemaps

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
