const express = require("express");
const router  = express.Router();

const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, ownerOnly, userOnly } = require("../middleware/authMiddleware");

// ── User Routes ──
router.post("/",          protect, createBooking);
router.get("/user",       protect, getUserBookings);
router.put("/cancel/:id", protect, cancelBooking);

// ── Owner Routes ──
router.get("/owner",      protect, ownerOnly, getOwnerBookings);
router.put("/:id",        protect, ownerOnly, updateBookingStatus);

module.exports = router;