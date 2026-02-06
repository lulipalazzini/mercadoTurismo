const express = require("express");
const {
  getSalidasGrupales,
  getSalidaGrupal,
  createSalidaGrupal,
  updateSalidaGrupal,
  deleteSalidaGrupal,
} = require("../controllers/salidasGrupales.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getSalidasGrupales);
router.get("/:id", getSalidaGrupal);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createSalidaGrupal);
router.put("/:id", verifyToken, updateSalidaGrupal);
router.delete("/:id", verifyToken, deleteSalidaGrupal);

module.exports = router;
