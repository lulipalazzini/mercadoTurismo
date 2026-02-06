const express = require("express");
const {
  register,
  registerB2B,
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
router.post("/register-b2b", registerB2B); // Nuevo: Registro profesional
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/update/:id", verifyToken, updateUser);
router.post("/verify-admin", verifyToken, verifyAdminPassword);

// Endpoints de validación (sin autenticación, se usan durante registro)
router.post("/validate-cuit", validateCuitEndpoint); // Validar CUIT Argentina
router.post("/validate-tax-id", validateTaxIdEndpoint); // Validar Tax ID internacional

module.exports = router;
