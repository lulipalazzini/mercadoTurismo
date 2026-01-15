import express from "express";
import {
  getPasajes,
  getPasaje,
  createPasaje,
  updatePasaje,
  deletePasaje,
} from "../controllers/pasajes.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPasajes);
router.get("/:id", getPasaje);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createPasaje);
router.put("/:id", verifyToken, updatePasaje);
router.delete("/:id", verifyToken, deletePasaje);

export default router;
