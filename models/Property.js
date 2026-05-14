const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["House", "PG", "Hostel", "Apartment", "Office"],
    required: [true, "Property type is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  fullAddress: {
    type: String,
    required: [true, "Full address is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  deposit: {
    type: Number,
    default: 0,
  },
  beds: {
    type: Number,
    default: null,
  },
  baths: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  floor: {
    type: String,
    default: "",
  },
  furnished: {
    type: String,
    enum: ["Fully Furnished", "Semi-Furnished", "Unfurnished"],
    default: "Unfurnished",
  },
  facing: {
    type: String,
    enum: ["East", "West", "North", "South"],
    default: "East",
  },
  parking: {
    type: String,
    enum: ["Covered", "Open", "None"],
    default: "None",
  },
  availableFrom: {
    type: Date,
  },
  amenities: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  views: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);