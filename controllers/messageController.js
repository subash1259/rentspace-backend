const Message  = require("../models/Message");
const Property = require("../models/Property");

// ── SEND MESSAGE ──
const sendMessage = async (req, res) => {
  try {
    const { propertyId, name, email, mobile, message } = req.body;

    if (!propertyId || !name || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get property owner
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newMessage = await Message.create({
      property: propertyId,
      sender:   req.user._id,
      receiver: property.owner,
      name,
      email,
      mobile,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET MESSAGES (for a property) ──
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      property: req.params.propertyId,
      receiver: req.user._id,
    })
      .populate("sender",   "username email mobile")
      .populate("property", "title location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET OWNER INBOX ──
const getOwnerInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender",   "username email mobile")
      .populate("property", "title location images")
      .sort({ createdAt: -1 });

    // Mark all as read
    await Message.updateMany(
      { receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET UNREAD COUNT ──
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead:   false,
    });

    return res.status(200).json({
      success: true,
      count,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getOwnerInbox,
  getUnreadCount,
};