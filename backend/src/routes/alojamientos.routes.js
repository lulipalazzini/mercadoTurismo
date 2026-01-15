import express from "express";
import {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
} from "../controllers/alojamientos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAlojamientos);
router.get("/:id", getAlojamiento);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createAlojamiento);
router.put("/:id", verifyToken, updateAlojamiento);
router.delete("/:id", verifyToken, deleteAlojamiento);

export default router;
