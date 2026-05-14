const User = require("../models/User");
const jwt  = require("jsonwebtoken");

// ── Generate JWT Token ──
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ── REGISTER ──
const register = async (req, res) => {
  try {
    const { username, email, mobile, password, role } = req.body;

    if (!username || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { mobile }, { username }]
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      username,
      email,
      mobile,
      password,
      role: role || "user",
    });

    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id:      user._id,
        username: user.username,
        email:    user.email,
        mobile:   user.mobile,
        role:     user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ── LOGIN ──
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(401).json({
        message: `This account is registered as ${user.role}, not ${role}`
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id:      user._id,
        username: user.username,
        email:    user.email,
        mobile:   user.mobile,
        role:     user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET PROFILE ──
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── UPDATE PROFILE ──
const updateProfile = async (req, res) => {
  try {
    const { username, email, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, mobile },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, user });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };