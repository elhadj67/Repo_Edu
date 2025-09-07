# =========================
# Étape 1 : Builder
# =========================
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Installer pnpm et typescript globalement
RUN npm install -g pnpm typescript

# Copier fichiers de configuration pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Installer toutes les dépendances
RUN pnpm install

# Copier tout le code
COPY . .

# Définir la variable d'environnement pour Prisma
ARG DB_URL
ENV DB_URL=$DB_URL

# Générer le client Prisma
RUN npx prisma generate

# Builder l'API NestJS
WORKDIR /app/apps/api
RUN pnpm build

# =========================
# Étape 2 : Production
# =========================
FROM node:20-alpine AS prod

WORKDIR /app

# Copier uniquement ce qui est nécessaire pour la prod
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Définir les variables d'environnement pour la prod
ARG DB_URL
ENV DB_URL=$DB_URL

# Exposer le port de l'API
EXPOSE 3001

# Lancer l'application
CMD ["node", "apps/api/dist/main.js"]
