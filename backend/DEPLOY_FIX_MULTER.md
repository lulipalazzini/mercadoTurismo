# FIX: Error "Cannot find module 'multer'" en Passenger/cPanel

## PROBLEMA RESUELTO

El backend crasheaba en producción con `MODULE_NOT_FOUND: multer` porque:

1. **Passenger/cPanel no resolvía correctamente node_modules**
2. **Multer no estaba en dependencies** del package.json

## CAMBIOS APLICADOS

### 1. app.js - Fix de NODE_PATH (CRÍTICO)

```javascript
// Al INICIO del archivo, ANTES de cualquier require()
process.env.NODE_PATH = __dirname + "/node_modules";
require("module").Module._initPaths();
```

**Por qué:** Passenger a veces no puede resolver módulos locales. Este fix fuerza explícitamente la ruta de node_modules.

### 2. package.json - Multer agregado a dependencies

```json
"dependencies": {
  "multer": "^1.4.5-lts.1",
  // ... otros paquetes
}
```

**Por qué:** Multer estaba siendo usado pero no estaba declarado, causando MODULE_NOT_FOUND en producción.

## DEPLOYMENT EN WNPOWER/cPANEL

### Paso 1: Subir cambios al servidor

```bash
# En tu máquina local (Git Bash/PowerShell)
cd c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend
git add app.js package.json
git commit -m "Fix: MODULE_NOT_FOUND multer en Passenger/cPanel"
git push origin main
```

### Paso 2: Actualizar en el servidor

```bash
# SSH al servidor
cd /home/mercad25/backend
git pull origin main

# Reinstalar dependencias (ahora incluye multer)
rm -rf node_modules
npm install --production

# Verificar que multer esté instalado
ls -la node_modules/multer

# Reiniciar Passenger
rm -rf tmp && mkdir tmp
touch tmp/restart.txt
```

### Paso 3: Verificar que funcione

```bash
# Esperar 30 segundos a que Passenger reinicie
sleep 30

# Probar endpoint
curl -X GET https://mercadoturismo.ar/api/health

# Debería responder JSON con status OK, NO error 500
```

## RESULTADO ESPERADO

✅ **Antes del fix:**

```
Error: Cannot find module 'multer'
ERR_CONNECTION_CLOSED
500 Internal Server Error
```

✅ **Después del fix:**

```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-02-05T..."
}
```

## DIAGNÓSTICO SI SIGUE FALLANDO

Si aún hay errores 500 después del deployment:

```bash
# Ver logs de Passenger
tail -50 /home/mercad25/logs/passenger.log

# Ver logs de errores HTTP
tail -50 /home/mercad25/logs/mercadoturismo.ar/http/error_log

# Verificar que multer esté realmente instalado
cd /home/mercad25/backend
npm list multer
# Debe mostrar: multer@1.4.5-lts.1

# Verificar NODE_PATH
cd /home/mercad25/backend
node -e "console.log(require.resolve('multer'))"
# Debe mostrar: /home/mercad25/backend/node_modules/multer/...
```

## ARCHIVOS MODIFICADOS

- ✅ `backend/app.js` - NODE_PATH fix al inicio
- ✅ `backend/package.json` - multer en dependencies
- ℹ️ `backend/src/middleware/upload.middleware.js` - Sin cambios (ya estaba bien)

## COMPATIBILIDAD

Este fix es específico para:

- Node.js + Phusion Passenger + cPanel
- También funciona en otros entornos de hosting compartido
- No afecta el funcionamiento en desarrollo local

---

**Fecha:** 2026-02-05  
**Autor:** GitHub Copilot  
**Solución:** MODULE_NOT_FOUND en Passenger
