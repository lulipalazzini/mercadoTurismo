const express = require("express");
const {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} = require("../controllers/transfers.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getTransfers);
router.get("/:id", getTransfer);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createTransfer);
router.put("/:id", verifyToken, updateTransfer);
router.delete("/:id", verifyToken, deleteTransfer);

module.exports = router;
