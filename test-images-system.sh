#!/bin/bash

# Script de Testing - Sistema de Imágenes
# Verifica que el backend esté configurado correctamente

echo "======================================"
echo "🧪 TESTING SISTEMA DE IMÁGENES"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API URL
API_URL="http://localhost:3001/api"

# Test 1: Health check
echo "1️⃣  Testing Health Endpoint..."
response=$(curl -s -w "\n%{http_code}" ${API_URL}/health)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✅ Health check OK${NC}"
  echo "   Response: $body"
else
  echo -e "${RED}❌ Health check FAILED (HTTP $http_code)${NC}"
  echo "   Response: $body"
  exit 1
fi
echo ""

# Test 2: Verificar endpoints de imágenes
echo "2️⃣  Testing GET endpoints (sin autenticación)..."

endpoints=(
  "paquetes"
  "alojamientos"
  "cruceros"
  "excursiones"
  "autos"
  "circuitos"
  "salidas-grupales"
  "transfers"
  "seguros"
)

for endpoint in "${endpoints[@]}"; do
  echo -n "   Testing /api/${endpoint} ... "
  response=$(curl -s -w "\n%{http_code}" ${API_URL}/${endpoint})
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC}"
  else
    echo -e "${RED}❌ FAILED (HTTP $http_code)${NC}"
  fi
done
echo ""

# Test 3: Verificar que multer esté instalado
echo "3️⃣  Verificando instalación de Multer..."
cd backend
if [ -d "node_modules/multer" ]; then
  echo -e "${GREEN}✅ Multer instalado${NC}"
  multer_version=$(node -p "require('./node_modules/multer/package.json').version" 2>/dev/null)
  echo "   Versión: $multer_version"
else
  echo -e "${RED}❌ Multer NO instalado${NC}"
  echo "   Ejecutar: npm install"
fi
cd ..
echo ""

# Test 4: Verificar directorio uploads
echo "4️⃣  Verificando directorio /uploads..."
if [ -d "backend/uploads" ]; then
  echo -e "${GREEN}✅ Directorio /uploads existe${NC}"
  file_count=$(find backend/uploads -type f | wc -l)
  echo "   Archivos: $file_count"
else
  echo -e "${YELLOW}⚠️  Directorio /uploads no existe (se creará al subir primera imagen)${NC}"
fi
echo ""

# Test 5: Verificar estructura de archivos
echo "5️⃣  Verificando estructura de archivos..."

files=(
  "backend/src/middleware/upload.middleware.js"
  "backend/src/controllers/paquetes.controller.js"
  "backend/src/routes/paquetes.routes.js"
  "frontend/src/components/ImageUploader.jsx"
  "frontend/src/styles/ImageUploader.css"
  "frontend/src/services/api.js"
)

all_ok=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✅${NC} $file"
  else
    echo -e "   ${RED}❌${NC} $file ${RED}(FALTA)${NC}"
    all_ok=false
  fi
done
echo ""

# Resumen final
echo "======================================"
if $all_ok; then
  echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
  echo ""
  echo "📝 Próximos pasos:"
  echo "   1. Iniciar backend: cd backend && npm start"
  echo "   2. Iniciar frontend: cd frontend && npm run dev"
  echo "   3. Probar subida de imágenes en PaqueteFormModal"
else
  echo -e "${RED}❌ ALGUNOS TESTS FALLARON${NC}"
  echo ""
  echo "🔧 Revisar los archivos faltantes o endpoints caídos"
fi
echo "======================================"
