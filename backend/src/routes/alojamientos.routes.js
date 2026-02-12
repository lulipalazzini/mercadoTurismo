const express = require("express");
const {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
} = require("../controllers/alojamientos.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const {
  upload,
  handleMulterError,
} = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getAlojamientos);
router.get("/:id", getAlojamiento);

router.post(
  "/",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  createAlojamiento,
);
router.put(
  "/:id",
  verifyToken,
  upload.array("imagenes", 6),
  handleMulterError,
  updateAlojamiento,
);
router.delete("/:id", verifyToken, deleteAlojamiento);

module.exports = router;
