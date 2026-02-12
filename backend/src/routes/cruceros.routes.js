const express = require("express");
const {
  getCruceros,
  getCrucero,
  createCrucero,
  updateCrucero,
  deleteCrucero,
} = require("../controllers/cruceros.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const {
  upload,
  handleMulterError,
} = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getCruceros);
router.get("/:id", getCrucero);

// Rutas protegidas - requieren autenticación + multer para imágenes
router.post(
  "/",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  createCrucero,
);
router.put(
  "/:id",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  updateCrucero,
);
router.delete("/:id", verifyToken, deleteCrucero);

module.exports = router;
