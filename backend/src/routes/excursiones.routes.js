import express from "express";
import {
  getExcursiones,
  getExcursion,
  createExcursion,
  updateExcursion,
  deleteExcursion,
} from "../controllers/excursiones.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getExcursiones);
router.get("/:id", getExcursion);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createExcursion);
router.put("/:id", verifyToken, isAdmin, updateExcursion);
router.delete("/:id", verifyToken, isAdmin, deleteExcursion);

export default router;
