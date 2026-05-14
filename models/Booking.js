const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required"],
  },
  visitDate: {
    type: Date,
    required: [true, "Visit date is required"],
  },
  moveInDate: {
    type: Date,
    required: [true, "Move-in date is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  totalRent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  firstPayment: {
    type: Number,
    required: true,
  },
  specialRequests: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "rejected"],
    default: "pending",
  },
  bookingId: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

// ── Auto generate bookingId ──
bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = "BK" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
