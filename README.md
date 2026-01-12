# Mercado Turismo

Sistema de gestión para agencia de turismo con frontend en React y backend en Node.js con MongoDB.

## 📁 Estructura del Proyecto

```
mercadoTurismo/
├── frontend/          # Aplicación React + Vite
├── backend/           # API REST Node.js + Express
├── README.md          # Este archivo
└── USUARIOS_EJEMPLO.md
```

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

npm run dev
```

El backend estará disponible en `http://localhost:5000`

## 📚 Documentación

- [Frontend README](frontend/README.md) - Detalles del frontend
- [Backend README](backend/README.md) - API endpoints y documentación

## 🔧 Tecnologías

### Frontend

- React 18
- Vite
- React Router DOM
- CSS Modules

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 👥 Usuarios de Ejemplo

Ver [USUARIOS_EJEMPLO.md](USUARIOS_EJEMPLO.md) para credenciales de prueba.

## 📝 Licencia

ISC
