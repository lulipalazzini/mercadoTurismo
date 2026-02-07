# Frontend - Mercado Turismo

Aplicación web para gestión de agencia de turismo.

## 🚀 Instalación

```bash
cd frontend
npm install
```

## 🏃 Ejecución

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Producción

```bash
npm run build
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Home.jsx        # Página principal
│   ├── Login.jsx       # Login
│   ├── Register.jsx    # Registro
│   ├── Dashboard.jsx   # Panel principal
│   └── dashboard/      # Componentes del dashboard
│       ├── Clientes.jsx
│       ├── Paquetes.jsx
│       ├── Reservas.jsx
│       ├── Facturacion.jsx
│       └── Reportes.jsx
├── data/               # Datos de ejemplo
├── styles/             # Estilos CSS
├── assets/             # Recursos estáticos
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada
```

## 🔧 Configuración

Para conectar con el backend, actualiza la URL base de la API en tus componentes:

```javascript
const API_URL = "http://localhost:5000/api";
```

## 📦 Dependencias Principales

- **React** - Librería UI
- **React Router DOM** - Enrutamiento
- **Vite** - Build tool

## 👥 Usuarios de Ejemplo

Ver [../USUARIOS_EJEMPLO.md](../USUARIOS_EJEMPLO.md) para credenciales de prueba.
