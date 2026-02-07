# Backend - Mercado Turismo API

API REST para el sistema de gestión de turismo.

## ⚠️ IMPORTANTE: CommonJS

**Este proyecto usa CommonJS (require/module.exports)** para compatibilidad con Phusion Passenger (WNPower hosting).

- ✅ Usa `require()` en lugar de `import`
- ✅ Usa `module.exports` en lugar de `export`
- ✅ NO tiene `"type": "module"` en package.json

Para más información sobre la conversión, ver:

- [SOLUCION_ERR_REQUIRE_ESM.md](./SOLUCION_ERR_REQUIRE_ESM.md)
- [DEPLOY_FINAL.md](./DEPLOY_FINAL.md)

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:

```env
PORT=5000
JWT_SECRET=tu_secreto_super_seguro_cambiame
NODE_ENV=development
```

La base de datos SQLite se creará automáticamente como `database.sqlite`.

## 🏃 Ejecución

### Desarrollo (con hot reload)

```bash
npm run dev
```

### Producción

```bash
npm start
```

## 📚 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)

### Clientes

- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/:id` - Obtener cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Paquetes

- `GET /api/paquetes` - Listar paquetes
- `GET /api/paquetes/:id` - Obtener paquete
- `POST /api/paquetes` - Crear paquete (admin)
- `PUT /api/paquetes/:id` - Actualizar paquete (admin)
- `DELETE /api/paquetes/:id` - Eliminar paquete (admin)

### Reservas

- `GET /api/reservas` - Listar reservas
- `GET /api/reservas/:id` - Obtener reserva
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `PATCH /api/reservas/:id/cancel` - Cancelar reserva

### Facturación

- `GET /api/facturacion/estadisticas` - Obtener estadísticas (admin)
- `GET /api/facturacion/facturas` - Listar facturas

## 🔐 Autenticación

La API usa JWT para autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu_token>
```

## 🗄️ Base de Datos

El proyecto usa **SQLite** con **Sequelize**. La base de datos se crea automáticamente al iniciar el servidor.

- Archivo de base de datos: `database.sqlite` (se crea automáticamente)
- No requiere instalación de servidor de base de datos
- Ideal para desarrollo y proyectos pequeños

## 📦 Dependencias Principales

- **express** - Framework web
- **sequelize** - ORM para bases de datos SQL
- **sqlite3** - Driver de SQLite
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Hash de contraseñas
- **cors** - CORS middleware
- **dotenv** - Variables de entorno

## 🚀 Deploy en WNPower

### Verificación Pre-Deploy

Antes de subir al servidor, ejecuta:

```bash
node verify-pre-deploy.js
```

Esto verificará que todo esté listo para deploy (CommonJS, sin errores, etc.)

### Pasos para Deploy

1. **Subir código al servidor:**

   ```bash
   git push origin main
   # O usar FTP/File Manager
   ```

2. **En el servidor (SSH):**

   ```bash
   cd ~/mercad25.mercadoturismo.ar/backend
   git pull origin main
   npm install
   touch tmp/restart.txt
   ```

3. **Configurar en Panel WNPower:**
   - Application startup: `app.js`
   - Node.js version: 18.x o 20.x
   - Variables de entorno: JWT_SECRET, FRONTEND_URL, NODE_ENV=production

4. **Verificar logs:**
   ```bash
   tail -f ~/logs/mercad25.mercadoturismo.ar.error_log
   ```

Para guía completa de deploy, ver [DEPLOY_FINAL.md](./DEPLOY_FINAL.md)

## 📝 Scripts Útiles

- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar en desarrollo con nodemon
- `node verify-pre-deploy.js` - Verificar antes de deploy
- `node convert-to-commonjs.js` - Convertir archivos nuevos a CommonJS (si es necesario)

## 🐛 Troubleshooting

### Error: ERR_REQUIRE_ESM

Si ves este error, significa que hay archivos usando ESM en lugar de CommonJS.
Ver [SOLUCION_ERR_REQUIRE_ESM.md](./SOLUCION_ERR_REQUIRE_ESM.md) para la solución.

### Error: Cannot find module

```bash
npm install
touch tmp/restart.txt
```

### La app no arranca en WNPower

1. Verificar logs en `~/logs/*.error_log`
2. Verificar configuración en Panel Node.js Apps
3. Verificar que entry point sea `app.js`
4. Verificar variables de entorno

## 📚 Documentación Adicional

- [SOLUCION_ERR_REQUIRE_ESM.md](./SOLUCION_ERR_REQUIRE_ESM.md) - Explicación del cambio ESM → CommonJS
- [DEPLOY_FINAL.md](./DEPLOY_FINAL.md) - Guía completa de deploy
- [RESUMEN_VISUAL.md](./RESUMEN_VISUAL.md) - Resumen visual de cambios
