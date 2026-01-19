# Guía de Deploy a BaeHost - Mercado Turismo

## Requisitos Previos
- Acceso a BaeHost
- Node.js 18+ disponible en BaeHost (verificar con soporte)
- Dominio configurado: `https://www4.baehost.com/`

---

## 🚀 PASO 1: Preparar el Frontend

### 1.1 Crear archivo `.env.production`
Crea en `frontend/.env.production`:
```env
VITE_API_URL=https://www4.baehost.com/api
```

### 1.2 Compilar el Frontend
```bash
cd frontend
npm install
npm run build
```

Esto genera la carpeta `frontend/dist/` con tu sitio estático.

### 1.3 Subir Frontend a BaeHost
1. Via FTP/SFTP, conecta a tu hosting BaeHost
2. Navega a la carpeta raíz de tu dominio (generalmente `public_html/`)
3. Sube TODO el contenido de `frontend/dist/` a esa carpeta
4. Asegúrate que `.htaccess` esté presente en `public_html/`

---

## 🚀 PASO 2: Preparar el Backend (Si BaeHost soporta Node.js)

### 2.1 Crear archivo `.env`
Crea en `backend/.env`:
```env
PORT=3001
JWT_SECRET=tu_secreto_super_seguro_aqui_123456
NODE_ENV=production
DATABASE_URL=./database.sqlite
ALLOWED_ORIGINS=https://www4.baehost.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**IMPORTANTE:** 
- Cambia `JWT_SECRET` a algo seguro y único
- El puerto puede variar según BaeHost (verifica con soporte)
- Database SQLite se creará automáticamente

### 2.2 Subir Backend a BaeHost
1. Crea una carpeta `api/` o similar en tu servidor BaeHost
2. Sube TODO el contenido de `backend/` a esa carpeta
3. Instala dependencias en el servidor:
   ```bash
   cd backend
   npm install
   ```

### 2.3 Iniciar el Backend
Opción A: Si BaeHost usa PM2 (recomendado):
```bash
pm2 start src/index.js --name "mercado-turismo"
pm2 save
```

Opción B: Si BaeHost tiene cPanel con Node.js:
- Ve a cPanel → Node.js
- Crea nueva aplicación con:
  - Nodo: `src/index.js`
  - Versión: 18+
  - Puerto: 3001 (o el asignado)

---

## 🔧 PASO 3: Configuración de Proxy (Importante)

Si tu backend corre en puerto 3001, necesitas un proxy en Apache:

**En `backend/public/.htaccess` (si existe):**
```apache
<IfModule mod_proxy.c>
  ProxyRequests Off
  ProxyPassReverse /api http://127.0.0.1:3001/api
</IfModule>
```

O configura en cPanel → Apache Modules para que proxy esté habilitado.

---

## 📝 PASO 4: Verificación Final

### Frontend:
```bash
curl https://www4.baehost.com/
```
Deberías ver tu aplicación React.

### Backend:
```bash
curl https://www4.baehost.com/api/
```
O (si está en subdirectorio):
```bash
curl http://127.0.0.1:3001/
```

### Login/Auth:
- Abre https://www4.baehost.com/login
- Prueba registrarte
- Verifica que se conecte sin errores de CORS

---

## ⚠️ Problemas Comunes

### 1. **CORS Error**
- Solución: Verifica `ALLOWED_ORIGINS` en `.env` del backend
- Debe incluir: `https://www4.baehost.com`

### 2. **404 en rutas del Frontend**
- Solución: Asegúrate que `.htaccess` esté en `public_html/`
- Debe redirigir todo a `index.html`

### 3. **Database Error**
- Solución: Verifica permisos de carpeta `backend/`
- SQLite necesita permisos de escritura (755 o 775)

### 4. **API No accesible**
- Solución: Contacta a BaeHost para verificar si Node.js está soportado
- Alternativa: Usa servicio de API externo (Railway, Render, etc.)

---

## 🔐 Seguridad - Checklist Final

- [ ] Cambiar `JWT_SECRET` a valor único y fuerte
- [ ] `NODE_ENV=production` en backend
- [ ] `ALLOWED_ORIGINS` contiene solo dominio de producción
- [ ] Base de datos SQLite tiene permisos limitados (600)
- [ ] `.env` NO está versionado en git
- [ ] SSL/HTTPS habilitado en BaeHost

---

## 📞 Soporte BaeHost

- **Sitio:** https://www.baehost.com/
- **Chat/Ticket:** Contacta soporte BaeHost para:
  - Confirmar si Node.js está disponible
  - Obtener detalles de puertos disponibles
  - Configuración de proxy/rewrite

---

## 📦 Alternativa: Backend en Servicio Externo

Si BaeHost NO soporta Node.js, deploya el backend en:
- **Railway** (gratuito y fácil)
- **Render** (buena relación precio/performance)
- **Heroku** (clásico pero de pago)
- **AWS/Azure** (más complejo)

Y actualiza `VITE_API_URL` al endpoint del servicio externo.
