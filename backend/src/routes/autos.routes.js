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

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createAuto);
router.put("/:id", verifyToken, isAdmin, updateAuto);
router.delete("/:id", verifyToken, isAdmin, deleteAuto);

export default router;
