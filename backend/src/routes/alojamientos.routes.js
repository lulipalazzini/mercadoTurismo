const express = require("express");
const {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
} = require("../controllers/alojamientos.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAlojamientos);
router.get("/:id", getAlojamiento);

router.post("/", verifyToken, createAlojamiento);
router.put("/:id", verifyToken, updateAlojamiento);
router.delete("/:id", verifyToken, deleteAlojamiento);

module.exports = router;
