const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Solo se permiten imágenes (jpg, jpeg, png, gif, webp)",
      ),
    );
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por archivo
    files: 6, // Máximo 6 archivos
  },
  fileFilter: fileFilter,
});

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "El archivo es demasiado grande. Máximo 5MB por imagen.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Máximo 6 imágenes permitidas.",
      });
    }
    return res.status(400).json({
      message: "Error al subir archivo: " + err.message,
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message || "Error al procesar imágenes",
    });
  }
  next();
};

// Helper para eliminar archivos antiguos
const deleteOldImages = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return;

  imagePaths.forEach((imagePath) => {
    // Solo eliminar si es un path local (no URL externa)
    if (imagePath && !imagePath.startsWith("http")) {
      const fullPath = path.join(uploadDir, path.basename(imagePath));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  });
};

module.exports = {
  upload,
  handleMulterError,
  deleteOldImages,
  uploadDir,
};
