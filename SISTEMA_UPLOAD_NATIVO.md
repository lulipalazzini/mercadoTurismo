# Sistema de Carga de Imágenes Nativo - Documentación Completa

## 📋 Resumen

Sistema de upload de imágenes implementado **sin dependencias externas** (sin multer), basado en la lógica funcional de sistemas PHP legacy, adaptado a la arquitectura Node.js/React existente.

---

## 🎯 Objetivos Cumplidos

✅ Procesar multipart/form-data con Node.js nativo  
✅ Validaciones (tipo MIME, tamaño)  
✅ Guardar en filesystem con nombres únicos  
✅ Drag & Drop en JavaScript puro (React)  
✅ Integración con arquitectura existente  
✅ Sin modificar estructura de BD (solo agregar columnas si faltaban)

---

## 🔧 Componentes Implementados

### Backend

#### 1. `src/utils/imageUploadNative.js`

**Inspirado en PHP:**

- `$_FILES` processing → `MultipartParser.parse()`
- `move_uploaded_file()` → `fs.promises.writeFile()`
- Validación MIME → `validateFile()`
- Generación nombre único → `timestamp_random.ext`

**Funciones principales:**

```javascript
// Parser manual de multipart/form-data
class MultipartParser {
  async parse() // Extrae archivos y campos del request
}

// Validación (equivalente a validaciones PHP)
function validateFile(file) {
  // Verifica: tamaño, MIME type, extensión
}

// Guardar archivo (equivalente a move_uploaded_file)
async function saveFile(file) {
  // Genera nombre único y escribe en /uploads
}

// Procesar múltiples imágenes
async function processImages(req) {
  // Retorna: { success, images, errors, fields }
}
```

**Configuración:**

```javascript
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB (como upload_max_filesize PHP)
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  uploadDir: "./uploads", // Destino de archivos
};
```

---

#### 2. `src/middleware/imageUpload.middleware.js`

**Función:** Integrar procesamiento de imágenes en el flujo de Express.

**Uso en routes:**

```javascript
const { uploadImages } = require("../middleware/imageUpload.middleware");

router.post("/", verifyToken, uploadImages, createController);
router.put("/:id", verifyToken, uploadImages, updateController);
```

**Qué hace:**

- Detecta si el request es multipart/form-data
- Procesa archivos con `processImages()`
- Agrega `req.uploadedImages` (array de objetos imagen)
- Agrega campos form a `req.body`
- Maneja errores de validación

**Helpers incluidos:**

```javascript
// Obtener solo las rutas para guardar en BD
function getImagePaths(req) {
  return req.uploadedImages.map((img) => img.path);
}

// Eliminar imágenes antiguas al actualizar
async function deleteOldImages(imagePaths) {
  // Usa fs.unlink para cada ruta
}
```

---

#### 3. Integración en Controllers

**Ejemplo: `src/controllers/paquetes.controller.js`**

```javascript
const createPaquete = async (req, res) => {
  const paqueteData = { ...req.body };

  // Si hay imágenes subidas (desde multipart/form-data)
  if (req.uploadedImages && req.uploadedImages.length > 0) {
    paqueteData.imagenes = req.uploadedImages.map((img) => img.path);
  }
  // Fallback: si vienen como JSON (API pura sin archivos)
  else if (req.body.imagenes) {
    paqueteData.imagenes = JSON.parse(req.body.imagenes);
  }

  const paquete = await Paquete.create(paqueteData);
  res.status(201).json({ paquete });
};
```

**Patrón aplicable a:**

- Alojamientos
- Autos
- Circuitos
- Cruceros
- Excursiones
- Paquetes
- Salidas Grupales
- Seguros
- Transfers

---

### Frontend

#### 4. `src/components/common/DragDropImageUpload.jsx`

**Componente React con Drag & Drop en JavaScript puro**

**Props:**

```javascript
<DragDropImageUpload
  onChange={setImagenes} // Callback con array de File objects
  maxFiles={6} // Máximo de imágenes
  maxSizeMB={5} // Tamaño máximo por archivo
  existingImages={[]} // Imágenes ya existentes (para edit)
/>
```

**Características:**

- ✅ Drag & drop de archivos
- ✅ Click para seleccionar
- ✅ Validación en cliente (tipo, tamaño)
- ✅ Preview de imágenes
- ✅ Botón para eliminar imágenes
- ✅ Feedback visual (zona de drop, errores)
- ✅ Responsive

**Validaciones (equivalentes a PHP):**

```javascript
const validateFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = maxSizeMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return "Tipo no permitido";
  }
  if (file.size > maxSize) {
    return `Muy grande. Máximo ${maxSizeMB}MB`;
  }
  return null;
};
```

---

#### 5. `src/styles/dragDropUpload.css`

Estilos completos para el componente:

- Zona de drop con estados (hover, dragging)
- Grid de previews responsivo
- Botones de eliminar
- Mensajes de error

---

#### 6. Integración en FormModals

**Ejemplo: `PaqueteFormModal.jsx`**

```javascript
import DragDropImageUpload from "../common/DragDropImageUpload";

const [imagenes, setImagenes] = useState([]);

// En el render:
<DragDropImageUpload onChange={setImagenes} maxFiles={6} maxSizeMB={5} />;

// En handleSubmit:
const formDataToSend = new FormData();
// ... otros campos ...

imagenes.forEach((imagen) => {
  if (imagen instanceof File) {
    formDataToSend.append("imagenes", imagen);
  }
});

await createPaquete(formDataToSend);
```

**Aplicar a:**

- ✅ PaqueteFormModal (implementado)
- ⏳ AutoFormModal
- ⏳ CircuitoFormModal
- ⏳ TransferFormModal
- ⏳ SalidaGrupalFormModal
- ⏳ AlojamientoFormModal
- ⏳ CruceroFormModal
- ⏳ ExcursionFormModal

---

## 🔄 Flujo Completo

### 1. Usuario arrastra/selecciona imágenes

```
DragDropImageUpload
  ↓
validateFile() - Valida tipo y tamaño
  ↓
onChange(files) - Array de File objects
  ↓
setImagenes(files) - Estado del modal
```

### 2. Usuario envía formulario

```
handleSubmit()
  ↓
FormData con campos + archivos
  ↓
createPaquete(formData)
  ↓
fetch() con Content-Type: multipart/form-data
```

### 3. Backend recibe y procesa

```
Express request
  ↓
uploadImages middleware
  ↓
MultipartParser.parse()
  ↓
validateFile() para cada imagen
  ↓
saveFile() - Escribe en /uploads
  ↓
req.uploadedImages = [{ path, size, mimetype }]
  ↓
Controller usa req.uploadedImages
  ↓
Guarda rutas en BD (JSON array)
```

### 4. Base de datos

```sql
-- Columna imagenes (JSON)
imagenes: [
  "/uploads/1738803245678_a3f2e1d9.jpg",
  "/uploads/1738803245679_b4c3f2e8.png"
]
```

---

## 📚 Mapeo PHP → Node.js

| Concepto PHP                             | Equivalente Node.js                 | Archivo                     |
| ---------------------------------------- | ----------------------------------- | --------------------------- |
| `$_FILES`                                | `MultipartParser.parse()`           | `imageUploadNative.js`      |
| `move_uploaded_file()`                   | `fs.promises.writeFile()`           | `imageUploadNative.js`      |
| `$allowed_types`                         | `UPLOAD_CONFIG.allowedMimeTypes`    | `imageUploadNative.js`      |
| `$max_size`                              | `UPLOAD_CONFIG.maxFileSize`         | `imageUploadNative.js`      |
| `time() . '_' . uniqid()`                | `Date.now() + crypto.randomBytes()` | `imageUploadNative.js`      |
| `unlink($file)`                          | `fs.promises.unlink()`              | `imageUpload.middleware.js` |
| Form con `enctype="multipart/form-data"` | `FormData` + `fetch()`              | `*FormModal.jsx`            |
| `<input type="file" multiple>`           | `<DragDropImageUpload />`           | `DragDropImageUpload.jsx`   |

---

## 🚀 Cómo Usar

### Para agregar a un nuevo endpoint:

1. **Route:** Agregar middleware

```javascript
const { uploadImages } = require("../middleware/imageUpload.middleware");
router.post("/", verifyToken, uploadImages, createController);
```

2. **Controller:** Usar req.uploadedImages

```javascript
const createModel = async (req, res) => {
  const data = { ...req.body };

  if (req.uploadedImages && req.uploadedImages.length > 0) {
    data.imagenes = req.uploadedImages.map((img) => img.path);
  }

  const model = await Model.create(data);
  res.json({ model });
};
```

3. **Frontend:** Usar DragDropImageUpload

```jsx
import DragDropImageUpload from "../common/DragDropImageUpload";

const [imagenes, setImagenes] = useState([]);

<DragDropImageUpload onChange={setImagenes} maxFiles={6} />;

// En submit:
const formData = new FormData();
imagenes.forEach((img) => formData.append("imagenes", img));
await createModel(formData);
```

---

## ⚙️ Configuración

### Cambiar límites:

**Backend:**

```javascript
// src/utils/imageUploadNative.js
const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};
```

**Frontend:**

```jsx
<DragDropImageUpload
  maxFiles={10} // Máximo 10 imágenes
  maxSizeMB={10} // 10MB por imagen
/>
```

---

## 🐛 Troubleshooting

### Error: "Content-Type must be multipart/form-data"

- Asegurar que el frontend envía FormData, no JSON
- Verificar que NO se establece header Content-Type manualmente

### Error: "No such column: imagenes"

- Ejecutar `node backend/fix-database-schema.js`
- O agregar columna manualmente: `ALTER TABLE tabla ADD COLUMN imagenes JSON DEFAULT '[]'`

### Imágenes no se guardan

- Verificar que carpeta `/uploads` existe y tiene permisos de escritura
- Revisar logs del middleware en consola
- Verificar que controller usa `req.uploadedImages`

---

## 📊 Ventajas vs Multer

| Aspecto          | Multer                   | Sistema Nativo               |
| ---------------- | ------------------------ | ---------------------------- |
| **Dependencias** | Necesita npm install     | ✅ Cero dependencias         |
| **Control**      | Configuración limitada   | ✅ Control total del flujo   |
| **Debugging**    | Black box                | ✅ Código visible y editable |
| **Tamaño**       | +150KB node_modules      | ✅ ~10KB propio              |
| **Passenger**    | Problemas de resolución  | ✅ Sin conflictos            |
| **Aprendizaje**  | Depende de docs externas | ✅ Código educativo          |

---

## 🎓 Lo que se tomó del PHP

Del código PHP legacy se extrajeron estos **conceptos funcionales**:

1. **Validación de archivos**
   - Verificar tipo MIME antes de procesar
   - Limitar tamaño máximo
   - Verificar extensión permitida

2. **Nombres únicos**
   - Timestamp + random para evitar colisiones
   - Mantener extensión original

3. **Estructura de guardado**
   - Carpeta `/uploads` centralizada
   - Rutas relativas en BD
   - Filesystem como storage

4. **Relación con BD**
   - Columna JSON para múltiples imágenes
   - Array de strings (rutas)
   - No duplicar archivos en BD

5. **Manejo de errores**
   - Validar antes de procesar
   - Retornar errores específicos
   - No fallar silenciosamente

---

## ✅ Checklist de Implementación

### Backend

- [x] Parser multipart/form-data nativo
- [x] Validaciones de archivo
- [x] Guardado en filesystem
- [x] Middleware para Express
- [x] Integración en 1 controller (ejemplo)
- [x] Integración en 1 route (ejemplo)
- [ ] Aplicar a todos los controllers
- [ ] Aplicar a todas las routes

### Frontend

- [x] Componente DragDropImageUpload
- [x] Estilos CSS
- [x] Integración en 1 modal (ejemplo)
- [ ] Aplicar a todos los modales

### Base de Datos

- [x] Script de migración de schema
- [x] Columna imagenes en todas las tablas

### Testing

- [ ] Test de upload múltiple
- [ ] Test de validación tamaño
- [ ] Test de validación tipo
- [ ] Test de drag & drop
- [ ] Test de eliminación de imagen

---

## 📝 Próximos Pasos

1. Aplicar el patrón a los otros 7 FormModals
2. Agregar tests unitarios
3. Implementar compresión de imágenes (opcional)
4. Agregar soporte para edición (reemplazar imágenes existentes)
5. Implementar lazy loading de imágenes en listados

---

## 🔗 Archivos Clave

**Backend:**

- `src/utils/imageUploadNative.js` - Parser y lógica core
- `src/middleware/imageUpload.middleware.js` - Integración Express
- `src/controllers/paquetes.controller.js` - Ejemplo de uso
- `src/routes/paquetes.routes.js` - Ejemplo de route

**Frontend:**

- `src/components/common/DragDropImageUpload.jsx` - Componente principal
- `src/styles/dragDropUpload.css` - Estilos
- `src/components/dashboard/PaqueteFormModal.jsx` - Ejemplo de integración

**Scripts:**

- `backend/fix-database-schema.js` - Migración de BD
- `backend/apply-native-upload.sh` - Guía de aplicación masiva

---

## 💡 Notas Finales

- ✅ Sistema completamente funcional sin librerías externas
- ✅ Compatible con Phusion Passenger
- ✅ Basado en mejores prácticas de PHP legacy
- ✅ Adaptado a arquitectura moderna Node.js/React
- ✅ Drag & drop intuitivo
- ✅ Validaciones robustas
- ✅ Escalable a todos los modelos

**El código PHP NO se copió**, se usó **solo como referencia funcional** para entender:

- Cómo se procesaban archivos
- Qué validaciones se hacían
- Cómo se guardaban las rutas
- Cómo se relacionaba con la BD

Todo fue **reescrito idiomáticamente en Node.js/React**.
