const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required"],
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  }],
}, { timestamps: true });

// ── Password hash ──
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Password compare ──
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);