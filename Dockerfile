# ----------------------------
# Build stage
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Installer pnpm et typescript globalement
RUN npm install -g pnpm typescript

# Copier le workspace pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer toutes les dépendances (dev incluses)
RUN pnpm install --frozen-lockfile --prod=false

# Copier le code source du monorepo
COPY apps ./apps
COPY libs ./libs

# ----------------------------
# Builder l'API (NestJS)
# ----------------------------
WORKDIR /app/apps/api
RUN pnpm build

# ----------------------------
# Builder le frontend (Next.js)
# ----------------------------
WORKDIR /app
RUN pnpm --filter web build

# ----------------------------
# Production stage
# ----------------------------
FROM node:20-alpine AS production
WORKDIR /app

# Installer pnpm pour démarrer l'app en production
RUN npm install -g pnpm

# Copier uniquement ce qui est nécessaire
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Variables d'environnement
ENV NODE_ENV=production
EXPOSE 3000

# Commande par défaut pour Render
CMD ["pnpm", "--filter", "web", "start"]
