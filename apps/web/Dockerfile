# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les fichiers du workspace pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source du Web
COPY apps/web ./apps/web
RUN pnpm --filter web build

# Production stage
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "start"]
