import express from "express";
import {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from "../controllers/transfers.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getTransfers);
router.get("/:id", getTransfer);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createTransfer);
router.put("/:id", verifyToken, updateTransfer);
router.delete("/:id", verifyToken, deleteTransfer);

export default router;
