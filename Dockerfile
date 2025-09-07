# -------------------------------
# Build Stage
# -------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Installer pnpm et typescript globalement pour builder l'API
RUN npm install -g pnpm typescript

# Copier les fichiers du workspace pour tout le monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer toutes les dépendances (incluant devDependencies pour tsc)
RUN pnpm install --frozen-lockfile --prod=false

# Copier tout le code source
COPY apps ./apps

# Builder l'API (NestJS / Node)
WORKDIR /app/apps/api
RUN pnpm build

# Builder le frontend (Next.js)
WORKDIR /app/apps/web
RUN pnpm build

# -------------------------------
# Production Stage
# -------------------------------
FROM node:20-alpine
WORKDIR /app

# Copier uniquement ce qui est nécessaire pour la prod
COPY --from=builder /app/node_modules ./node_modules

# Copier le build du frontend
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Copier le build de l'API
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Définir l'environnement
ENV NODE_ENV=production
EXPOSE 3000 4000

# Démarrer les deux apps en parallèle (API + Web)
CMD ["sh", "-c", "cd apps/api && pnpm start & cd ../web && pnpm start"]
