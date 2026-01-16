import express from "express";
import {
  getCupos,
  getCupo,
  createCupo,
  updateCupo,
  deleteCupo,
} from "../controllers/cupos.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCupos);
router.get("/:id", getCupo);

// Cualquier usuario autenticado puede publicar y gestionar cupos
router.post("/", verifyToken, createCupo);
router.put("/:id", verifyToken, updateCupo);
router.delete("/:id", verifyToken, deleteCupo);

export default router;
