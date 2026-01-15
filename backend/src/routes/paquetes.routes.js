import express from "express";
import {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete,
} from "../controllers/paquetes.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPaquetes);
router.get("/:id", getPaquete);

// Usuarios autenticados pueden crear, actualizar y eliminar
router.post("/", verifyToken, createPaquete);
router.put("/:id", verifyToken, updatePaquete);
router.delete("/:id", verifyToken, deletePaquete);

export default router;
