const express = require("express");
const {
  register,
  login,
  getProfile,
  updateUser,
  verifyAdminPassword,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/update/:id", verifyToken, updateUser);
router.post("/verify-admin", verifyToken, verifyAdminPassword);

module.exports = router;
