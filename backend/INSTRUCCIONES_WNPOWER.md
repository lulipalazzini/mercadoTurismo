# 🚀 Instrucciones para Corregir el Backend en WNPower

## ⚠️ PROBLEMA DETECTADO

cPanel/Passenger agregó automáticamente esta línea al inicio del archivo:

```javascript
var http = require("http");
```

Esta línea causa el **Error 503** porque el proyecto usa ES Modules (`"type": "module"`).

---

## ✅ SOLUCIÓN PASO A PASO

### 1. Limpiar el archivo src/index.js en el servidor

**En cPanel > Administrador de Archivos:**

1. Ve a: `/home/tu_usuario/backend/src/index.js`
2. Edita el archivo
3. **BORRA** la primera línea si dice: `var http = require('http');`
4. El archivo DEBE empezar con:
   ```javascript
   import express from "express";
   import cors from "cors";
   import dotenv from "dotenv";
   ```

### 2. Verificar que NO haya PORT definido en .env

**En el archivo `.env` del servidor:**

```bash
# Puerto: NO definir en producción con Phusion Passenger
# El sistema asigna el puerto automáticamente
# PORT=3001  ← Debe estar comentado o eliminado

JWT_SECRET=mercado_turismo_secret_key_2026_super_seguro
NODE_ENV=production
FRONTEND_URL=https://mercadoturismo.ar
BASE_PATH=/api

# Agregar credenciales de base de datos
DB_HOST=localhost
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_NAME=mercado_turismo
DB_PORT=3306
```

### 3. Configuración de la Aplicación Node.js en cPanel

**Setup Node.js App:**

- **Application Root:** `/home/tu_usuario/backend`
- **Application URL:** `api.mercadoturismo.ar` (tu subdominio)
- **Application Startup File:** `app.js`
- **Node.js Version:** Selecciona la más reciente (16.x o superior)
- **Application Mode:** Production
- **Environment Variables:**
  - No definas PORT aquí
  - Define NODE_ENV=production

### 4. Instalar Dependencias

En la terminal de cPanel:

```bash
cd ~/backend
npm install --production
```

### 5. Reiniciar la Aplicación

En el panel de "Setup Node.js App" de cPanel:

- Click en "Restart"
- O desde terminal: `touch ~/backend/tmp/restart.txt`

---

## 🔍 VERIFICACIÓN

### Comprobar que la app arranca correctamente:

```bash
cd ~/backend
node src/index.js
```

**Debe mostrar:**

```
✅ Conexión exitosa a la base de datos
🚀 Servidor corriendo en puerto XXXXX
🌍 Entorno: production
📡 CORS habilitado para: https://mercadoturismo.ar
```

Si ves ese mensaje, ¡funciona! Presiona `Ctrl+C` y deja que Passenger lo maneje automáticamente.

### Probar el endpoint desde el navegador:

```
https://api.mercadoturismo.ar/
```

**Debe devolver:**

```json
{ "message": "API Mercado Turismo funcionando" }
```

---

## ❌ ERRORES COMUNES

### Error: "require is not defined in ES module scope"

- **Causa:** Hay un `require()` en algún archivo .js
- **Solución:** Buscar y reemplazar por `import`

### Error: "Cannot find package 'express'"

- **Causa:** No se instalaron las dependencias
- **Solución:** Ejecutar `npm install` en la carpeta backend

### Error: "Database connection failed"

- **Causa:** Credenciales de base de datos incorrectas
- **Solución:** Verificar el archivo `.env` con las credenciales correctas del hosting

### Error 503 persiste

- **Causa 1:** La app no arranca por un error en el código
- **Solución:** Ver logs en cPanel > Metrics > Errors
- **Causa 2:** Passenger no encuentra el archivo de inicio
- **Solución:** Verificar que `app.js` existe en la raíz

---

## 📝 ARCHIVOS IMPORTANTES

Asegúrate de subir estos archivos:

```
backend/
├── app.js                    ← Punto de entrada para Passenger
├── .htaccess                 ← Configuración de Passenger
├── .env                      ← Variables de entorno (SIN PORT)
├── package.json              ← "main": "app.js", "type": "module"
├── src/
│   └── index.js             ← SIN require(), solo imports
└── node_modules/            ← Generado con npm install
```

---

## 🎯 CHECKLIST FINAL

- [ ] Eliminé `var http = require('http');` del inicio de src/index.js
- [ ] El .env NO tiene PORT definido (o está comentado)
- [ ] Ejecuté `npm install` en el servidor
- [ ] Configuré la app Node.js en cPanel apuntando a `app.js`
- [ ] Reinicié la aplicación desde cPanel
- [ ] El endpoint `https://api.mercadoturismo.ar/` devuelve JSON
- [ ] Subí el frontend (carpeta `dist`) al dominio principal

---

## 📞 SI SIGUE SIN FUNCIONAR

1. **Ver los logs de error:**
   - cPanel > Metrics > Errors
   - O en terminal: `tail -f ~/logs/api_error.log`

2. **Verificar que Node.js esté activo:**

   ```bash
   ps aux | grep node
   ```

3. **Probar manualmente:**
   ```bash
   cd ~/backend
   node app.js
   ```

Si aparece un error específico, ese es el problema real a resolver.
