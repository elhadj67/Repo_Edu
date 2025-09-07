# -------------------
# Build stage
# -------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Installer pnpm et typescript globalement
RUN npm install -g pnpm typescript

# Copier les fichiers principaux du workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer toutes les dépendances, incluant devDependencies
RUN pnpm install --frozen-lockfile --prod=false

# Approuver automatiquement les builds pour Prisma, NestJS, bcrypt, etc.
RUN pnpm approve-builds --all

# Copier tout le code source
COPY apps ./apps

# Installer les types manquants pour TypeScript
RUN pnpm add -D @types/cookie-parser @types/node

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

# Copier le build du frontend
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Copier le build de l'API
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copier les node_modules
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

# Démarrage du frontend Next.js
CMD ["pnpm", "start"]
