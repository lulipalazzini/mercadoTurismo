import express from "express";
import {
  getCircuitos,
  getCircuito,
  createCircuito,
  updateCircuito,
  deleteCircuito,
} from "../controllers/circuitos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCircuitos);
router.get("/:id", getCircuito);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createCircuito);
router.put("/:id", verifyToken, isAdmin, updateCircuito);
router.delete("/:id", verifyToken, isAdmin, deleteCircuito);

export default router;
