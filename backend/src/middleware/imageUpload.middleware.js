/**
 * Middleware para procesar imágenes en endpoints
 * Integración con la arquitectura existente
 *
 * Uso en controllers:
 * const { uploadImages } = require("../middleware/imageUpload.middleware");
 * router.post("/", uploadImages, createController);
 */

const { processImages, deleteFile } = require("../utils/imageUploadNative");

/**
 * Middleware que procesa imágenes y las adjunta a req
 * Similar a cómo multer agrega req.files
 */
async function uploadImages(req, res, next) {
  // Solo procesar si es multipart/form-data
  const contentType = req.headers["content-type"];
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return next(); // Pasar al siguiente middleware si no hay archivos
  }

  try {
    const result = await processImages(req);

    // Agregar imágenes a req (compatible con código existente)
    req.uploadedImages = result.images || [];
    req.imageUploadErrors = result.errors;

    // Agregar campos del formulario a req.body
    if (result.fields) {
      req.body = { ...req.body, ...result.fields };
    }

    // Si hubo errores críticos, retornar
    if (!result.success && result.errors && result.errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: result.message,
        errors: result.errors,
      });
    }

    next();
  } catch (error) {
    console.error("Error en uploadImages middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Error procesando imágenes",
      error: error.message,
    });
  }
}

/**
 * Helper para eliminar imágenes antiguas al actualizar
 * Se usa en update controllers
 */
async function deleteOldImages(imagePaths) {
  if (!imagePaths || !Array.isArray(imagePaths)) return;

  const deletePromises = imagePaths.map((path) => deleteFile(path));
  await Promise.all(deletePromises);
}

/**
 * Extraer rutas de imágenes subidas para guardar en BD
 * Convierte req.uploadedImages a array de strings
 */
function getImagePaths(req) {
  if (!req.uploadedImages || req.uploadedImages.length === 0) {
    return [];
  }
  return req.uploadedImages.map((img) => img.path);
}

module.exports = {
  uploadImages,
  deleteOldImages,
  getImagePaths,
};
