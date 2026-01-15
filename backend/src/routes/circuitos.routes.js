import express from "express";
import {
  getCircuitos,
  getCircuito,
  createCircuito,
  updateCircuito,
  deleteCircuito,
} from "../controllers/circuitos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCircuitos);
router.get("/:id", getCircuito);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createCircuito);
router.put("/:id", verifyToken, updateCircuito);
router.delete("/:id", verifyToken, deleteCircuito);

export default router;
