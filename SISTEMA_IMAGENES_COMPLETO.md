# ✅ SISTEMA DE CARGA DE IMÁGENES - IMPLEMENTACIÓN COMPLETA

## 📋 RESUMEN GENERAL

Sistema unificado de carga de imágenes implementado en toda la aplicación (backend + frontend).

**Características:**

- ✅ Hasta 6 imágenes por registro
- ✅ Drag & drop + selección manual
- ✅ Validación de tipo y tamaño
- ✅ Previews en tiempo real
- ✅ Persistencia en /uploads
- ✅ Gestión automática de eliminación
- ✅ Respuestas JSON consistentes

---

## 🔧 BACKEND - Node.js + Express + Multer

### 1. Middleware de Upload (`backend/src/middleware/upload.middleware.js`)

**YA ESTABA CORRECTO** - No se requirieron cambios.

```javascript
// Configuración
- Storage: diskStorage en /uploads con nombres únicos
- Límites: 6 imágenes máximo, 5MB por archivo
- Validación: Solo jpeg, jpg, png, gif, webp
- Campo: "imagenes" (array)

// Funciones exportadas
- upload.array("imagenes", 6)
- handleMulterError: Maneja errores de Multer
- deleteOldImages: Elimina archivos del filesystem
```

### 2. Controllers Actualizados

**6 controllers modificados para soportar imágenes:**

#### ✅ paquetes.controller.js

- `createPaquete`: Procesa req.files, guarda array de paths, limpia en error
- `updatePaquete`: Borra imágenes anteriores si hay nuevas, limpia en error

#### ✅ autos.controller.js

- `createAuto`: Igual patrón que paquetes
- `updateAuto`: Igual patrón que paquetes

#### ✅ circuitos.controller.js

- `createCircuito`: Igual patrón
- `updateCircuito`: Igual patrón

#### ✅ salidasGrupales.controller.js

- `createSalidaGrupal`: Igual patrón
- `updateSalidaGrupal`: Igual patrón

#### ✅ transfers.controller.js

- `createTransfer`: Igual patrón
- `updateTransfer`: Igual patrón

#### ✅ seguros.controller.js

- `createSeguro`: Igual patrón
- `updateSeguro`: Igual patrón

**Controllers que YA TENÍAN imágenes (no modificados):**

- ✅ alojamientos.controller.js
- ✅ cruceros.controller.js
- ✅ excursiones.controller.js

**Patrón implementado en todos:**

```javascript
// CREATE
const createX = async (req, res) => {
  try {
    const xData = { ...req.body };

    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      xData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      xData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const x = await X.create(xData);
    res.status(201).json({ message: "X creado exitosamente", x });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res.status(500).json({ message: "Error al crear X", error: error.message });
  }
};

// UPDATE
const updateX = async (req, res) => {
  try {
    const x = await X.findByPk(req.params.id);
    if (!x) {
      return res.status(404).json({ message: "X no encontrado" });
    }

    const updateData = { ...req.body };

    // Procesar imágenes nuevas
    if (req.files && req.files.length > 0) {
      // Borrar imágenes anteriores
      if (x.imagenes && x.imagenes.length > 0) {
        deleteOldImages(x.imagenes);
      }
      updateData.imagenes = req.files.map(
        (file) => `/uploads/${file.filename}`,
      );
    } else if (req.body.imagenes) {
      updateData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    await x.update(updateData);
    res.json({ message: "X actualizado exitosamente", x });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar X", error: error.message });
  }
};
```

### 3. Routes Actualizadas

**6 routes modificadas para incluir Multer:**

#### ✅ paquetes.routes.js

```javascript
const {
  upload,
  handleMulterError,
} = require("../middleware/upload.middleware");

router.post(
  "/",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  createPaquete,
);
router.put(
  "/:id",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  updatePaquete,
);
```

#### ✅ autos.routes.js

- Mismo patrón

#### ✅ circuitos.routes.js

- Mismo patrón

#### ✅ salidasGrupales.routes.js

- Mismo patrón

#### ✅ transfers.routes.js

- Mismo patrón

#### ✅ seguros.routes.js

- Mismo patrón (con isAdmin)

**Routes que YA TENÍAN Multer (no modificadas):**

- ✅ alojamientos.routes.js
- ✅ cruceros.routes.js
- ✅ excursiones.routes.js

---

## 🎨 FRONTEND - React + Vite

### 1. Componente ImageUploader (`frontend/src/components/ImageUploader.jsx`)

**Nuevo componente reutilizable:**

```jsx
<ImageUploader images={imagenes} onChange={setImagenes} maxImages={6} />
```

**Características:**

- ✅ Drag & drop funcional
- ✅ Selección manual con botón
- ✅ Previews con imágenes
- ✅ Botón de eliminar por imagen
- ✅ Contador de imágenes (X / 6)
- ✅ Validación de tipo (solo imágenes)
- ✅ Límite de 6 imágenes
- ✅ Manejo de memory leaks (revoca blob URLs)

**Props:**

- `images`: Array de Files o strings (URLs)
- `onChange`: Callback que recibe array actualizado
- `maxImages`: Límite (default 6)

### 2. Estilos (`frontend/src/styles/ImageUploader.css`)

**Estilos profesionales:**

- Zona de drag & drop con feedback visual
- Grid responsive de previews
- Botones de eliminar con hover effects
- Responsive mobile-friendly

### 3. Servicio API (`frontend/src/services/api.js`)

**Actualizado para soportar FormData:**

```javascript
// Detecta FormData automáticamente
post: (url, data, options = {}) => {
  const body = data instanceof FormData ? data : JSON.stringify(data);
  return fetchWithAuth(url, { method: "POST", body, ...options });
};

// No agrega Content-Type si es FormData (browser lo hace con boundary)
const isFormData = options.body instanceof FormData;
const headers = {
  ...(isFormData ? {} : { "Content-Type": "application/json" }),
  ...options.headers,
};
```

**Beneficios:**

- ✅ Soporta JSON y FormData
- ✅ Maneja Content-Type automáticamente
- ✅ Compatible con todos los endpoints existentes

### 4. PaqueteFormModal Actualizado

**Cambios implementados:**

1. **Import ImageUploader:**

```jsx
import ImageUploader from "../ImageUploader";
```

2. **State de imágenes:**

```jsx
const [imagenes, setImagenes] = useState([]);
```

3. **Uso de FormData en submit:**

```jsx
const formDataToSend = new FormData();
formDataToSend.append("nombre", formData.nombre);
formDataToSend.append("descripcion", formData.descripcion);
// ... otros campos
formDataToSend.append("incluye", JSON.stringify(incluye));

// Agregar imágenes
imagenes.forEach((imagen) => {
  if (imagen instanceof File) {
    formDataToSend.append("imagenes", imagen);
  }
});

await createPaquete(formDataToSend);
```

4. **Reemplazo del input de imagen:**

```jsx
{
  /* Antes: input type="url" para imagen */
}
{
  /* Ahora: */
}
<div className="form-group full-width">
  <label>Imágenes del Paquete</label>
  <ImageUploader images={imagenes} onChange={setImagenes} maxImages={6} />
</div>;
```

---

## 📊 CATEGORÍAS SOPORTADAS

**Backend (Controllers + Routes con Multer):**

1. ✅ Alojamientos
2. ✅ Cruceros
3. ✅ Excursiones
4. ✅ Paquetes (recién actualizado)
5. ✅ Autos (recién actualizado)
6. ✅ Circuitos (recién actualizado)
7. ✅ Salidas Grupales (recién actualizado)
8. ✅ Transfers (recién actualizado)
9. ✅ Seguros (recién actualizado)

**Frontend (FormModals con ImageUploader):**

1. ✅ PaqueteFormModal (implementado)
2. ⏳ AutoFormModal (pendiente)
3. ⏳ CircuitoFormModal (pendiente)
4. ⏳ SalidaGrupalFormModal (pendiente)
5. ⏳ TransferFormModal (pendiente)
6. ⏳ SeguroFormModal (pendiente)
7. ⏳ CruceroFormModal (pendiente - verificar si ya tiene)
8. ⏳ AlojamientoFormModal (pendiente - verificar si ya tiene)
9. ⏳ ExcursionFormModal (pendiente - verificar si ya tiene)

---

## 🚀 PRÓXIMOS PASOS PARA COMPLETAR

### 1. Actualizar FormModals Restantes

**Aplicar el mismo patrón de PaqueteFormModal a:**

```jsx
// 1. Import ImageUploader
import ImageUploader from "../ImageUploader";

// 2. State de imágenes
const [imagenes, setImagenes] = useState([]);

// 3. FormData en handleSubmit
const formDataToSend = new FormData();
// ... agregar campos
imagenes.forEach((imagen) => {
  if (imagen instanceof File) {
    formDataToSend.append("imagenes", imagen);
  }
});

// 4. Agregar en el JSX (reemplazar input de imagen por URL)
<div className="form-group full-width">
  <label>Imágenes</label>
  <ImageUploader images={imagenes} onChange={setImagenes} maxImages={6} />
</div>;
```

**Archivos a modificar:**

- [ ] `frontend/src/components/dashboard/AutoFormModal.jsx`
- [ ] `frontend/src/components/dashboard/CircuitoFormModal.jsx`
- [ ] `frontend/src/components/dashboard/SalidaGrupalFormModal.jsx`
- [ ] `frontend/src/components/dashboard/TransferFormModal.jsx`
- [ ] `frontend/src/components/dashboard/SeguroFormModal.jsx`
- [ ] Verificar si CruceroFormModal, AlojamientoFormModal, ExcursionFormModal ya tienen upload

### 2. Testing Completo

```bash
# Backend
cd backend
npm install  # Asegurar que multer esté instalado
npm start

# Frontend
cd frontend
npm install
npm run dev
```

**Probar:**

1. ✅ Crear paquete con imágenes (drag & drop + selección)
2. ✅ Límite de 6 imágenes
3. ✅ Eliminar imágenes antes de enviar
4. ✅ Ver previews
5. ✅ Error 500 si backend falla (debe mostrar mensaje JSON, no HTML)
6. ✅ Crear sin imágenes (debe funcionar)
7. ✅ Actualizar paquete (borrar imágenes anteriores)
8. ⏳ Repetir para las otras 8 categorías una vez actualizados los FormModals

---

## ⚠️ IMPORTANTE - COMPATIBILIDAD

### No rompe rutas existentes

- ✅ Los endpoints GET siguen funcionando igual
- ✅ POST/PUT sin archivos siguen funcionando (pueden enviar JSON normal)
- ✅ Controllers manejan ambos casos: con y sin archivos

### Errores siempre en JSON

- ✅ Todos los controllers devuelven JSON en errores
- ✅ handleMulterError devuelve JSON
- ✅ Frontend verifica Content-Type antes de parsear

### Passenger/cPanel Compatible

- ✅ Fix de NODE_PATH ya aplicado en app.js
- ✅ Multer agregado a dependencies en package.json

---

## 📝 ARCHIVOS MODIFICADOS

### Backend (15 archivos)

1. ✅ `backend/app.js` (NODE_PATH fix)
2. ✅ `backend/package.json` (multer en dependencies)
3. ✅ `backend/src/controllers/paquetes.controller.js`
4. ✅ `backend/src/controllers/autos.controller.js`
5. ✅ `backend/src/controllers/circuitos.controller.js`
6. ✅ `backend/src/controllers/salidasGrupales.controller.js`
7. ✅ `backend/src/controllers/transfers.controller.js`
8. ✅ `backend/src/controllers/seguros.controller.js`
9. ✅ `backend/src/routes/paquetes.routes.js`
10. ✅ `backend/src/routes/autos.routes.js`
11. ✅ `backend/src/routes/circuitos.routes.js`
12. ✅ `backend/src/routes/salidasGrupales.routes.js`
13. ✅ `backend/src/routes/transfers.routes.js`
14. ✅ `backend/src/routes/seguros.routes.js`
15. ✅ `backend/DEPLOY_FIX_MULTER.md` (documentación)

### Frontend (4 archivos nuevos/modificados)

1. ✅ `frontend/src/components/ImageUploader.jsx` (NUEVO)
2. ✅ `frontend/src/styles/ImageUploader.css` (NUEVO)
3. ✅ `frontend/src/services/api.js` (FormData support)
4. ✅ `frontend/src/components/dashboard/PaqueteFormModal.jsx`

---

## 🎯 RESULTADO FINAL

### ✅ Backend Completo

- 9/9 categorías soportan upload de imágenes
- Multer configurado correctamente
- Validaciones implementadas
- Manejo de errores robusto
- Compatible con Passenger/cPanel

### 🔄 Frontend Parcial (1/9)

- Componente ImageUploader reutilizable ✅
- API preparada para FormData ✅
- PaqueteFormModal funcionando ✅
- 8 FormModals pendientes de actualización ⏳

### 📈 Progreso Total: ~70% completo

- Backend: 100% ✅
- Frontend infraestructura: 100% ✅
- Frontend integración: 11% (1/9) ⏳

---

**Fecha:** 2026-02-05  
**Estado:** BACKEND COMPLETO, FRONTEND PARCIAL (PaqueteFormModal listo)  
**Próximo paso:** Actualizar los 8 FormModals restantes con el patrón de PaqueteFormModal
