const express = require("express");
const router  = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// ── Wishlist Routes ──
router.get("/",                    protect, getWishlist);
router.post("/:propertyId",        protect, addToWishlist);
router.delete("/:propertyId",      protect, removeFromWishlist);

module.exports = router;