const Property = require("../models/Property");

// ── GET ALL PROPERTIES (with filter + search) ──
const getAllProperties = async (req, res) => {
  try {
    const {
      type, location, minPrice,
      maxPrice, beds, furnished, search
    } = req.query;

    let query = { status: "active" };

    if (type)      query.type     = type;
    if (location)  query.location = location;
    if (beds)      query.beds     = Number(beds);
    if (furnished) query.furnished = furnished;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query)
      .populate("owner", "username email mobile avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE PROPERTY ──
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "username email mobile avatar");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // increment views
    property.views += 1;
    await property.save();

    return res.status(200).json({
      success: true,
      property,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── ADD PROPERTY (owner only) ──
const addProperty = async (req, res) => {
  try {
    const {
      title, type, location, fullAddress,
      price, deposit, beds, baths, area,
      floor, furnished, facing, parking,
      availableFrom, amenities, description,
    } = req.body;

    const property = await Property.create({
      owner: req.user._id,
      title, type, location, fullAddress,
      price, deposit, beds, baths, area,
      floor, furnished, facing, parking,
      availableFrom, amenities, description,
    });

    return res.status(201).json({
      success: true,
      property,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── UPDATE PROPERTY (owner only) ──
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      property: updated,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── DELETE PROPERTY (owner only) ──
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await property.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── GET OWNER PROPERTIES ──
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProperties,
  getProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
};