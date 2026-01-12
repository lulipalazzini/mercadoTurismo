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

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createPasaje);
router.put("/:id", verifyToken, isAdmin, updatePasaje);
router.delete("/:id", verifyToken, isAdmin, deletePasaje);

export default router;
