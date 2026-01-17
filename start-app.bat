@echo off
echo ====================================
echo   Iniciando Mercado Turismo
echo ====================================
echo.

REM Verificar que Node.js este instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado o no esta en el PATH
    pause
    exit /b 1
)

echo [INFO] Iniciando Backend...
start "Backend - Mercado Turismo" cmd /k "cd /d "%~dp0backend" && npm run dev"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

echo [INFO] Iniciando Frontend...
start "Frontend - Mercado Turismo" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ====================================
echo   Aplicacion iniciada!
echo ====================================
echo.
echo Backend: Se abrira en una ventana separada
echo Frontend: Se abrira en una ventana separada
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo (Las ventanas de Backend y Frontend seguiran abiertas)
pause >nul
