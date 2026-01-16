import express from "express";
import {
  getCuposMercado,
  getCupoMercado,
  createCupoMercado,
  updateCupoMercado,
  deleteCupoMercado,
} from "../controllers/cuposMercado.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCuposMercado);
router.get("/:id", getCupoMercado);

// Cualquier usuario autenticado puede publicar y gestionar cupos del mercado
router.post("/", verifyToken, createCupoMercado);
router.put("/:id", verifyToken, updateCupoMercado);
router.delete("/:id", verifyToken, deleteCupoMercado);

export default router;
