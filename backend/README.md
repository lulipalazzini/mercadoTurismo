# Backend - Mercado Turismo API

API REST para el sistema de gestión de turismo.

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
