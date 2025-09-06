# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les fichiers du workspace pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copier le code source de l'API
COPY apps/api ./apps/api
RUN pnpm --filter api build

# Production stage
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]
