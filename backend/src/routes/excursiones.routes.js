const express = require("express");
const {
  getExcursiones,
  getExcursion,
  createExcursion,
  updateExcursion,
  deleteExcursion,
} = require("../controllers/excursiones.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getExcursiones);
router.get("/:id", getExcursion);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createExcursion);
router.put("/:id", verifyToken, updateExcursion);
router.delete("/:id", verifyToken, deleteExcursion);

module.exports = router;
