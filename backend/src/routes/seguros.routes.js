import express from "express";
import {
  getSeguros,
  getSeguro,
  createSeguro,
  updateSeguro,
  deleteSeguro,
} from "../controllers/seguros.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSeguros);
router.get("/:id", getSeguro);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createSeguro);
router.put("/:id", verifyToken, isAdmin, updateSeguro);
router.delete("/:id", verifyToken, isAdmin, deleteSeguro);

export default router;
