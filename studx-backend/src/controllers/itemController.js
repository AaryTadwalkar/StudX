import Item from "../models/Item.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
  try {
    if (!req.file && !req.body.image) {
      return res.status(400).json({ message: "No image provided" });
    }

    let result;
    
    // If image is base64
    if (req.body.image) {
      result = await cloudinary.uploader.upload(req.body.image, {
        folder: 'studx/marketplace',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      });
    } 
    // If image is file upload (multipart/form-data)
    else if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'studx/marketplace',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      });
    }

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

// Create a new item listing
export const createItem = async (req, res) => {
  try {
    const { name, description, price, category, customCategory, condition, images, location } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    // Get seller info from authenticated user
    const seller = await User.findById(req.user._id); // ← FIXED: Changed from req.user.id to req.user._id
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Create new item
    const newItem = new Item({
      name,
      description: description || "No description provided",
      price: Number(price),
      category,
      customCategory: category === 'Other' ? customCategory : null,
      condition: condition || 'Good',
      images: images || [],
      seller: req.user._id, // ← FIXED: Changed from req.user.id to req.user._id
      sellerName: seller.fullName, // ← FIXED: Changed from seller.name to seller.fullName
      sellerEmail: seller.email,
      location: location || 'VIT Campus'
    });

    await newItem.save();

    // Populate seller info before sending response
    await newItem.populate('seller', 'fullName email phone branch');

    res.status(201).json({
      message: "Item listed successfully",
      item: newItem
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ message: "Failed to create item", error: error.message });
  }
};

// Get all items with filters and search
export const getItems = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      condition, 
      status = 'available',
      seller,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter query
    const filter = { isAvailable: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (condition) {
      filter.condition = condition;
    }

    if (status) {
      filter.status = status;
    }

    if (seller) {
      filter.seller = seller;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const items = await Item.find(filter)
      .populate('seller', 'fullName email phone branch')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ message: "Failed to fetch items", error: error.message });
  }
};

// Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate('seller', 'fullName email phone branch');

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Increment view count
    item.views += 1;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ message: "Failed to fetch item", error: error.message });
  }
};

// Get items by current user (My Listings)
export const getMyListings = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id }) // ← FIXED: Changed from req.user.id to req.user._id
      .sort('-createdAt')
      .populate('seller', 'fullName email phone branch');

    res.status(200).json(items);
  } catch (error) {
    console.error("Get my listings error:", error);
    res.status(500).json({ message: "Failed to fetch your listings", error: error.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, customCategory, condition, images, location, status, isAvailable } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user is the seller
    if (item.seller.toString() !== req.user._id.toString()) { // ← FIXED: Changed from req.user.id to req.user._id
      return res.status(403).json({ message: "You can only update your own listings" });
    }

    // Update fields
    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = Number(price);
    if (category) item.category = category;
    if (customCategory !== undefined) item.customCategory = category === 'Other' ? customCategory : null;
    if (condition) item.condition = condition;
    if (images) item.images = images;
    if (location) item.location = location;
    if (status) item.status = status;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    await item.save();
    await item.populate('seller', 'fullName email phone branch');

    res.status(200).json({
      message: "Item updated successfully",
      item
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user is the seller
    if (item.seller.toString() !== req.user._id.toString()) { // ← FIXED: Changed from req.user.id to req.user._id
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
};

// Mark item as sold
export const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user is the seller
    if (item.seller.toString() !== req.user._id.toString()) { // ← FIXED: Changed from req.user.id to req.user._id
      return res.status(403).json({ message: "You can only update your own listings" });
    }

    item.status = 'sold';
    item.isAvailable = false;
    await item.save();

    res.status(200).json({
      message: "Item marked as sold",
      item
    });
  } catch (error) {
    console.error("Mark as sold error:", error);
    res.status(500).json({ message: "Failed to mark item as sold", error: error.message });
  }
};
