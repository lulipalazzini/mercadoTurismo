import express from "express";
import {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from "../controllers/transfers.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getTransfers);
router.get("/:id", getTransfer);

// Solo admin puede crear, actualizar y eliminar
router.post("/", verifyToken, isAdmin, createTransfer);
router.put("/:id", verifyToken, isAdmin, updateTransfer);
router.delete("/:id", verifyToken, isAdmin, deleteTransfer);

export default router;
