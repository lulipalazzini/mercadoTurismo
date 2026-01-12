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

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createSalidaGrupal);
router.put("/:id", verifyToken, isAdmin, updateSalidaGrupal);
router.delete("/:id", verifyToken, isAdmin, deleteSalidaGrupal);

export default router;
