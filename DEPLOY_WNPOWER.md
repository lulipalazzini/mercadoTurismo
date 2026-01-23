# Guía de Deploy en WNPower - mercadoturismo.ar

## Configuración Completada

Se han actualizado todas las configuraciones necesarias para el deploy en WNPower con el dominio `mercadoturismo.ar`.

### Cambios Realizados

#### Backend

1. **Archivo [.env](backend/.env)**: Actualizado con configuración de producción
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://mercadoturismo.ar`

2. **[index.js](backend/src/index.js)**: Configurado CORS para aceptar peticiones del dominio de producción

#### Frontend

1. **Variables de entorno**:
   - [.env.production](frontend/.env.production): `VITE_API_URL=https://mercadoturismo.ar/api`
   - [.env.development](frontend/.env.development): `VITE_API_URL=http://localhost:3001/api`

2. **Archivos actualizados** para usar variables de entorno:
   - [services/api.js](frontend/src/services/api.js)
   - [services/auth.service.js](frontend/src/services/auth.service.js)
   - [components/GlobalSearch.jsx](frontend/src/components/GlobalSearch.jsx)
   - Todas las páginas: Alojamientos, Autos, Circuitos, Cruceros, Cupos, Excursiones, Paquetes, SalidasGrupales, Seguros, Transfers

3. **[.htaccess](frontend/.htaccess)**: Creado para routing en producción

4. **[vite.config.js](frontend/vite.config.js)**: Configuración optimizada para build de producción

## Instrucciones de Deploy

### Backend

1. **Subir archivos** a tu servidor WNPower en la carpeta correspondiente
2. **Configurar base de datos**:
   - Crear la base de datos MySQL en el panel de WNPower
   - Actualizar las credenciales en el archivo `.env`:
     ```
     DB_HOST=localhost (o la IP del servidor MySQL)
     DB_USER=tu_usuario_mysql
     DB_PASSWORD=tu_contraseña_mysql
     DB_NAME=mercado_turismo
     DB_PORT=3306
     ```
3. **Instalar dependencias**:
   ```bash
   npm install --production
   ```
4. **Ejecutar migraciones y seeders** si es necesario
5. **Iniciar servidor**:
   ```bash
   npm start
   ```

### Frontend

1. **Build de producción**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. **Subir carpeta `dist`** al directorio público de tu hosting WNPower
3. El archivo `.htaccess` ya está incluido en la carpeta `frontend` y se copiará automáticamente al hacer build

### Configuración en WNPower

1. **Dominio**: Apuntar `mercadoturismo.ar` a tu hosting
2. **SSL**: Activar certificado SSL (https)
3. **API Backend**: Configurar subdirectorio o subdominio para `/api`
   - Opción 1: Usar reverse proxy para `/api` → backend Node.js
   - Opción 2: Configurar subdominio `api.mercadoturismo.ar`

### Variables de Entorno a Configurar en Producción

**Backend** (archivo `.env`):

- `JWT_SECRET`: Cambiar por una clave segura única
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Credenciales de MySQL de WNPower
- `FRONTEND_URL=https://mercadoturismo.ar`

## Pruebas Post-Deploy

1. Verificar que el frontend carga correctamente en `https://mercadoturismo.ar`
2. Probar el login de usuarios
3. Verificar que todas las páginas cargan datos correctamente
4. Revisar la consola del navegador para asegurar que no hay errores de CORS

## Notas Importantes

- El backend debe correr en el puerto 3001 o el configurado en `PORT`
- Asegurarse de que el servidor Node.js esté siempre ejecutándose (usar PM2 o similar)
- Configurar SSL/HTTPS para seguridad
- Hacer backup de la base de datos antes del deploy

## Comandos de PM2 (recomendado para producción)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar backend con PM2
cd backend
pm2 start src/index.js --name "mercadoturismo-api"

# Ver logs
pm2 logs mercadoturismo-api

# Reiniciar
pm2 restart mercadoturismo-api

# Guardar configuración para auto-inicio
pm2 save
pm2 startup
```
