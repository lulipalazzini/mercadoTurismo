import express from "express";
import {
  getExcursiones,
  getExcursion,
  createExcursion,
  updateExcursion,
  deleteExcursion,
} from "../controllers/excursiones.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getExcursiones);
router.get("/:id", getExcursion);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createExcursion);
router.put("/:id", verifyToken, updateExcursion);
router.delete("/:id", verifyToken, deleteExcursion);

export default router;
