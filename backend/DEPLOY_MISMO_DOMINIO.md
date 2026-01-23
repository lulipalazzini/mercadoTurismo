# 🚀 Deploy en WNPower - Todo en mercadoturismo.ar (SIN subdominio)

## 📁 ESTRUCTURA DE CARPETAS

```
/home/tu_usuario/
├── public_html/              ← Raíz del dominio mercadoturismo.ar
│   ├── index.html           ← Frontend build
│   ├── assets/
│   └── .htaccess            ← Routing de React + Proxy a /api
│
└── backend/                  ← Fuera de public_html
    ├── app.js
    ├── src/
    ├── package.json
    └── node_modules/
```

---

## ✅ PASOS DE CONFIGURACIÓN

### 1. Subir el Backend

Sube la carpeta `backend/` completa a `/home/tu_usuario/backend/`

**IMPORTANTE:** Borrá la línea `var http = require('http');` del archivo `src/index.js` si apareció automáticamente.

### 2. Configurar Aplicación Node.js en cPanel

**cPanel > Setup Node.js App > Create Application:**

- **Node.js Version:** 18.x o superior
- **Application Mode:** Production
- **Application Root:** `/home/tu_usuario/backend`
- **Application URL:** Dejalo vacío o `mercadoturismo.ar`
- **Application Startup File:** `app.js`

**NO definas la variable PORT** - Passenger la asigna automáticamente.

**Instalar dependencias:**

```bash
cd ~/backend
npm install --production
```

**Anota el puerto que te asigna Passenger** (aparece en la configuración de la app Node.js).

### 3. Configurar el .htaccess en public_html

Edita `/home/tu_usuario/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Proxy para las peticiones a /api → Backend Node.js
  # IMPORTANTE: Reemplaza XXXXX con el puerto que te asignó Passenger
  RewriteCond %{REQUEST_URI} ^/api/
  RewriteRule ^api/(.*)$ http://127.0.0.1:XXXXX/api/$1 [P,L]

  # Routing para React (frontend)
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Si mod_proxy está disponible (mejor opción)
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPass /api http://127.0.0.1:XXXXX/api
  ProxyPassReverse /api http://127.0.0.1:XXXXX/api
</IfModule>
```

**¿Cómo saber el puerto?**

- En cPanel > Setup Node.js App, cuando creas la aplicación, te muestra el puerto.
- O ejecuta en terminal: `lsof -i | grep node`

### 4. Subir el Frontend

Sube todo el contenido de `frontend/dist/` a `/home/tu_usuario/public_html/`:

```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── .htaccess
```

### 5. Verificar el .env del backend

En `/home/tu_usuario/backend/.env`:

```bash
# NO definir PORT aquí - Passenger lo asigna automáticamente
# PORT=3001  ← DEBE estar comentado o eliminado

JWT_SECRET=mercado_turismo_secret_key_2026_super_seguro
NODE_ENV=production
FRONTEND_URL=https://mercadoturismo.ar
BASE_PATH=/api

# Credenciales de base de datos de WNPower
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=mercado_turismo
DB_PORT=3306
```

### 6. Reiniciar la Aplicación

En cPanel > Setup Node.js App:

- Click en "Restart"

O desde terminal:

```bash
touch ~/backend/tmp/restart.txt
```

---

## 🧪 PRUEBAS

### 1. Verificar el backend directamente:

```bash
cd ~/backend
node src/index.js
```

Debe mostrar:

```
✅ Conexión exitosa a la base de datos
🚀 Servidor corriendo en puerto XXXXX
```

Si funciona, presiona `Ctrl+C` y deja que Passenger lo maneje.

### 2. Probar el endpoint API:

```
https://mercadoturismo.ar/api/
```

Debe devolver:

```json
{ "message": "API Mercado Turismo funcionando" }
```

### 3. Probar el frontend:

```
https://mercadoturismo.ar/
```

Debe cargar la página principal sin errores 503.

---

## ❌ SI NO FUNCIONA EL PROXY

Si el .htaccess no puede hacer proxy (algunos hostings lo restringen), necesitás:

**OPCIÓN ALTERNATIVA: Passenger en subdirectorio**

En cPanel > Setup Node.js App:

- **Application URL:** `mercadoturismo.ar/api`

Esto hace que Passenger sirva automáticamente en `/api` sin necesidad de proxy.

**Luego actualiza el .htaccess a:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # No tocar las peticiones a /api (las maneja Passenger)
  RewriteCond %{REQUEST_URI} !^/api/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 📋 CHECKLIST FINAL

- [ ] Backend subido a `~/backend/`
- [ ] Aplicación Node.js configurada en cPanel
- [ ] `npm install` ejecutado en el backend
- [ ] Línea `var http = require('http');` eliminada de `src/index.js`
- [ ] `.env` del backend SIN PORT definido
- [ ] `.htaccess` en `public_html/` con proxy a `/api`
- [ ] Frontend (dist/) subido a `public_html/`
- [ ] Aplicación Node.js reiniciada en cPanel
- [ ] `https://mercadoturismo.ar/api/` devuelve JSON
- [ ] `https://mercadoturismo.ar/` carga el frontend

---

## 🔧 TROUBLESHOOTING

### Error 503 en /api

- **Causa:** El backend no está corriendo
- **Solución:** Verificar logs en cPanel > Metrics > Errors
- **Verificar:** `ps aux | grep node` debe mostrar el proceso

### Error 404 en /api

- **Causa:** El proxy no está funcionando
- **Solución:** Usar la opción alternativa de Passenger en subdirectorio

### CORS Error

- **Causa:** FRONTEND_URL en .env no coincide con el dominio
- **Solución:** Verificar que sea `https://mercadoturismo.ar`

### Páginas del frontend dan 404 al recargar

- **Causa:** .htaccess no está configurado correctamente
- **Solución:** Verificar que el .htaccess esté en public_html/
