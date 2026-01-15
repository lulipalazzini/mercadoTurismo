@echo off
echo Eliminando base de datos...
del database.sqlite
echo.
echo Ejecutando seeders...
npm run seed
echo.
echo Base de datos recreada con exito!
pause
