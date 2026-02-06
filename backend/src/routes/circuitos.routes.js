const express = require("express");
const {
  getCircuitos,
  getCircuito,
  createCircuito,
  updateCircuito,
  deleteCircuito,
} = require("../controllers/circuitos.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getCircuitos);
router.get("/:id", getCircuito);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createCircuito);
router.put("/:id", verifyToken, updateCircuito);
router.delete("/:id", verifyToken, deleteCircuito);

module.exports = router;
