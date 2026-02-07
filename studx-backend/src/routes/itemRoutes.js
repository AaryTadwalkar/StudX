import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createItem,
  getItems,
  getItemById,
  getMyListings,
  updateItem,
  deleteItem,
  markAsSold,
  uploadImage
} from "../controllers/itemController.js";

const router = express.Router();

// Public routes
router.get("/", getItems);                    // Get all items with filters
router.get("/:id", getItemById);              // Get single item

// Protected routes (require authentication)
router.post("/", protect, createItem);        // Create new item
router.get("/user/my-listings", protect, getMyListings);  // Get my listings
router.put("/:id", protect, updateItem);      // Update item
router.delete("/:id", protect, deleteItem);   // Delete item
router.patch("/:id/sold", protect, markAsSold); // Mark as sold

// Image upload route
router.post("/upload-image", protect, uploadImage); // Upload image to Cloudinary

export default router;
