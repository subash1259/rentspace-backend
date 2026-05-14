const User     = require("../models/User");
const Property = require("../models/Property");

// ── ADD TO WISHLIST ──
const addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(req.user._id);

    // Already in wishlist check
    if (user.wishlist.includes(propertyId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(propertyId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Added to wishlist!",
      wishlist: user.wishlist,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── REMOVE FROM WISHLIST ──
const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== propertyId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist!",
      wishlist: user.wishlist,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET WISHLIST ──
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "wishlist",
        select: "title type location price beds baths area images status",
      });

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};