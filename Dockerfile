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
RUN npm run build

# 📦 Etapa 2: producción
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
# Solo copio lo necesario de la etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

CMD ["npm", "run", "start"]
