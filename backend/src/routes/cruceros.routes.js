import express from "express";
import {
  getCruceros,
  getCrucero,
  createCrucero,
  updateCrucero,
  deleteCrucero,
} from "../controllers/cruceros.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCruceros);
router.get("/:id", getCrucero);

// Rutas protegidas - requieren autenticación
router.post("/", verifyToken, createCrucero);
router.put("/:id", verifyToken, updateCrucero);
router.delete("/:id", verifyToken, deleteCrucero);

export default router;
