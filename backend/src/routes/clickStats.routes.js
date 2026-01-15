import express from "express";
import rateLimit from "express-rate-limit";
import {
  incrementClickCount,
  getAllStats,
  getStatByType,
} from "../controllers/clickStats.controller.js";

const router = express.Router();

// Rate limiting específico para el contador de clicks
const clickLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // Máximo 10 clics por IP cada 10 minutos
  message: { error: "Demasiados clics. Por favor intenta más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/stats/increment - Incrementar contador de un tipo de card
router.post("/increment", clickLimiter, incrementClickCount);

// GET /api/stats - Obtener todas las estadísticas
router.get("/", getAllStats);

// GET /api/stats/:cardType - Obtener estadística de un tipo específico
router.get("/:cardType", getStatByType);

export default router;
