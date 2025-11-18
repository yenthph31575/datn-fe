# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS builder

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ENV NODE_ENV=production

RUN yarn build

# Stage 3: Production image
FROM base AS prod

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
USER nextjs

WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000
ENV PORT 3000

# run app
CMD ["node", "server.js"]
