const express = require("express");
const {
  register,
  login,
  getProfile,
  updateUser,
  verifyAdminPassword,
} = require("../controllers/auth.controller");
const {
  validateCuitEndpoint,
  validateTaxIdEndpoint,
} = require("../controllers/validation.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/register-b2b", register);
router.post("/login", login);
router.post("/validate-cuit", validateCuitEndpoint);
router.post("/validate-tax-id", validateTaxIdEndpoint);
router.get("/profile", verifyToken, getProfile);
router.put("/update/:id", verifyToken, updateUser);
router.post("/verify-admin", verifyToken, verifyAdminPassword);

module.exports = router;
