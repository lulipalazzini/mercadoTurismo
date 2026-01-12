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

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createCrucero);
router.put("/:id", verifyToken, isAdmin, updateCrucero);
router.delete("/:id", verifyToken, isAdmin, deleteCrucero);

export default router;
