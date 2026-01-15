import express from "express";
import {
  getSalidasGrupales,
  getSalidaGrupal,
  createSalidaGrupal,
  updateSalidaGrupal,
  deleteSalidaGrupal,
} from "../controllers/salidasGrupales.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSalidasGrupales);
router.get("/:id", getSalidaGrupal);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createSalidaGrupal);
router.put("/:id", verifyToken, updateSalidaGrupal);
router.delete("/:id", verifyToken, deleteSalidaGrupal);

export default router;
