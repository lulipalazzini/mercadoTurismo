const express = require("express");
const { 
  getPublicacionesDestacadas,
  getTiposServicios,
  getDestinos,
  getOrigenes 
} = require("../controllers/publicaciones.controller");

const router = express.Router();

// 🌟 Endpoint público para obtener publicaciones destacadas (sin autenticación)
router.get("/", getPublicacionesDestacadas);

// 📋 Endpoint público para obtener tipos de servicios disponibles (sin autenticación)
router.get("/tipos-servicios", getTiposServicios);

// 📍 Endpoint público para obtener destinos únicos (sin autenticación)
router.get("/destinos", getDestinos);

// 🛫 Endpoint público para obtener orígenes únicos (sin autenticación)
router.get("/origenes", getOrigenes);

module.exports = router;
