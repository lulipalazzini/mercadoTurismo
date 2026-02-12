const express = require("express");
const {
  getSeguros,
  getSeguro,
  createSeguro,
  updateSeguro,
  deleteSeguro,
} = require("../controllers/seguros.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getSeguros);
router.get("/:id", getSeguro);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createSeguro);
router.put("/:id", verifyToken, isAdmin, updateSeguro);
router.delete("/:id", verifyToken, isAdmin, deleteSeguro);

module.exports = router;
