const express = require("express");
const {
  getCruceros,
  getCrucero,
  createCrucero,
  updateCrucero,
  deleteCrucero,
} = require("../controllers/cruceros.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getCruceros);
router.get("/:id", getCrucero);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createCrucero);
router.put("/:id", verifyToken, updateCrucero);
router.delete("/:id", verifyToken, deleteCrucero);

module.exports = router;
