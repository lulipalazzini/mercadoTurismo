const express = require("express");
const {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete,
} = require("../controllers/paquetes.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getPaquetes);
router.get("/:id", getPaquete);

// Usuarios autenticados pueden crear, actualizar y eliminar
router.post("/", verifyToken, createPaquete);
router.put("/:id", verifyToken, updatePaquete);
router.delete("/:id", verifyToken, deletePaquete);

module.exports = router;
