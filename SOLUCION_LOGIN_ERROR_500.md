# ✅ LOGIN ARREGLADO - Error 500 y HTML en lugar de JSON

## 🐛 Problema Original

El login fallaba con:

- **Error 500** en el servidor
- Frontend recibía **HTML** en lugar de JSON
- Error: `Unexpected token '<', "<!doctype"... is not valid JSON`

---

## 🔧 Cambios Realizados

### Backend (`auth.controller.js`)

✅ **Asegurado que SIEMPRE devuelve JSON**, incluso en errores críticos:

- `res.setHeader("Content-Type", "application/json")` al inicio de cada función
- Validación de formato de email
- Verificación de JWT_SECRET antes de generar token
- Logging detallado para debugging
- Manejo de errores de base de datos y JWT
- Status codes correctos (400, 401, 500)

✅ **Mejoras de seguridad:**

- No usa JWT_SECRET por defecto si no está configurado
- Validación de formato de email con regex
- Mensajes de error genéricos para seguridad ("Credenciales inválidas")

### Frontend (`auth.service.js`)

✅ **Manejo robusto de errores:**

- Verifica `Content-Type` antes de parsear JSON
- Captura errores de parsing y muestra mensaje claro
- No asume que siempre puede parsear JSON
- Logging detallado para debugging
- Mensajes de error específicos según el tipo de fallo

✅ **Aplicado a:**

- `login()`
- `register()`

---

## 🧪 Verificación

### Test Local (desarrollo)

```bash
# 1. Backend
cd backend
npm start

# 2. En otra terminal, ejecutar test
node check-server-health.js
```

Debe mostrar:

```
✅ Tests pasados: 5
❌ Tests fallidos: 0
🎉 ¡TODOS LOS TESTS PASARON!
```

### Test en Producción

```bash
# Desde tu máquina
API_URL=https://mercadoturismo.ar node backend/check-server-health.js
```

O manualmente:

```bash
curl -X POST https://mercadoturismo.ar/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -v
```

**Debe devolver:**

- `Content-Type: application/json`
- Status 401
- JSON: `{"success":false,"message":"Credenciales inválidas"}`

**NO debe devolver:**

- HTML
- `<!doctype html>`
- Status 500 (a menos que haya error real del servidor)

---

## 📋 Checklist de Deployment

Antes de hacer deploy en WNPower, verificar:

- [ ] Archivo `.env` existe en el servidor con `JWT_SECRET` válido
- [ ] `npm install` completado sin errores
- [ ] `.htaccess` configurado correctamente (sin RewriteRule a puerto)
- [ ] `app.js` carga dotenv y exporta el módulo
- [ ] Base de datos `database.sqlite` existe y tiene permisos
- [ ] Passenger reiniciado: `touch tmp/restart.txt`
- [ ] Test de health check: `curl https://mercadoturismo.ar/api/health`
- [ ] Test de login con credenciales inválidas devuelve JSON

---

## 🔍 Debugging en Producción

Si el problema persiste:

### 1. Ver logs del servidor

```bash
# Via SSH
tail -f ~/logs/error_log
tail -f ~/passenger.log
```

### 2. Verificar variables de entorno

```bash
cat .env
# Debe contener:
# JWT_SECRET=...
# NODE_ENV=production
# FRONTEND_URL=https://mercadoturismo.ar
```

### 3. Verificar que Passenger carga dotenv

```bash
# En el servidor, ver los primeros logs de app.js
grep "Variables de entorno" ~/passenger.log
```

Debe mostrar:

```
📝 [PASSENGER] Variables de entorno cargadas:
   JWT_SECRET: ✅ Configurado
```

Si muestra `❌ FALTA`, crear/actualizar `.env`

### 4. Test manual de login

```bash
# Con usuario real
curl -X POST https://mercadoturismo.ar/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mercadoturismo.ar","password":"tu_password"}' \
  | jq '.'
```

Debe devolver JSON con token, NO HTML.

---

## 🚨 Si Sigue Devolviendo HTML

Posibles causas:

### 1. Passenger no está iniciando la app correctamente

**Solución:**

```bash
# Ver logs de Passenger
tail -100 ~/passenger.log

# Buscar errores de inicio
grep "ERROR" ~/passenger.log
grep "EXCEPTION" ~/passenger.log
```

### 2. Falta JWT_SECRET

**Solución:**

```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Agregar a .env
echo "JWT_SECRET=<el_secret_generado>" >> .env

# Reiniciar
touch tmp/restart.txt
```

### 3. .htaccess mal configurado

**Verificar que NO tenga:**

```apache
# ❌ MALO - no usar
RewriteRule ^(.*)$ http://127.0.0.1:3001/$1 [P,L]
```

**Debe tener:**

```apache
# ✅ CORRECTO
PassengerEnabled On
PassengerAppType node
PassengerStartupFile app.js
SetEnv NODE_ENV production
```

### 4. node_modules incompletos o corruptos

**Solución:**

```bash
rm -rf node_modules package-lock.json
npm install --production
touch tmp/restart.txt
```

---

## 📚 Archivos Modificados

1. ✅ [backend/src/controllers/auth.controller.js](c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend\src\controllers\auth.controller.js)
   - Función `login()` completamente reescrita
   - Validaciones mejoradas
   - Logging detallado
   - Siempre devuelve JSON

2. ✅ [frontend/src/services/auth.service.js](c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\frontend\src\services\auth.service.js)
   - Funciones `login()` y `register()` mejoradas
   - Verifica Content-Type antes de parsear
   - Manejo robusto de errores
   - Mensajes claros al usuario

3. ✅ [backend/check-server-health.js](c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend\check-server-health.js)
   - Nuevo script de verificación
   - 5 tests automáticos
   - Detecta problemas comunes

4. ✅ [backend/app.js](c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend\app.js)
   - Carga dotenv correctamente
   - Exporta el módulo para Passenger

5. ✅ [backend/.htaccess](c:\Users\lulip\OneDrive\Documentos\GitHub\mercadoTurismo\backend.htaccess)
   - Configuración simplificada para Passenger
   - Sin proxy innecesario

---

## 🚀 Próximos Pasos

1. **Hacer commit y push:**

   ```bash
   git add .
   git commit -m "Fix: login error 500 - siempre devuelve JSON"
   git push origin main
   ```

2. **En el servidor:**

   ```bash
   cd /ruta/a/tu/backend
   git pull origin main
   npm install --production
   touch tmp/restart.txt
   ```

3. **Verificar:**

   ```bash
   # Esperar 30 segundos
   curl https://mercadoturismo.ar/api/health | jq '.'
   ```

4. **Probar login desde el frontend**

---

## ✅ Resultado Esperado

- ✅ Login funciona correctamente
- ✅ Errores devuelven JSON (no HTML)
- ✅ Status codes correctos (401 para credenciales inválidas)
- ✅ Mensajes de error claros en el frontend
- ✅ No más "Unexpected token '<'"
- ✅ Click tracking funciona
- ✅ Todas las funciones de auth operativas

---

## 📞 Soporte

Si después de seguir estos pasos el problema persiste:

1. Ejecutar: `node check-server-health.js`
2. Capturar los logs del servidor
3. Verificar respuesta de: `curl -v https://mercadoturismo.ar/api/health`
4. Revisar que `.env` existe y tiene JWT_SECRET

**El problema más común es la falta de `.env` en el servidor.**
