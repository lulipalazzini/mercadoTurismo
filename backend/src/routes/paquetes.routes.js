import express from "express";
import {
  getPaquetes,
  getPaquete,
  createPaquete,
  updatePaquete,
  deletePaquete,
} from "../controllers/paquetes.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPaquetes);
router.get("/:id", getPaquete);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createPaquete);
router.put("/:id", verifyToken, isAdmin, updatePaquete);
router.delete("/:id", verifyToken, isAdmin, deletePaquete);

export default router;
