const express = require("express");
const router = express.Router();
const {
  getTrenes,
  getTren,
  createTren,
  updateTren,
  deleteTren,
} = require("../controllers/trenes.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { uploadImages } = require("../middleware/imageUpload.middleware");

// Rutas públicas
router.get("/", getTrenes);
router.get("/:id", getTren);

// Rutas protegidas - Usuarios autenticados pueden crear, actualizar y eliminar
router.post("/", verifyToken, uploadImages, createTren);
router.put("/:id", verifyToken, uploadImages, updateTren);
router.delete("/:id", verifyToken, deleteTren);

module.exports = router;
