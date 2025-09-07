# -------------------
# Build stage
# -------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Installer pnpm, typescript et dépendances globales
RUN npm install -g pnpm typescript

# Copier les fichiers de workspace pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copier le code source complet
COPY apps ./apps

# Builder l'API NestJS
WORKDIR /app/apps/api
RUN pnpm build

# Builder le frontend Next.js
WORKDIR /app
RUN pnpm --filter web build

# -------------------
# Production stage
# -------------------
FROM node:20-alpine
WORKDIR /app

# Copier le build du frontend et l'API compilée
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copier les node_modules
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

# Commande de démarrage (ici, le frontend Next.js)
CMD ["pnpm", "start"]
