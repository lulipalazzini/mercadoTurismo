# Guía Rápida: Configuración del Backend en WNPower

## ⚠️ PROBLEMA ACTUAL

El frontend está deployado pero el backend NO está accesible. El error "Unexpected token '<'" indica que las peticiones a `/api` están devolviendo HTML en lugar de JSON.

## ✅ SOLUCIONES (Elige una)

### OPCIÓN 1: Subdominio para el Backend (RECOMENDADO)

Esta es la forma más limpia y profesional.

1. **En WNPower, crea un subdominio:**
   - Subdominio: `api.mercadoturismo.ar`
   - Apuntar al servidor donde corre Node.js (puerto 3001)

2. **Actualizar frontend `.env.production`:**

   ```
   VITE_API_URL=https://api.mercadoturismo.ar
   ```

3. **Rebuild frontend:**

   ```bash
   cd frontend
   npm run build
   ```

4. **Subir nuevo `dist` a WNPower**

5. **Backend `.env`:**
   ```
   FRONTEND_URL=https://mercadoturismo.ar
   PORT=3001
   ```

---

### OPCIÓN 2: Reverse Proxy en el mismo dominio

Si WNPower soporta Apache mod_proxy o nginx reverse proxy:

1. **Configurar proxy en Apache** (archivo `.htaccess` en la raíz):

   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_URI} ^/api
   RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
   ```

2. **Asegurarse que mod_proxy está habilitado**

3. **No necesitas rebuild del frontend** (ya usa `/api`)

---

### OPCIÓN 3: IP:Puerto Directo (Solo Testing)

**NO recomendado para producción** (problemas de CORS y seguridad)

1. **Frontend `.env.production`:**

   ```
   VITE_API_URL=http://TU_IP_PUBLICA:3001/api
   ```

2. **Backend CORS abierto:**
   ```javascript
   app.use(cors({ origin: "*" }));
   ```

---

## 🚀 PASOS INMEDIATOS

### 1. Verificar que el backend esté corriendo

SSH a tu servidor WNPower y ejecuta:

```bash
cd /ruta/a/backend
npm install
node src/index.js
```

Debería mostrar: `🚀 Servidor corriendo en puerto 3001`

### 2. Verificar acceso al backend

Desde tu navegador o terminal:

```bash
curl http://localhost:3001/api/auth
# o
curl http://TU_IP:3001/api/auth
```

Debería devolver JSON, no HTML.

### 3. Usar PM2 para mantener el backend corriendo

```bash
npm install -g pm2
pm2 start src/index.js --name "mercadoturismo-api"
pm2 save
pm2 startup
```

---

## 📝 CHECKLIST

- [ ] Backend Node.js instalado y corriendo
- [ ] MySQL configurado con credenciales en `.env`
- [ ] Puerto 3001 accesible (o el que uses)
- [ ] Firewall permite conexiones al puerto
- [ ] Subdominio creado (si usas opción 1)
- [ ] Frontend rebuildeado con URL correcta
- [ ] SSL/HTTPS configurado
- [ ] PM2 configurado para auto-restart

---

## 🔧 Configuración Recomendada para WNPower

**Backend en subdominio:**

- Frontend: `https://mercadoturismo.ar` → Archivos estáticos del `dist`
- Backend: `https://api.mercadoturismo.ar` → Node.js en puerto 3001

**Estructura:**

```
/home/usuario/
  ├── public_html/              → Frontend (dist)
  └── backend/                  → Backend Node.js
      ├── src/
      ├── node_modules/
      ├── .env
      └── package.json
```

---

## ❓ Contacta a WNPower si necesitas:

1. Crear subdominio `api.mercadoturismo.ar`
2. Instalar Node.js en el servidor
3. Configurar reverse proxy
4. Abrir puertos en firewall
5. Configurar PM2 o servicio systemd

---

## 📞 Testing Rápido

Una vez configurado, prueba:

1. **Frontend:** https://mercadoturismo.ar (debe cargar)
2. **Backend:** https://api.mercadoturismo.ar/api/auth (debe devolver JSON)
3. **Login:** Intenta hacer login en la app
