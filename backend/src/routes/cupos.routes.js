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

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createCupo);
router.put("/:id", verifyToken, isAdmin, updateCupo);
router.delete("/:id", verifyToken, isAdmin, deleteCupo);

export default router;
