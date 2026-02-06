const express = require("express");
const {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete,
} = require("../controllers/paquetes.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { uploadImages } = require("../middleware/imageUpload.middleware");
const router = express.Router();

router.get("/", getPaquetes);
router.get("/:id", getPaquete);

// Usuarios autenticados pueden crear, actualizar y eliminar
// uploadImages procesa archivos si vienen en multipart/form-data
router.post("/", verifyToken, uploadImages, createPaquete);
router.put("/:id", verifyToken, uploadImages, updatePaquete);
router.delete("/:id", verifyToken, deletePaquete);

module.exports = router;
