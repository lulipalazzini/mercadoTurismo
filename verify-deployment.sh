#!/bin/bash

# Script de verificación pre-deployment
# Ejecutar desde la raíz del proyecto: ./verify-deployment.sh

echo "🔍 Verificando configuración para deployment..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
ERRORS=0
WARNINGS=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
    else
        echo -e "${RED}✗${NC} $1 NO EXISTE"
        ((ERRORS++))
    fi
}

# Función para verificar contenido
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contiene: $2"
    else
        echo -e "${RED}✗${NC} $1 NO contiene: $2"
        ((ERRORS++))
    fi
}

# Verificar estructura de directorios
echo "📁 Verificando estructura de directorios..."
check_file "frontend/.env.production"
check_file "frontend/.htaccess"
check_file "frontend/vite.config.js"
check_file "backend/.env.production"
check_file "backend/.htaccess"
check_file "backend/app.js"
check_file "backend/src/index.js"
echo ""

# Verificar configuración frontend
echo "⚛️  Verificando configuración frontend..."
check_content "frontend/.env.production" "VITE_API_URL=https://api.mercadoturismo.ar/api"
check_content "frontend/src/config/api.config.js" "import.meta.env.VITE_API_URL"
echo ""

# Verificar configuración backend
echo "🔧 Verificando configuración backend..."
check_content "backend/.env.production" "NODE_ENV=production"
check_content "backend/.env.production" "FRONTEND_URL=https://mercadoturismo.ar"
check_content "backend/src/index.js" "allowedOrigins"
check_content "backend/src/index.js" "app.use(cors(corsOptions))"
echo ""

# Verificar que no haya rutas hardcodeadas problemáticas
echo "🔍 Verificando rutas hardcodeadas..."
if grep -r "localhost:3001" frontend/src --exclude-dir=node_modules | grep -v "api.config.js" | grep -v "// " > /dev/null; then
    echo -e "${RED}✗${NC} Encontradas referencias a localhost:3001 en frontend/src"
    grep -rn "localhost:3001" frontend/src --exclude-dir=node_modules | grep -v "api.config.js" | grep -v "// "
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} No hay referencias problemáticas a localhost en frontend"
fi
echo ""

# Verificar .htaccess
echo "🌐 Verificando .htaccess..."
check_content "frontend/.htaccess" "RewriteEngine On"
check_content "backend/.htaccess" "PassengerEnabled On"
check_content "backend/.htaccess" "PassengerAppType node"
check_content "backend/.htaccess" "PassengerStartupFile app.js"
echo ""

# Verificar archivos sensibles en .gitignore
echo "🔒 Verificando .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q ".env" ".gitignore"; then
        echo -e "${GREEN}✓${NC} .env está en .gitignore"
    else
        echo -e "${YELLOW}⚠${NC}  .env NO está en .gitignore"
        ((WARNINGS++))
    fi
fi
echo ""

# Resumen
echo "================================================"
echo "Resumen de verificación:"
echo "================================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ Todo está OK - Listo para deployment${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS advertencias encontradas${NC}"
    echo "Revisar las advertencias antes de continuar"
    exit 0
else
    echo -e "${RED}✗ $ERRORS errores encontrados${NC}"
    echo -e "${YELLOW}⚠ $WARNINGS advertencias encontradas${NC}"
    echo ""
    echo "Por favor corregir los errores antes de hacer deployment"
    exit 1
fi
