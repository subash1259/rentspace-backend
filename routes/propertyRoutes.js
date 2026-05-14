const express = require("express");
const router  = express.Router();

const {
  getAllProperties,
  getProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
} = require("../controllers/propertyController");

const {
  protect,
  ownerOnly,
} = require("../middleware/authMiddleware");

// ── Public Routes ──
router.get("/",          getAllProperties);
router.get("/:id",       getProperty);

// ── Owner Only Routes ──
router.post("/",         protect, ownerOnly, addProperty);
router.put("/:id",       protect, ownerOnly, updateProperty);
router.delete("/:id",    protect, ownerOnly, deleteProperty);
router.get("/owner/me",  protect, ownerOnly, getOwnerProperties);

module.exports = router;