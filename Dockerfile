# 📦 Etapa 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalo dependencias primero (mejor para cache)
COPY package*.json ./
RUN npm install

# Copio todo el código y build
COPY . .

ARG NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID}
ARG NEXT_PUBLIC_CMS_TYPE
ENV NEXT_PUBLIC_CMS_TYPE=${NEXT_PUBLIC_CMS_TYPE}
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN npm run build

# 📦 Etapa 2: producción
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Configuro las variables de entorno necesarias para Next.js
ENV NEXT_PUBLIC_SANITY_DATASET=production
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=dvhf52ob
ENV NEXT_PUBLIC_CMS_TYPE=sanity

# Solo copio lo necesario de la etapa anterior para standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expongo el puerto
EXPOSE 3000

# Configuro Next.js para escuchar en todas las interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "server.js"]
