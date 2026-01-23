const express = require("express");
const {
  getReservas,
  getReserva,
  createReserva,
  updateReserva,
  cancelReserva,
} = require("../controllers/reservas.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(verifyToken); // Todas las rutas requieren autenticación

router.get("/", getReservas);
router.get("/:id", getReserva);
router.post("/", createReserva);
router.put("/:id", updateReserva);
router.patch("/:id/cancel", cancelReserva);

module.exports = router;
