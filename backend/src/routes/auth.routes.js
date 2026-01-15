import express from "express";
import { register, login, getProfile, updateUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/update/:id", verifyToken, updateUser);

export default router;
