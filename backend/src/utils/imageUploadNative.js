/**
 * Sistema de carga de imágenes nativo (sin multer)
 * Inspirado en la lógica PHP clásica de upload
 *
 * Características PHP replicadas:
 * - Validación de tipo MIME
 * - Límite de tamaño
 * - Nombre único generado con timestamp
 * - Guardado en filesystem
 * - Retorno de ruta relativa para BD
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Configuración (equivalente a php.ini)
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB (como upload_max_filesize en PHP)
  allowedMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  uploadDir: path.join(__dirname, "../../uploads"), // Equivalente a move_uploaded_file destination
};

/**
 * Parser manual de multipart/form-data
 * Reemplaza la necesidad de multer
 * Inspirado en cómo PHP procesa $_FILES
 */
class MultipartParser {
  constructor(req) {
    this.req = req;
    this.boundary = this.extractBoundary();
    this.files = [];
    this.fields = {};
  }

  extractBoundary() {
    const contentType = this.req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      throw new Error("Content-Type must be multipart/form-data");
    }
    const match = contentType.match(/boundary=(.+)$/);
    return match ? match[1] : null;
  }

  async parse() {
    return new Promise((resolve, reject) => {
      const chunks = [];

      this.req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      this.req.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);
          this.processBuffer(buffer);
          resolve({
            files: this.files,
            fields: this.fields,
          });
        } catch (error) {
          reject(error);
        }
      });

      this.req.on("error", reject);
    });
  }

  processBuffer(buffer) {
    const boundaryBuffer = Buffer.from(`--${this.boundary}`);
    const parts = [];
    let start = 0;

    // Split buffer by boundary
    while (true) {
      const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
      if (boundaryIndex === -1) break;

      if (start !== 0) {
        parts.push(buffer.slice(start, boundaryIndex));
      }
      start = boundaryIndex + boundaryBuffer.length;
    }

    // Process each part
    parts.forEach((part) => {
      this.processPart(part);
    });
  }

  processPart(part) {
    // Find headers separator (double CRLF)
    const headerEndIndex = part.indexOf("\r\n\r\n");
    if (headerEndIndex === -1) return;

    const headersBuffer = part.slice(0, headerEndIndex);
    const headers = headersBuffer.toString("utf-8");

    // Extract Content-Disposition
    const dispositionMatch = headers.match(
      /Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/,
    );
    if (!dispositionMatch) return;

    const fieldName = dispositionMatch[1];
    const filename = dispositionMatch[2];

    // Extract content (skip CRLF after headers and trailing CRLF)
    const content = part.slice(headerEndIndex + 4, part.length - 2);

    if (filename) {
      // It's a file
      const contentTypeMatch = headers.match(/Content-Type: (.+)/);
      const contentType = contentTypeMatch
        ? contentTypeMatch[1].trim()
        : "application/octet-stream";

      this.files.push({
        fieldname: fieldName,
        originalname: filename,
        mimetype: contentType,
        buffer: content,
        size: content.length,
      });
    } else {
      // It's a regular field
      this.fields[fieldName] = content.toString("utf-8");
    }
  }
}

/**
 * Validación de archivo (equivalente a validaciones PHP)
 * Similar a: if($_FILES['file']['error'] === UPLOAD_ERR_OK)
 */
function validateFile(file) {
  const errors = [];

  // Validar existencia
  if (!file || !file.buffer) {
    errors.push("No se recibió ningún archivo");
    return { valid: false, errors };
  }

  // Validar tamaño (equivalente a: $_FILES['file']['size'] > $max_size)
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    errors.push(
      `Archivo muy grande. Máximo ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB`,
    );
  }

  // Validar MIME type (equivalente a: in_array($finfo->file($tmp), $allowed))
  if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    errors.push(
      `Tipo de archivo no permitido. Solo: ${UPLOAD_CONFIG.allowedMimeTypes.join(", ")}`,
    );
  }

  // Validar extensión
  const ext = path.extname(file.originalname).toLowerCase();
  if (!UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
    errors.push(
      `Extensión no permitida. Solo: ${UPLOAD_CONFIG.allowedExtensions.join(", ")}`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generar nombre único para archivo
 * Equivalente PHP: $filename = time() . '_' . uniqid() . '.' . $ext
 */
function generateUniqueFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  return `${timestamp}_${randomString}${ext}`;
}

/**
 * Guardar archivo en filesystem
 * Equivalente PHP: move_uploaded_file($_FILES['file']['tmp_name'], $destination)
 */
async function saveFile(file) {
  // Crear directorio si no existe (equivalente a mkdir en PHP)
  if (!fs.existsSync(UPLOAD_CONFIG.uploadDir)) {
    fs.mkdirSync(UPLOAD_CONFIG.uploadDir, { recursive: true });
  }

  const uniqueFilename = generateUniqueFilename(file.originalname);
  const filePath = path.join(UPLOAD_CONFIG.uploadDir, uniqueFilename);

  // Escribir buffer a archivo (equivalente a move_uploaded_file)
  await fs.promises.writeFile(filePath, file.buffer);

  // Retornar ruta relativa para guardar en BD (como en PHP)
  return `/uploads/${uniqueFilename}`;
}

/**
 * Eliminar archivo del filesystem
 * Equivalente PHP: unlink($file_path)
 */
async function deleteFile(relativePath) {
  if (!relativePath) return;

  const filePath = path.join(
    __dirname,
    "../../",
    relativePath.replace(/^\//, ""),
  );

  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Procesar múltiples imágenes
 * Equivalente PHP: foreach($_FILES as $file)
 */
async function processImages(req) {
  try {
    // Parse multipart data
    const parser = new MultipartParser(req);
    const { files, fields } = await parser.parse();

    if (!files || files.length === 0) {
      return {
        success: false,
        message: "No se recibieron archivos",
        images: [],
      };
    }

    const uploadedImages = [];
    const errors = [];

    // Procesar cada archivo
    for (const file of files) {
      // Validar
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push({
          filename: file.originalname,
          errors: validation.errors,
        });
        continue;
      }

      // Guardar
      try {
        const savedPath = await saveFile(file);
        uploadedImages.push({
          originalName: file.originalname,
          filename: path.basename(savedPath),
          path: savedPath,
          size: file.size,
          mimetype: file.mimetype,
        });
      } catch (error) {
        errors.push({
          filename: file.originalname,
          errors: [error.message],
        });
      }
    }

    return {
      success: uploadedImages.length > 0,
      message:
        uploadedImages.length > 0
          ? `${uploadedImages.length} imagen(es) cargada(s) correctamente`
          : "No se pudo cargar ninguna imagen",
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
      fields, // Otros campos del formulario
    };
  } catch (error) {
    return {
      success: false,
      message: "Error procesando imágenes: " + error.message,
      images: [],
    };
  }
}

module.exports = {
  processImages,
  deleteFile,
  validateFile,
  UPLOAD_CONFIG,
};
