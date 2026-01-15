import express from "express";
import {
  getAutos,
  getAuto,
  createAuto,
  updateAuto,
  deleteAuto,
} from "../controllers/autos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAutos);
router.get("/:id", getAuto);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createAuto);
router.put("/:id", verifyToken, updateAuto);
router.delete("/:id", verifyToken, deleteAuto);

export default router;
