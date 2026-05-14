const Booking  = require("../models/Booking");
const Property = require("../models/Property");

// ── CREATE BOOKING ──
const createBooking = async (req, res) => {
  try {
    const {
      propertyId, name, email, mobile,
      visitDate, moveInDate, duration,
      specialRequests,
    } = req.body;

    // Get property
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Calculate amounts
    const totalRent    = property.price * duration;
    const deposit      = property.deposit;
    const firstPayment = property.price + deposit;

    const booking = await Booking.create({
      property:    propertyId,
      user:        req.user._id,
      owner:       property.owner,
      name,
      email,
      mobile,
      visitDate,
      moveInDate,
      duration,
      totalRent,
      deposit,
      firstPayment,
      specialRequests,
    });

    return res.status(201).json({
      success: true,
      booking,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET USER BOOKINGS ──
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("property", "title location price images type")
      .populate("owner",    "username mobile email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET OWNER BOOKINGS ──
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("property", "title location price images type")
      .populate("user",     "username mobile email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── UPDATE BOOKING STATUS (owner) ──
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check owner
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── CANCEL BOOKING (user) ──
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
};