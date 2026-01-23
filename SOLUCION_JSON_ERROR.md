# 🔧 Solución: Error "Cannot preview as JSON" en WNPower

## 🎯 Problema
El backend devuelve HTML en lugar de JSON, causando el error:
```
Cannot preview as JSON
Invalid JSON format: Unexpected token '<', "<!doctype "... is not valid JSON
```

## ✅ Solución Implementada

### 1. Backend Configurado para Siempre Devolver JSON

**Cambios en `backend/src/index.js`:**
- ✅ Middleware que fuerza `Content-Type: application/json` en todas las respuestas
- ✅ Catch-all para rutas 404 que devuelve JSON (no HTML)
- ✅ Manejo de errores mejorado que siempre devuelve JSON
- ✅ Logging detallado de todas las requests y errores

### 2. Controllers con Validaciones Extras

**Cambios en `backend/src/controllers/paquetes.controller.js`:**
- ✅ Validación del objeto `res` antes de usarlo
- ✅ `return` explícito en todas las respuestas JSON
- ✅ Status codes explícitos (200, 500, etc.)
- ✅ Formato de error consistente con timestamps

### 3. Configuración de WNPower Mejorada

**Archivo `backend/.htaccess` actualizado con:**
```apache
# Forzar Content-Type JSON
<IfModule mod_headers.c>
    <FilesMatch "\.(json)$">
        Header set Content-Type "application/json; charset=utf-8"
    </FilesMatch>
</IfModule>

# Reescritura de URLs
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://127.0.0.1:3001/$1 [P,L]
</IfModule>
```

### 4. Entry Point para Passenger Mejorado

**Archivo `backend/app.js` actualizado:**
- ✅ Logging del inicio de la aplicación
- ✅ Try-catch para capturar errores de startup
- ✅ Información de diagnóstico (Node version, working directory)

## 🚀 Pasos para Deployar en WNPower

### Paso 1: Verificar Variables de Entorno en cPanel
```bash
NODE_ENV=production
JWT_SECRET=tu_secret_key_segura_aqui
FRONTEND_URL=https://mercadoturismo.ar
PORT=3001
```

### Paso 2: Configurar Node.js App en cPanel
1. Ir a "Setup Node.js App"
2. Node.js version: 18.x o superior
3. Application mode: Production
4. Application root: `/home/USERNAME/backend`
5. Application URL: Tu dominio/subdominio
6. Application startup file: `app.js`
7. Presiona "Create"

### Paso 3: Instalar Dependencias
Desde el terminal SSH de cPanel:
```bash
cd ~/backend
npm install --production
```

### Paso 4: Verificar Logs
Los logs estarán en:
- cPanel: "Setup Node.js App" → Ver logs
- O en: `~/logs/stderr.log` y `~/logs/stdout.log`

### Paso 5: Probar la API
```bash
# Desde el terminal SSH
curl -i https://tudominio.com/api/paquetes

# Debe devolver:
# Content-Type: application/json
# [{"id":1,"nombre":"Paquete..."}, ...]
```

## 🔍 Cómo Verificar que Funciona

### Test 1: Verificar Content-Type
```bash
curl -I https://tudominio.com/api/paquetes
```
**Esperado:** 
```
HTTP/1.1 200 OK
Content-Type: application/json
```

### Test 2: Verificar Respuesta JSON
```bash
curl https://tudominio.com/api/paquetes | jq
```
**Esperado:** Array de paquetes en JSON válido

### Test 3: Verificar Rutas 404
```bash
curl https://tudominio.com/api/ruta-que-no-existe
```
**Esperado:**
```json
{
  "message": "Ruta no encontrada",
  "path": "/api/ruta-que-no-existe",
  "method": "GET",
  "timestamp": "2026-01-23T..."
}
```

## 🐛 Debugging en WNPower

### Ver Logs en Tiempo Real
```bash
tail -f ~/logs/stderr.log
```

Ahora verás logs detallados como:
```
============================================================
📥 [2026-01-23T19:03:56.173Z] GET /api/paquetes
   IP: 123.45.67.89
   Headers: {...}
============================================================

🎄 [PAQUETES] Obteniendo todos los paquetes...
   Paquetes encontrados: 15
✅ [PAQUETES] Paquetes obtenidos exitosamente
```

### Script de Diagnóstico
```bash
cd ~/backend
node diagnose.js
```

Esto mostrará:
- ✅ Versión de Node.js
- ✅ Archivos presentes
- ✅ Variables de entorno
- ✅ Conexión a base de datos
- ✅ Tablas disponibles
- ✅ Modelos cargados

## ❌ Errores Comunes y Soluciones

### Error 1: "Cannot preview as JSON"
**Causa:** Servidor devolviendo HTML
**Solución:** 
- Verificar que Passenger esté iniciando correctamente
- Ver logs en `~/logs/stderr.log`
- Asegurar que `app.js` está como startup file

### Error 2: 502 Bad Gateway
**Causa:** Node.js no está corriendo
**Solución:**
- Reiniciar la app desde cPanel "Setup Node.js App"
- Verificar que el puerto en .env coincida con el de Passenger

### Error 3: CORS errors
**Causa:** FRONTEND_URL mal configurada
**Solución:**
- Verificar variable de entorno `FRONTEND_URL`
- Asegurar que coincide con el dominio del frontend

### Error 4: Database errors
**Causa:** database.sqlite no existe o no tiene permisos
**Solución:**
```bash
cd ~/backend
chmod 644 database.sqlite
# O crear nueva BD
npm run seed
```

## 📊 Monitoring

Con los cambios implementados, ahora puedes:

1. **Ver cada request** con todos sus detalles
2. **Identificar exactamente** dónde falla una operación
3. **Ver queries SQL** ejecutadas
4. **Tracking completo** de autenticación
5. **Stack traces completos** de errores

## 🎯 Próximos Pasos

1. ✅ Deployar el código actualizado en WNPower
2. ✅ Verificar logs en tiempo real
3. ✅ Probar endpoints con curl/Postman
4. ✅ Verificar que el frontend recibe JSON válido
5. ✅ Monitorear logs para cualquier error nuevo

---

## 📝 Notas Importantes

- **Todos los endpoints ahora devuelven JSON**, incluso en caso de error
- **No más páginas HTML de error**
- **Logging completo** para debugging en producción
- **Content-Type JSON forzado** en todas las respuestas
- **Manejo de errores consistente** con timestamps
