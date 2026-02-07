# Configuración de la API

## ✅ Problema Resuelto

El frontend **NO usa URLs hardcodeadas** con localhost en producción.

Todas las llamadas a la API funcionan tanto en **local** como en **deploy**.

---

## 📁 Archivos Clave

### `src/config/api.config.js`
Configuración centralizada de la URL de la API.

- **Desarrollo**: usa `VITE_API_URL` o `http://localhost:3001/api` por defecto
- **Producción**: usa `VITE_API_URL` o rutas relativas `/api`

### Variables de Entorno

#### `.env.development` (Local)
```env
VITE_API_URL=http://localhost:3001/api
```

#### `.env.production` (Producción)
```env
VITE_API_URL=https://mercadoturismo.ar/api
```

O dejar vacío para usar rutas relativas:
```env
VITE_API_URL=
```

---

## 🚀 Uso

### Importar en componentes y servicios

```javascript
import { API_URL } from '../config/api.config.js';

// Para llamadas a la API
fetch(`${API_URL}/alojamientos`)

// Para imágenes (sin /api)
import { BASE_URL } from '../config/api.config.js';
```

### Todos los archivos actualizados

✅ **Servicios**
- `src/services/api.js`
- `src/services/auth.service.js`

✅ **Utils**
- `src/utils/apiFetch.js`
- `src/utils/imageUtils.js`

✅ **Páginas**
- `src/pages/Alojamientos.jsx`
- `src/pages/Autos.jsx`
- `src/pages/Circuitos.jsx`
- `src/pages/Cruceros.jsx`
- `src/pages/Cupos.jsx`
- `src/pages/Excursiones.jsx`
- `src/pages/Paquetes.jsx`
- `src/pages/SalidasGrupales.jsx`
- `src/pages/Seguros.jsx`
- `src/pages/Transfers.jsx`

✅ **Componentes**
- `src/components/GlobalSearch.jsx`
- `src/components/dashboard/ImportarCuposModal.jsx`
- `src/components/dashboard/FacturacionAnotador.jsx`
- `src/components/dashboard/ReservasAnotador.jsx`

---

## 🧪 Testing

### Local
```bash
npm run dev
```
Debe conectar a `http://localhost:3001/api`

### Build de producción
```bash
npm run build
npm run preview
```
Debe usar rutas relativas o la URL configurada en `.env.production`

---

## 📝 Notas

- **NO commitear** `.env.local` (ya está en `.gitignore` como `*.local`)
- Los archivos `.env.example` y `.env.local.example` sirven de plantilla
- En modo desarrollo, se muestra un log en consola con la configuración actual
- Las URLs hardcodeadas con `localhost:3000` y `localhost:3001` fueron eliminadas

---

## ✅ Checklist de Deploy

- [ ] Verificar que `.env.production` tenga la URL correcta
- [ ] Build sin errores: `npm run build`
- [ ] No aparece `localhost` en el código de producción (excepto comentarios y config)
- [ ] Las llamadas a la API funcionan en el servidor de producción

---

## 🐛 Troubleshooting

### Error: ERR_CONNECTION_REFUSED
- Verificar que la variable `VITE_API_URL` esté configurada correctamente
- En producción, asegurarse de que el backend esté accesible en la URL configurada

### Las imágenes no cargan
- Verificar que `BASE_URL` esté correctamente configurado en `imageUtils.js`
- En producción, verificar que el backend sirva los archivos estáticos

### 404 en producción
- Si usas rutas relativas (`VITE_API_URL=`), asegurarte de que el frontend y backend estén en el mismo dominio
- O configurar CORS en el backend si están en dominios diferentes
