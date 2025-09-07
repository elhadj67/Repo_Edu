# ===========================
# Stage 1: Builder
# ===========================
FROM node:20-alpine AS builder

WORKDIR /app

# Installer pnpm et TypeScript globalement
RUN npm install -g pnpm typescript

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer toutes les dépendances
RUN pnpm install

# Copier tout le code source
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Builder API NestJS
WORKDIR /app/apps/api
RUN pnpm build

# Builder Frontend Next.js
WORKDIR /app/apps/web
RUN pnpm build

# ===========================
# Stage 2: Production
# ===========================
FROM node:20-alpine

WORKDIR /app

# Copier tout ce qui est nécessaire depuis le builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Installer un serveur pour lier Next.js et API sur le même service
# Ici, on va utiliser `concurrently` pour démarrer les deux serveurs
RUN pnpm add -g concurrently

# Exposer les ports nécessaires
EXPOSE 3000 3001

# CMD pour lancer Next.js et NestJS simultanément
CMD ["concurrently", "--kill-others-on-fail", "\"node apps/api/dist/main.js\"", "\"next start apps/web -p 3000\""]
