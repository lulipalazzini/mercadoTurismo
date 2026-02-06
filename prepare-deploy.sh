#!/bin/bash

# Script para preparar el proyecto para deploy en WNPower
# Ejecutar desde la raíz del proyecto

echo "================================"
echo "🚀 PREPARANDO DEPLOY A WNPOWER"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que estamos en la raíz del proyecto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Debes ejecutar este script desde la raíz del proyecto${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Paso 1: Verificando dependencias del backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "   Instalando dependencias..."
    npm install
else
    echo "   ✅ Dependencias ya instaladas"
fi
cd ..

echo ""
echo -e "${YELLOW}📦 Paso 2: Instalando y building frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "   Instalando dependencias..."
    npm install
fi

echo "   Building para producción..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✅ Build completado exitosamente${NC}"
else
    echo -e "   ${RED}❌ Error en el build del frontend${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${YELLOW}📁 Paso 3: Preparando archivos para subir...${NC}"

# Crear carpeta de deploy
mkdir -p deploy-wnpower
mkdir -p deploy-wnpower/backend
mkdir -p deploy-wnpower/frontend

# Copiar backend (sin node_modules ni archivos de desarrollo)
echo "   Copiando backend..."
rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='database.sqlite' \
          --exclude='*.log' \
          --exclude='uploads/*' \
          backend/ deploy-wnpower/backend/

# Copiar frontend build
echo "   Copiando frontend build..."
cp -r frontend/dist/* deploy-wnpower/frontend/

# Copiar archivo .htaccess del frontend si existe
if [ -f "frontend/.htaccess" ]; then
    cp frontend/.htaccess deploy-wnpower/frontend/
fi

echo ""
echo -e "${GREEN}✅ Preparación completada${NC}"
echo ""
echo "================================"
echo "📋 SIGUIENTES PASOS:"
echo "================================"
echo ""
echo "1️⃣  Subir archivos al servidor:"
echo "   - Subir contenido de 'deploy-wnpower/backend/' a '/home/mercadoturismo/backend/'"
echo "   - Subir contenido de 'deploy-wnpower/frontend/' a '/home/mercadoturismo/public_html/'"
echo ""
echo "2️⃣  Conectar por SSH y ejecutar:"
echo "   cd /home/mercadoturismo/backend"
echo "   npm install --production"
echo ""
echo "3️⃣  Crear archivo .env en el servidor:"
echo "   Copiar 'backend/.env.production' y ajustar valores"
echo "   ⚠️  IMPORTANTE: Generar nuevo JWT_SECRET seguro"
echo ""
echo "4️⃣  Verificar .htaccess en backend:"
echo "   Debe estar en '/home/mercadoturismo/backend/.htaccess'"
echo "   Verificar PassengerAppRoot con la ruta correcta"
echo ""
echo "5️⃣  Reiniciar Passenger:"
echo "   mkdir -p tmp && touch tmp/restart.txt"
echo ""
echo "6️⃣  Verificar que funciona:"
echo "   https://mercadoturismo.ar/api"
echo ""
echo -e "${YELLOW}📖 Para más detalles, revisar: DEPLOY_WNPOWER.md${NC}"
echo ""
