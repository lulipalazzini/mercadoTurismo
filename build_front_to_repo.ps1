$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $root "frontend"
$distPath = Join-Path $frontendPath "dist"
$targetRepo = "M:\\PROYECTOS\\NACHO_LINUX\\front.mercadoturismo.ar"

if (!(Test-Path $frontendPath)) {
  throw "No existe la carpeta frontend: $frontendPath"
}

Push-Location $frontendPath
try {
  npm run build
} finally {
  Pop-Location
}

if (!(Test-Path $distPath)) {
  throw "No existe la carpeta dist: $distPath"
}

if (!(Test-Path $targetRepo)) {
  throw "No existe la carpeta destino: $targetRepo"
}

robocopy $distPath $targetRepo /MIR /XD .git /FFT /Z /R:2 /W:2 /NFL /NDL /NP /NJH /NJS | Out-Null
$rc = $LASTEXITCODE
if ($rc -gt 7) {
  throw "Robocopy fallo con codigo $rc"
}

Push-Location $targetRepo
try {
  git add .
  if (-not (git diff --cached --quiet)) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Build $ts"
    git push
  } else {
    Write-Host "Sin cambios para commitear."
  }
} finally {
  Pop-Location
}
