const express = require("express");
const {
  getAutos,
  getAuto,
  createAuto,
  updateAuto,
  deleteAuto,
} = require("../controllers/autos.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAutos);
router.get("/:id", getAuto);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createAuto);
router.put("/:id", verifyToken, updateAuto);
router.delete("/:id", verifyToken, deleteAuto);

module.exports = router;
