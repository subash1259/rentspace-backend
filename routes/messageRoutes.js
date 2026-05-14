const express = require("express");
const router  = express.Router();

const {
  sendMessage,
  getMessages,
  getOwnerInbox,
  getUnreadCount,
} = require("../controllers/messageController");

const { protect, ownerOnly } = require("../middleware/authMiddleware");

// ── User Routes ──
router.post("/",                    protect, sendMessage);
router.get("/inbox",                protect, ownerOnly, getOwnerInbox);
router.get("/unread",               protect, ownerOnly, getUnreadCount);
router.get("/:propertyId",          protect, ownerOnly, getMessages);

module.exports = router;