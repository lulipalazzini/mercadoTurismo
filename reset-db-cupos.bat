@echo off
echo ========================================
echo Reseteando base de datos con nuevos modelos
echo ========================================
echo.

cd backend
echo Ejecutando seed para resetear...
node -e "import('./src/seeders/index.js').then(m => m.runAllSeeders().then(() => console.log('✅ Database reset complete!')).catch(e => { console.error('❌ Error:', e); process.exit(1); }))"

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause
