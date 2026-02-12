const express = require("express");
const {
  getExcursiones,
  getExcursion,
  createExcursion,
  updateExcursion,
  deleteExcursion,
} = require("../controllers/excursiones.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { upload, handleMulterError } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getExcursiones);
router.get("/:id", getExcursion);

router.post("/", verifyToken, upload.array("imagenes", 6), handleMulterError, createExcursion);
router.put("/:id", verifyToken, upload.array("imagenes", 6), handleMulterError, updateExcursion);
router.delete("/:id", verifyToken, deleteExcursion);

module.exports = router;
