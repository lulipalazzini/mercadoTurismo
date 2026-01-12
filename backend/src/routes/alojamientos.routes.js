import express from "express";
import {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
} from "../controllers/alojamientos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAlojamientos);
router.get("/:id", getAlojamiento);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createAlojamiento);
router.put("/:id", verifyToken, isAdmin, updateAlojamiento);
router.delete("/:id", verifyToken, isAdmin, deleteAlojamiento);

export default router;
