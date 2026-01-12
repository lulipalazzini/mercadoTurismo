import express from "express";
import {
  getReservas,
  getReserva,
  createReserva,
  updateReserva,
  cancelReserva,
} from "../controllers/reservas.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken); // Todas las rutas requieren autenticación

router.get("/", getReservas);
router.get("/:id", getReserva);
router.post("/", createReserva);
router.put("/:id", updateReserva);
router.patch("/:id/cancel", cancelReserva);

export default router;
