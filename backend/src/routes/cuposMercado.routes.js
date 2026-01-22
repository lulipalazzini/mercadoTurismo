import express from "express";
import {
  getCuposMercado,
  getMisCupos,
  getCupoMercado,
  createCupoMercado,
  updateCupoMercado,
  deleteCupoMercado,
  importarCupos,
} from "../controllers/cuposMercado.controller.js";
import { verifyToken, canPublishCupos, canViewMarketplace } from "../middleware/auth.middleware.js";

const router = express.Router();

// Marketplace - solo agencias pueden ver
router.get("/marketplace", verifyToken, canViewMarketplace, getCuposMercado);

// Mis cupos - operadores y agencias
router.get("/mis-cupos", verifyToken, canPublishCupos, getMisCupos);

// Importar cupos desde Excel - operadores y agencias
router.post("/importar", verifyToken, canPublishCupos, importarCupos);

// CRUD de cupos - operadores y agencias
router.get("/:id", verifyToken, getCupoMercado);
router.post("/", verifyToken, canPublishCupos, createCupoMercado);
router.put("/:id", verifyToken, canPublishCupos, updateCupoMercado);
router.delete("/:id", verifyToken, deleteCupoMercado);

export default router;
