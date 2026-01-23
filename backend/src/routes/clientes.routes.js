const express = require("express");
const {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
} = require("../controllers/clientes.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(verifyToken); // Todas las rutas requieren autenticación

router.get("/", getClientes);
router.get("/:id", getCliente);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

module.exports = router;
