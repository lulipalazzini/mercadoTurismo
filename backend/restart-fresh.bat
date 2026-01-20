@echo off
echo ====================================
echo Reiniciando servidor con BD nueva
echo ====================================
echo.

echo Matando procesos Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Eliminando BD antigua...
cd "%~dp0"
if exist database.sqlite del database.sqlite
timeout /t 1 /nobreak >nul

echo Creando BD nueva...
node src/seeders/index.js

echo.
echo ====================================
echo Listo! Ahora ejecuta: npm run dev
echo ====================================
pause
