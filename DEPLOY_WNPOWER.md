# 🚀 Guía de Deploy en WNPower

## 📋 Requisitos Previos

- Acceso SSH a WNPower
- Node.js instalado en el servidor (verificar versión con `node --version`)
- Dominio configurado: `mercadoturismo.ar`

## 🔧 Configuración del Backend

### 1. Subir archivos al servidor

Subir la carpeta `backend/` completa al directorio del hosting:

```
/home/mercadoturismo/backend/
```

### 2. Instalar dependencias

Conectar por SSH y ejecutar:

```bash
cd /home/mercadoturismo/backend
npm install --production
```

Si el servidor usa CloudLinux y aparece `Permission denied` para `/usr/bin/env node`,
ejecutar con el binario de Node del sistema:

```bash
export PATH="/opt/alt/alt-nodejs18/root/usr/bin:$PATH"
node -v
npm install --production
```

### 3. Configurar variables de entorno

Crear archivo `.env` en `/home/mercadoturismo/backend/`:

```bash
nano .env
```

Contenido del `.env`:

```env
# JWT Secret (cambiar por uno seguro)
JWT_SECRET=tu_secreto_jwt_muy_seguro_cambiar_aqui

# Environment
NODE_ENV=production

# Frontend URL (para CORS)
FRONTEND_URL=https://mercadoturismo.ar

# Database
DB_PATH=./database.sqlite
```

**IMPORTANTE:** Cambiar el `JWT_SECRET` por una clave segura generada aleatoriamente.

### 4. Verificar archivo .htaccess

El archivo `.htaccess` en la carpeta `backend/` debe contener:

```apache
PassengerEnabled on
PassengerAppType node
PassengerStartupFile app.js
PassengerAppRoot /home/mercadoturismo/backend

PassengerLogLevel 3
PassengerNodejs /usr/bin/node

SetEnv NODE_ENV production
```

Si el backend está en un subdominio con DocumentRoot propio
(ej: `/home/usuario/api.dominio.com`), crear un `.htaccess` en ese DocumentRoot
para enganchar Passenger con ruta absoluta:

```apache
PassengerEnabled On
PassengerAppType node
PassengerAppRoot /home/usuario/api.dominio.com/backend
PassengerBaseURI /
PassengerStartupFile app.js
PassengerNodejs /opt/alt/alt-nodejs18/root/usr/bin/node
PassengerAppLogFile /home/usuario/new_logs.log
```

### 5. Verificar permisos

```bash
chmod 644 .env .htaccess
chmod 755 uploads/
```

### 6. Inicializar base de datos

Si es la primera vez:

```bash
node backend/migrate-passenger-fields.js
```

Si aparecen errores de columnas faltantes (ej: `no such column: *.imagenes`)
o tabla `trenes` inexistente, ejecutar la migración correctiva:

```bash
node backend/migrations/add-imagenes-columns.js
```

## 🎨 Configuración del Frontend

### 1. Build de producción

En tu máquina local, desde la carpeta `frontend/`:

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos estáticos optimizados.

### 2. Subir archivos al servidor

Subir el contenido de `frontend/dist/` al directorio raíz del dominio:

```
/home/mercadoturismo/public_html/
```

**Estructura esperada:**

```
/home/mercadoturismo/
├── backend/          # Backend Node.js
│   ├── src/
│   ├── uploads/
│   ├── app.js
│   ├── .htaccess
│   ├── .env
│   ├── package.json
│   └── database.sqlite
└── public_html/      # Frontend (build)
    ├── assets/
    ├── index.html
    └── ...
```

### 3. Configurar .htaccess del frontend

Crear `.htaccess` en `/home/mercadoturismo/public_html/`:

```apache
# Habilitar RewriteEngine
RewriteEngine On

# Si no es un archivo o directorio existente, enviar a index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Comprimir archivos
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Caché para assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

## 🔍 Verificación

### 1. Verificar que el backend responde

```bash
curl https://mercadoturismo.ar/api
```

Debe devolver un JSON con información de la API.

### 2. Revisar logs de Passenger

```bash
tail -f /home/mercadoturismo/backend/log/passenger.log
```

### 3. Probar el frontend

Abrir en navegador: `https://mercadoturismo.ar`

- Verificar que carga correctamente
- Probar login
- Verificar que las peticiones al API funcionan

## 🔄 Actualizar la aplicación

### Backend:

```bash
cd /home/mercadoturismo/backend
git pull origin main  # Si usas git
npm install --production
touch tmp/restart.txt  # Reiniciar Passenger
```

### Frontend:

En local:

```bash
cd frontend
npm run build
```

Luego subir el contenido de `dist/` al servidor, reemplazando archivos existentes.

## 🐛 Troubleshooting

### La API no responde

1. Verificar que Passenger está habilitado:

   ```bash
   cat /home/mercadoturismo/backend/.htaccess
   ```

2. Verificar logs:

   ```bash
   tail -f /home/mercadoturismo/backend/log/passenger.log
   ```

3. Reiniciar Passenger:
   ```bash
   mkdir -p /home/mercadoturismo/backend/tmp
   touch /home/mercadoturismo/backend/tmp/restart.txt
   ```

### Error CORS

Verificar que `.env` tiene:

```
FRONTEND_URL=https://mercadoturismo.ar
```

### Error 500

1. Revisar permisos de archivos
2. Verificar que todas las dependencias están instaladas
3. Revisar logs de Passenger
4. Verificar que `.env` existe y tiene todas las variables necesarias

### Frontend muestra error al conectar con API

1. Verificar que el build se hizo con `npm run build` (usa `.env.production`)
2. Verificar en el navegador (Network tab) que las peticiones van a la URL correcta
3. Verificar CORS en el backend

## 📝 Checklist de Deploy

- [ ] Backend subido a `/home/mercadoturismo/backend/`
- [ ] `.env` configurado con valores de producción
- [ ] `.htaccess` configurado en backend
- [ ] `npm install --production` ejecutado
- [ ] Base de datos inicializada
- [ ] Frontend buildeado (`npm run build`)
- [ ] Contenido de `dist/` subido a `public_html/`
- [ ] `.htaccess` configurado en frontend
- [ ] API responde correctamente
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] CORS configurado correctamente

## 🚨 Seguridad

- **Cambiar `JWT_SECRET`** por una clave segura única
- Verificar que `.env` no sea accesible públicamente
- Mantener dependencias actualizadas
- Revisar logs regularmente
- Hacer backups de la base de datos periódicamente

## 📞 Soporte

Si hay problemas específicos de WNPower, contactar con su soporte técnico con los logs de Passenger.
