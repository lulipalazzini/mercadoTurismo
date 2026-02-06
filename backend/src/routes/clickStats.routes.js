const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  incrementClickCount,
  getAllStats,
  getStatByType,
} = require("../controllers/clickStats.controller");

const router = express.Router();

// Rate limiting específico para el contador de clicks
const clickLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // Máximo 100 clics por IP cada 10 minutos
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

module.exports = router;
