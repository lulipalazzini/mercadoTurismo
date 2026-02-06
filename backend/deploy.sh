#!/bin/bash
# Script de deployment rápido para WNPower
# Ejecutar en el servidor: bash deploy.sh

echo "🚀 DEPLOYMENT EN WNPOWER - MERCADO TURISMO"
echo "=========================================="

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "   Ejecuta este script desde la carpeta backend/"
    exit 1
fi

echo "✅ Directorio correcto"

# 2. Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install --production --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"

# 3. Verificar .env
echo ""
echo "🔒 Verificando archivo .env..."
if [ ! -f ".env" ]; then
    echo "⚠️  ADVERTENCIA: No se encontró archivo .env"
    echo ""
    echo "DEBES CREAR EL ARCHIVO .env CON:"
    echo "================================"
    echo "PORT=3001"
    echo "JWT_SECRET=<genera_un_secret_seguro>"
    echo "NODE_ENV=production"
    echo "FRONTEND_URL=https://mercadoturismo.ar"
    echo ""
    echo "Para generar JWT_SECRET ejecuta:"
    echo "node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    echo ""
    read -p "¿Quieres crear el archivo .env ahora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Generar JWT_SECRET
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
        
        # Crear .env
        cat > .env << EOF
PORT=3001
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
FRONTEND_URL=https://mercadoturismo.ar
EOF
        echo "✅ Archivo .env creado"
    else
        echo "⚠️  Debes crear .env manualmente antes de continuar"
        exit 1
    fi
else
    echo "✅ Archivo .env existe"
    
    # Verificar que tenga JWT_SECRET
    if ! grep -q "JWT_SECRET=" .env; then
        echo "❌ Error: .env no contiene JWT_SECRET"
        exit 1
    fi
    
    echo "✅ JWT_SECRET configurado"
fi

# 4. Crear directorio de base de datos si no existe
echo ""
echo "🗄️  Configurando base de datos..."
if [ ! -f "database.sqlite" ]; then
    touch database.sqlite
    chmod 666 database.sqlite
    echo "✅ Base de datos creada"
else
    echo "✅ Base de datos existe"
fi

# 5. Crear directorio de uploads
echo ""
echo "📁 Configurando directorio de uploads..."
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    chmod 755 uploads
    echo "✅ Directorio uploads creado"
else
    echo "✅ Directorio uploads existe"
fi

# 6. Crear directorio tmp para Passenger
echo ""
echo "🔄 Configurando Passenger..."
if [ ! -d "tmp" ]; then
    mkdir -p tmp
    echo "✅ Directorio tmp creado"
else
    echo "✅ Directorio tmp existe"
fi

# 7. Reiniciar Passenger
echo ""
echo "♻️  Reiniciando aplicación..."
touch tmp/restart.txt
echo "✅ Restart signal enviado a Passenger"

# 8. Verificar que todo está correcto
echo ""
echo "🧪 Verificando deployment..."
sleep 3

# Test health check
echo "Testing health check endpoint..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Health check OK (HTTP 200)"
else
    echo "⚠️  Health check devolvió HTTP $HEALTH_CHECK"
    echo "   Esto es normal si Passenger aún está iniciando"
    echo "   Espera 30-60 segundos y verifica: https://mercadoturismo.ar/api/health"
fi

# Resumen final
echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETADO"
echo "=========================================="
echo ""
echo "📝 Verificaciones finales:"
echo "   1. Visita: https://mercadoturismo.ar/api/health"
echo "      Debe devolver: {\"success\": true, \"status\": \"OK\"}"
echo ""
echo "   2. Prueba el login desde el frontend"
echo ""
echo "   3. Si hay errores, revisa los logs:"
echo "      tail -f ~/logs/error_log"
echo "      tail -f ~/passenger.log"
echo ""
echo "💡 Para actualizaciones futuras:"
echo "   git pull"
echo "   npm install --production"
echo "   touch tmp/restart.txt"
echo ""
echo "=========================================="
