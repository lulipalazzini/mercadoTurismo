import express from "express";
import {
  getEstadisticas,
  getFacturas,
} from "../controllers/facturacion.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken); // Todas las rutas requieren autenticación

router.get("/estadisticas", isAdmin, getEstadisticas);
router.get("/facturas", getFacturas);

export default router;
