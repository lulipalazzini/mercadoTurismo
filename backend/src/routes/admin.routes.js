const express = require("express");
const {
  getAllUsersWithStats,
  getUserDetail,
  searchUsers,
  getUsuariosReport,
  getClientesReport,
  getClicksReport,
  getActivityReport,
  cambiarEstadoUsuario,
} = require("../controllers/admin.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// ⚠️ TODAS LAS RUTAS PROTEGIDAS SOLO PARA ADMIN

// 👥 Gestión de usuarios
router.get("/usuarios", verifyToken, isAdmin, getAllUsersWithStats);
router.get("/usuarios/search", verifyToken, isAdmin, searchUsers);
router.get("/usuarios/:id", verifyToken, isAdmin, getUserDetail);
router.put("/usuarios/:id/estado", verifyToken, isAdmin, cambiarEstadoUsuario);

// 📊 Reportes
router.get("/reportes/usuarios", verifyToken, isAdmin, getUsuariosReport);
router.get("/reportes/clientes", verifyToken, isAdmin, getClientesReport);
router.get("/reportes/clicks", verifyToken, isAdmin, getClicksReport);
router.get("/reportes/actividad", verifyToken, isAdmin, getActivityReport);

module.exports = router;
