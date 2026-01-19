import express from "express";
import {
  register,
  login,
  getProfile,
  updateUser,
  verifyAdminPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/update/:id", verifyToken, updateUser);
router.post("/verify-admin", verifyToken, verifyAdminPassword);

export default router;
