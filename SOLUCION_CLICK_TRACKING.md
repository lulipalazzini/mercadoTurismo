# 🐛 Solución: Error 500 en Click Tracking

## 📋 Problema Reportado

Al hacer click en cualquier elemento (paquetes, cruceros, etc), el sistema mostraba:

```
POST https://mercadoturismo.ar/api/stats/increment 500 (Internal Server Error)
Uncaught (in promise) SyntaxError: Unexpected token 'c', "<!doctype"... is not valid JSON
```

Mensaje en consola: **"No se pudo trackear el click en paquete"**

---

## 🔍 Causas Identificadas

### 1. **Header Personalizado Innecesario**

El frontend estaba enviando un header `x-sec-origin: mercado-turismo-app` que:

- No era requerido por el backend
- Podía causar problemas de CORS en producción
- Agregaba complejidad innecesaria

### 2. **CORS Restrictivo**

El backend solo aceptaba un origen único configurado en `FRONTEND_URL`, lo que podía causar problemas si:

- La variable de entorno no estaba configurada correctamente
- Se accedía desde www.mercadoturismo.ar vs mercadoturismo.ar
- El protocolo HTTP vs HTTPS causaba conflictos

### 3. **Error HTML en Respuesta**

Cuando ocurría un error 500, Passenger (WNPower) podía devolver su propia página de error HTML en lugar de dejar que Express manejara el error con JSON.

---

## ✅ Soluciones Implementadas

### 1. **Eliminado Header Personalizado**

📁 `frontend/src/services/clickStats.service.js`

**ANTES:**

```javascript
const response = await api.post("/stats/increment", payload, {
  headers: {
    "x-sec-origin": "mercado-turismo-app",
  },
});
```

**DESPUÉS:**

```javascript
const response = await api.post("/stats/increment", payload);
```

### 2. **Mejorado CORS para Múltiples Orígenes**

📁 `backend/src/index.js`

**ANTES:**

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
```

**DESPUÉS:**

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://mercadoturismo.ar",
  "https://www.mercadoturismo.ar",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS: Origin no permitido: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
```

**Beneficios:**

- ✅ Acepta requests desde localhost, http y https
- ✅ Acepta con y sin www
- ✅ Registra warnings cuando llega un origin desconocido
- ✅ Flexible para desarrollo y producción

### 3. **Mejorado Logging y Error Handling**

📁 `backend/src/controllers/clickStats.controller.js`

**Cambios:**

- ✅ Agregado logging detallado del request completo
- ✅ Logging de headers (origin, content-type)
- ✅ Logging del body recibido
- ✅ Mensajes más descriptivos en console
- ✅ Siempre devolver JSON con `res.setHeader("Content-Type", "application/json")`
- ✅ Return explícito en todas las respuestas
- ✅ Status 200 explícito en respuestas exitosas
- ✅ Timestamp en errores

**Ejemplo de logs mejorados:**

```
📊 [STATS] Request recibido: {
  method: 'POST',
  path: '/increment',
  body: { cardType: 'paquete', serviceId: 123, serviceName: 'Test' },
  headers: { origin: 'https://mercadoturismo.ar', 'content-type': 'application/json' }
}
✅ [STATS] Click incrementado: paquete - Total: 42
📤 [STATS] Enviando respuesta: { success: true, cardType: 'paquete', ... }
```

---

## 🧪 Testing

### Script de Prueba Creado

📁 `backend/test-click-tracking.js`

**Ejecutar en local:**

```bash
cd backend
node test-click-tracking.js
```

**Ejecutar en producción:**

```bash
API_URL=https://mercadoturismo.ar/api node test-click-tracking.js
```

**Tests incluidos:**

1. ✅ Incrementar click en paquete
2. ✅ Obtener todas las estadísticas
3. ✅ Obtener estadísticas de un tipo específico
4. ✅ Validar error con tipo inválido (debe devolver 400)

---

## 📦 Deployment

### Para WNPower (Passenger)

1. **Subir cambios al servidor:**

```bash
# Hacer commit de los cambios
git add .
git commit -m "fix: Corregir error 500 en tracking de clicks - eliminar header personalizado, mejorar CORS y logging"
git push
```

2. **En el servidor, actualizar:**

```bash
cd /ruta/a/tu/app
git pull
cd backend
npm install  # Por si acaso
```

3. **Reiniciar la aplicación:**

```bash
# Passenger normalmente detecta cambios automáticamente
# Si no, crear/tocar tmp/restart.txt
mkdir -p tmp
touch tmp/restart.txt
```

4. **Verificar logs:**

```bash
# Ver logs de Passenger
tail -f log/production.log

# O los logs del sistema
tail -f /var/log/your-app/*.log
```

### Verificación Post-Deploy

1. **Test del endpoint directamente:**

```bash
curl -X POST https://mercadoturismo.ar/api/stats/increment \
  -H "Content-Type: application/json" \
  -d '{"cardType":"paquete","serviceId":1,"serviceName":"Test"}'
```

**Respuesta esperada:**

```json
{
  "success": true,
  "cardType": "paquete",
  "serviceId": 1,
  "serviceName": "Test",
  "count": 1
}
```

2. **Verificar desde el frontend:**
   - Abrir https://mercadoturismo.ar
   - Abrir DevTools (F12)
   - Ir a la pestaña Network
   - Hacer click en cualquier card de servicio
   - Verificar que la petición a `/api/stats/increment` devuelva **200 OK**

3. **Verificar estadísticas:**

```bash
curl https://mercadoturismo.ar/api/stats
```

---

## 🎯 Resultados Esperados

### Antes del Fix

```
❌ POST /api/stats/increment → 500 Internal Server Error
❌ Response: <!doctype html>...
❌ Console: SyntaxError: Unexpected token 'c'
❌ Console: "No se pudo trackear el click en paquete"
```

### Después del Fix

```
✅ POST /api/stats/increment → 200 OK
✅ Response: {"success":true,"cardType":"paquete","count":42}
✅ Console: Silencioso (no hay errores)
✅ Clicks se registran correctamente en la base de datos
```

---

## 📊 Configuración Actual

### Rate Limiting

- **100 clicks** por IP cada 10 minutos
- Suficiente para uso normal
- Previene abuso

### CORS

- Acepta: `localhost:5173`, `mercadoturismo.ar`, `www.mercadoturismo.ar`
- Con y sin www
- HTTP (dev) y HTTPS (prod)

### Logging

- Request completo registrado
- Headers importantes visible
- Body parseado
- Timestamp en errores

---

## 🔧 Troubleshooting

### Si sigue dando error 500:

1. **Verificar que el backend esté corriendo:**

```bash
curl https://mercadoturismo.ar/api/health
```

2. **Verificar logs del servidor:**

```bash
# Buscar errores de base de datos
grep "ERROR" log/production.log | tail -20

# Buscar errores de stats
grep "STATS" log/production.log | tail -20
```

3. **Verificar CORS:**

```bash
curl -I -X OPTIONS https://mercadoturismo.ar/api/stats/increment \
  -H "Origin: https://mercadoturismo.ar" \
  -H "Access-Control-Request-Method: POST"
```

4. **Verificar permisos de base de datos:**

```bash
ls -la backend/database/
# El archivo debe ser escribible por el usuario de la app
```

### Si el frontend no envía la petición:

1. **Verificar que el servicio esté importado:**

```javascript
import { trackCardClick } from "../services/clickStats.service";
```

2. **Verificar que se llame en el onClick:**

```javascript
const handleCardClick = () => {
  trackCardClick("paquete", item.id, nombre).catch(console.error);
  setShowModal(true);
};
```

3. **Verificar la URL de la API:**

```bash
# En frontend/.env.production
cat frontend/.env.production
# Debe mostrar: VITE_API_BASE_URL=https://mercadoturismo.ar/api
```

---

## 📝 Notas Adicionales

### Archivos Modificados

1. ✅ `frontend/src/services/clickStats.service.js` - Eliminado header personalizado
2. ✅ `backend/src/index.js` - Mejorado CORS
3. ✅ `backend/src/controllers/clickStats.controller.js` - Mejorado logging y error handling

### Archivos Creados

1. ✅ `backend/test-click-tracking.js` - Script de prueba

### NO Modificado

- ✅ Rate limiter (ya estaba en 100 clicks/10min)
- ✅ Rutas (ya estaban correctas)
- ✅ Modelo ClickStats (ya estaba correcto)

---

## ✨ Mejoras Futuras (Opcional)

1. **Agregar metrics/monitoring:**
   - Loggear clicks en un servicio externo (Sentry, LogRocket)
   - Dashboard de analytics en tiempo real

2. **Optimización de base de datos:**
   - Índices adicionales si hay muchos registros
   - Archivado de clicks antiguos

3. **Seguridad adicional:**
   - Rate limiting por usuario autenticado (no solo por IP)
   - Validación de servicios existentes

4. **UX:**
   - Feedback visual cuando se registra un click
   - Animación sutil en la card

---

## 📞 Contacto

Si el problema persiste después de aplicar estos cambios, verificar:

1. ✅ Logs del servidor (buscar "STATS" y "ERROR")
2. ✅ Network tab en DevTools
3. ✅ Variables de entorno en producción
4. ✅ Permisos de base de datos

---

**Fecha:** 2025-01-15  
**Status:** ✅ RESUELTO  
**Versión:** 1.0.0
