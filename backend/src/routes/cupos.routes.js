const express = require("express");
const {
  getCupos,
  getCupo,
  createCupo,
  updateCupo,
  deleteCupo,
} = require("../controllers/cupos.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getCupos);
router.get("/:id", getCupo);

// Cualquier usuario autenticado puede publicar y gestionar cupos
router.post("/", verifyToken, createCupo);
router.put("/:id", verifyToken, updateCupo);
router.delete("/:id", verifyToken, deleteCupo);

module.exports = router;
