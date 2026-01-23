const express = require("express");
const {
  getEstadisticas,
  getFacturas,
} = require("../controllers/facturacion.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(verifyToken); // Todas las rutas requieren autenticación

router.get("/estadisticas", isAdmin, getEstadisticas);
router.get("/facturas", getFacturas);

module.exports = router;
