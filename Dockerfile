# syntax=docker/dockerfile:1

FROM node:26.12.1-alpine3.24@sha256:40cd011b55415bc894e45b02fdd5a5dfde056921b7d23a64c74f80497af48797 AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN apk add --no-cache ca-certificates

FROM base AS deps

COPY package.json package-lock.json ./
COPY packages/braces ./packages/braces
RUN npm ci --ignore-scripts

FROM base AS builder

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

# Standalone Next.js starts with node and needs no package managers at runtime.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /opt/yarn-* /usr/local/bin/npm /usr/local/bin/npx \
    /usr/local/bin/yarn /usr/local/bin/yarnpkg /usr/local/bin/corepack \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/faro-sourcemaps ./.next/faro-sourcemaps

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
