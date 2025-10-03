#!/bin/bash

# Script para construir y probar el container Docker

echo "🐳 Construyendo imagen Docker..."

docker build \
  --build-arg NEXT_PUBLIC_SANITY_DATASET=production \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=dvhf52ob \
  --build-arg NEXT_PUBLIC_CMS_TYPE=sanity \
  --build-arg NEXT_PUBLIC_SITE_URL=https://joel.comandita.xyz \
  -t joel-photography:latest .

echo "✅ Imagen construida exitosamente"

echo "🚀 Para probar localmente, ejecuta:"
echo "docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 joel-photography:latest"