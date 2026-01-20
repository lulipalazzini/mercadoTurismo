Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Arreglando base de datos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find and kill all node processes running on port 3001
Write-Host "Deteniendo procesos en puerto 3001..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($proc in $processes) {
        Write-Host "Matando proceso $proc" -ForegroundColor Yellow
        Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Delete the old database
Write-Host "Eliminando base de datos antigua..." -ForegroundColor Yellow
if (Test-Path "database.sqlite") {
    Remove-Item "database.sqlite" -Force
    Write-Host "✅ Base de datos eliminada" -ForegroundColor Green
} else {
    Write-Host "No se encontró database.sqlite" -ForegroundColor Gray
}

# Run seeders to create new database
Write-Host ""
Write-Host "Creando nueva base de datos..." -ForegroundColor Yellow
node src/seeders/index.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Proceso completado" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora ejecuta: npm run dev" -ForegroundColor Yellow
