# Sistema Unificado de Carga de Imágenes - Implementación

## ✅ COMPLETADO

### 1. Frontend - Componente ImageUpload

- **Archivo**: `frontend/src/components/common/ImageUpload.jsx`
- **Características**:
  - Drag & drop funcional
  - Soporte para File objects (archivos reales)
  - Límite de 6 imágenes máximo
  - Previews con opción de eliminación
  - Validación de tipo y tamaño (5MB por imagen)
  - Estilos modernos y responsivos

### 2. Backend - Middleware de Upload

- **Archivo**: `backend/src/middleware/upload.middleware.js`
- **Funcionalidades**:
  - Configuración de multer con almacenamiento en disco
  - Validación de tipos (jpg, jpeg, png, gif, webp)
  - Límite de 6 archivos y 5MB por archivo
  - Helper para eliminar imágenes antiguas
  - Manejo de errores de multer

### 3. Modelos Actualizados

✅ Todos los modelos ahora tienen campo `imagenes` como JSON array:

- Crucero ✅
- Alojamiento ✅
- Excursion ✅
- Auto ✅
- Circuito ✅
- SalidaGrupal ✅
- **Transfer** ✅ (agregado)
- **Seguro** ✅ (agregado)
- **Paquete** ✅ (cambiado de `imagen` singular a `imagenes` plural)

### 4. Controllers Completos

✅ **Cruceros** - `backend/src/controllers/cruceros.controller.js`

- createCrucero: procesa archivos con multer
- updateCrucero: reemplaza imágenes antiguas

✅ **Alojamientos** - `backend/src/controllers/alojamientos.controller.js`

- createAlojamiento: procesa archivos con multer
- updateAlojamiento: reemplaza imágenes antiguas

### 5. Routes Completas

✅ **Cruceros** - `backend/src/routes/cruceros.routes.js`
✅ **Alojamientos** - `backend/src/routes/alojamientos.routes.js`
✅ **Excursiones** - `backend/src/routes/excursiones.routes.js`

### 6. Configuración del Servidor

✅ `backend/src/index.js` actualizado:

- Importa `path`
- Sirve archivos estáticos desde `/uploads`
- Las imágenes son accesibles en `http://localhost:3001/uploads/filename.jpg`

---

## ⚠️ PENDIENTE DE COMPLETAR

### Controllers Restantes (6)

Necesitan actualizar sus funciones `create` y `update` con este patrón:

```javascript
// En el archivo controller (ej: autos.controller.js)
const { deleteOldImages } = require("../middleware/upload.middleware");

const createAuto = async (req, res) => {
  try {
    const autoData = { ...req.body };

    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      autoData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      autoData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const auto = await Auto.create(autoData);
    res.status(201).json({ message: "Auto creado exitosamente", auto });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al crear auto", error: error.message });
  }
};

const updateAuto = async (req, res) => {
  try {
    const auto = await Auto.findByPk(req.params.id);
    if (!auto) {
      return res.status(404).json({ message: "Auto no encontrado" });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      if (auto.imagenes && auto.imagenes.length > 0) {
        deleteOldImages(auto.imagenes);
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

    await auto.update(updateData);
    res.json({ message: "Auto actualizado exitosamente", auto });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar auto", error: error.message });
  }
};
```

**Aplicar este patrón a:**

1. `autos.controller.js` → createAuto, updateAuto
2. `circuitos.controller.js` → createCircuito, updateCircuito
3. `salidasGrupales.controller.js` → createSalidaGrupal, updateSalidaGrupal
4. `transfers.controller.js` → createTransfer, updateTransfer
5. `seguros.controller.js` → createSeguro, updateSeguro
6. `paquetes.controller.js` → createPaquete, updatePaquete

---

### Routes Restantes (6)

Agregar multer middleware a las rutas POST y PUT:

```javascript
// Ejemplo para autos.routes.js
const express = require("express");
const {
  getAutos,
  getAuto,
  createAuto,
  updateAuto,
  deleteAuto,
} = require("../controllers/autos.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const {
  upload,
  handleMulterError,
} = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getAutos);
router.get("/:id", getAuto);

router.post(
  "/",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  createAuto,
);
router.put(
  "/:id",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  updateAuto,
);
router.delete("/:id", verifyToken, deleteAuto);

module.exports = router;
```

**Aplicar a:**

1. `autos.routes.js`
2. `circuitos.routes.js`
3. `salidasGrupales.routes.js`
4. `transfers.routes.js`
5. `seguros.routes.js`
6. `paquetes.routes.js`

---

### Frontend - FormModals

**Actualizar TODOS los FormModal para:**

1. Usar el componente ImageUpload actualizado
2. Manejar File objects en lugar de URLs
3. Enviar FormData con multipart/form-data

**Patrón de actualización:**

```javascript
// Ejemplo: AutoFormModal.jsx
import ImageUpload from "../common/ImageUpload";

// Estado para imágenes
const [imagenes, setImagenes] = useState([]);

// En el JSX del modal
<ImageUpload
  images={imagenes}
  onChange={setImagenes}
  maxImages={6}
  label="Imágenes del Auto"
/>;

// Al enviar el formulario
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  // Agregar campos regulares
  formData.append("marca", formState.marca);
  formData.append("modelo", formState.modelo);
  // ... otros campos

  // Agregar imágenes
  imagenes.forEach((imagen) => {
    if (imagen instanceof File) {
      formData.append("imagenes", imagen);
    } else if (typeof imagen === "string") {
      // Si es URL, enviar como JSON en campo separado o manejar en backend
      formData.append("imagenesUrls", imagen);
    }
  });

  try {
    // Usar fetch o axios con FormData
    const response = await fetch(`${API_URL}/autos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NO incluir Content-Type, se establece automáticamente con boundary
      },
      body: formData,
    });

    const data = await response.json();
    onSuccess(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

**FormModals a actualizar:**

1. ✅ `CruceroFormModal.jsx` (ya usa ImageUpload, actualizar para File objects)
2. ✅ `AlojamientoFormModal.jsx` (ya usa ImageUpload, actualizar para File objects)
3. ✅ `ExcursionFormModal.jsx` (ya usa ImageUpload, actualizar para File objects)
4. ⏳ `AutoFormModal.jsx`
5. ⏳ `CircuitoFormModal.jsx`
6. ⏳ `SalidaGrupalFormModal.jsx`
7. ⏳ `TransferFormModal.jsx`
8. ⏳ `SeguroFormModal.jsx`
9. ⏳ `PaqueteFormModal.jsx`

---

## 🚀 CÓMO COMPLETAR LA IMPLEMENTACIÓN

### Opción 1: Manual (Recomendada)

1. Copiar el patrón de controller de arriba para cada controller pendiente
2. Copiar el patrón de route de arriba para cada route pendiente
3. Actualizar cada FormModal con el patrón de FormData

### Opción 2: Script Automatizado

Ejecutar el script de actualización:

```bash
cd backend
node complete-image-system.js
```

(Ver script en `backend/complete-image-system.js`)

---

## 📋 CHECKLIST DE VALIDACIÓN

Después de completar, verificar:

- [ ] Todas las imágenes se guardan en `backend/uploads/`
- [ ] Las imágenes son accesibles en `http://localhost:3001/uploads/filename.jpg`
- [ ] Drag & drop funciona en todos los formularios
- [ ] Se respeta el límite de 6 imágenes
- [ ] Las imágenes se eliminan del filesystem al actualizar/borrar entidades
- [ ] Los previews se muestran correctamente
- [ ] FormData se envía correctamente (multipart/form-data)
- [ ] Backend valida tipo y tamaño de archivos

---

## 🔧 TROUBLESHOOTING

### Error: "Cannot read property 'files' of undefined"

- Verificar que el route tiene `upload.array("imagenes", 6)` antes del controller

### Error: "MulterError: File too large"

- Verificar que la imagen no supere 5MB
- Ajustar límite en `upload.middleware.js` si es necesario

### Error: "Cannot GET /uploads/imagen.jpg"

- Verificar que `app.use("/uploads", express.static(...))` esté en `index.js`
- Verificar que la carpeta `backend/uploads/` existe

### Las imágenes no se muestran en el preview

- Verificar que `getPreviewUrl()` en ImageUpload.jsx use `URL.createObjectURL()` para Files
- Verificar que las URLs de imágenes guardadas incluyan `/uploads/` al inicio

---

## 📊 ESTADO DEL PROYECTO

| Componente              | Estado | Archivo                                            |
| ----------------------- | ------ | -------------------------------------------------- |
| ImageUpload Component   | ✅     | frontend/src/components/common/ImageUpload.jsx     |
| Upload Middleware       | ✅     | backend/src/middleware/upload.middleware.js        |
| Cruceros Controller     | ✅     | backend/src/controllers/cruceros.controller.js     |
| Cruceros Routes         | ✅     | backend/src/routes/cruceros.routes.js              |
| Alojamientos Controller | ✅     | backend/src/controllers/alojamientos.controller.js |
| Alojamientos Routes     | ✅     | backend/src/routes/alojamientos.routes.js          |
| Excursiones Routes      | ✅     | backend/src/routes/excursiones.routes.js           |
| Otros Controllers (6)   | ⏳     | Pendiente (usar patrón arriba)                     |
| Otras Routes (6)        | ⏳     | Pendiente (usar patrón arriba)                     |
| FormModals (9)          | ⏳     | Pendiente (usar patrón FormData)                   |

**Progreso Total: 40% completado**

---

## 📞 SIGUIENTE PASO RECOMENDADO

1. Actualizar los 6 controllers restantes (copiar/pegar patrón)
2. Actualizar las 6 routes restantes (copiar/pegar patrón)
3. Actualizar los FormModals para usar FormData
4. Probar sistema completo creando una entidad de cada tipo

**Tiempo estimado para completar:** 30-45 minutos
