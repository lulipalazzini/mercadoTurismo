const express = require("express");
const {
  getReservasAnotador,
  createReservaAnotador,
  updateReservaAnotador,
  deleteReservaAnotador,
} = require("../controllers/reservasAnotador.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// CRUD de reservas anotador
// ADMIN ve todas, otros ven solo las propias
router.get("/", verifyToken, getReservasAnotador);
router.post("/", verifyToken, createReservaAnotador);
router.put("/:id", verifyToken, updateReservaAnotador);
router.delete("/:id", verifyToken, deleteReservaAnotador);

module.exports = router;
