#!/bin/bash
# Script de diagnóstico rápido para WNPower/Passenger
# Ejecutar: bash diagnose-passenger.sh

echo "🔍 DIAGNÓSTICO DE PASSENGER - MERCADO TURISMO"
echo "=============================================="
echo ""

# 1. Verificar directorio actual
echo "📁 Directorio actual:"
pwd
echo ""

# 2. Verificar que estamos en backend
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: No se encontró package.json"
    echo "   Debes ejecutar este script desde la carpeta backend/"
    exit 1
fi
echo "✅ En directorio correcto"
echo ""

# 3. Verificar archivo .env
echo "🔒 Verificando .env:"
if [ ! -f ".env" ]; then
    echo "❌ ERROR CRÍTICO: No existe archivo .env"
    echo ""
    echo "SOLUCIÓN:"
    echo "==========="
    echo "1. Crear archivo .env:"
    echo "   nano .env"
    echo ""
    echo "2. Agregar este contenido:"
    echo "   PORT=3001"
    echo "   JWT_SECRET=mercado_turismo_secret_key_2026_super_seguro"
    echo "   NODE_ENV=production"
    echo "   FRONTEND_URL=https://mercadoturismo.ar"
    echo ""
    echo "3. Guardar (Ctrl+X, Y, Enter)"
    echo "4. Reiniciar: touch tmp/restart.txt"
    exit 1
else
    echo "✅ Archivo .env existe"
    echo ""
    echo "Contenido de .env:"
    echo "-------------------"
    cat .env
    echo "-------------------"
    echo ""
    
    # Verificar JWT_SECRET
    if grep -q "JWT_SECRET=" .env; then
        echo "✅ JWT_SECRET configurado"
    else
        echo "❌ ERROR: Falta JWT_SECRET en .env"
        exit 1
    fi
    
    # Verificar NODE_ENV
    if grep -q "NODE_ENV=" .env; then
        echo "✅ NODE_ENV configurado"
    else
        echo "⚠️  ADVERTENCIA: Falta NODE_ENV en .env"
    fi
fi
echo ""

# 4. Verificar node_modules
echo "📦 Verificando node_modules:"
if [ ! -d "node_modules" ]; then
    echo "❌ ERROR: No existe node_modules"
    echo "   Ejecuta: npm install --production"
    exit 1
else
    echo "✅ node_modules existe"
fi
echo ""

# 5. Verificar archivos críticos
echo "📄 Verificando archivos críticos:"
CRITICAL_FILES=("app.js" ".htaccess" "src/index.js")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ FALTA: $file"
    fi
done
echo ""

# 6. Verificar .htaccess
echo "⚙️  Verificando .htaccess:"
if [ -f ".htaccess" ]; then
    if grep -q "PassengerEnabled On" .htaccess; then
        echo "✅ Passenger habilitado"
    else
        echo "❌ ERROR: .htaccess no tiene PassengerEnabled On"
    fi
    
    if grep -q "PassengerStartupFile app.js" .htaccess; then
        echo "✅ Startup file configurado"
    else
        echo "❌ ERROR: .htaccess no especifica app.js"
    fi
else
    echo "❌ ERROR: No existe .htaccess"
fi
echo ""

# 7. Verificar base de datos
echo "🗄️  Verificando base de datos:"
if [ -f "database.sqlite" ]; then
    echo "✅ database.sqlite existe"
    ls -lh database.sqlite
else
    echo "⚠️  database.sqlite no existe (se creará al iniciar)"
fi
echo ""

# 8. Verificar directorio tmp
echo "📁 Verificando directorio tmp:"
if [ ! -d "tmp" ]; then
    echo "⚠️  Directorio tmp no existe, creando..."
    mkdir -p tmp
    echo "✅ Directorio tmp creado"
else
    echo "✅ Directorio tmp existe"
fi
echo ""

# 9. Reiniciar Passenger
echo "♻️  Reiniciando Passenger..."
touch tmp/restart.txt
echo "✅ Señal de restart enviada"
echo ""

# 10. Instrucciones finales
echo "=============================================="
echo "📝 PRÓXIMOS PASOS"
echo "=============================================="
echo ""
echo "1. Espera 30-60 segundos para que Passenger inicie"
echo ""
echo "2. Prueba el health check DESDE TU DOMINIO:"
echo "   curl https://mercadoturismo.ar/api/health"
echo ""
echo "3. O desde tu navegador:"
echo "   https://mercadoturismo.ar/api/health"
echo ""
echo "4. Si ves HTML en lugar de JSON, revisa los logs:"
echo "   tail -50 ~/logs/error_log"
echo "   tail -50 ~/logs/mercadoturismo.ar/http/error_log"
echo ""
echo "5. Para ver logs de Passenger:"
echo "   tail -50 ~/passenger.log"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   En WNPower con Passenger, NO uses 'npm start'"
echo "   Passenger inicia automáticamente cuando alguien"
echo "   accede a tu dominio (mercadoturismo.ar)"
echo ""
echo "=============================================="
