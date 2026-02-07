const express = require("express");
const {
  getFacturacionAnotador,
  createFacturacionAnotador,
  updateFacturacionAnotador,
  deleteFacturacionAnotador,
} = require("../controllers/facturacionAnotador.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// CRUD de facturación anotador
// ADMIN ve todas, otros ven solo las propias
router.get("/", verifyToken, getFacturacionAnotador);
router.post("/", verifyToken, createFacturacionAnotador);
router.put("/:id", verifyToken, updateFacturacionAnotador);
router.delete("/:id", verifyToken, deleteFacturacionAnotador);

module.exports = router;
