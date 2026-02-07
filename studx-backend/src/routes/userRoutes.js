import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 * Protected route - requires authentication
 */
router.get("/me", protect, async (req, res) => {
  try {
    // req.user is already attached by protect middleware
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        branch: user.branch,
        year: user.year,
        prn: user.prn,
        phone: user.phone,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/users/update-profile
 * Update user profile (name, phone, branch, year)
 * Protected route - requires authentication
 */
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { fullName, phone, branch, year } = req.body;

    // Validate input
    if (!fullName || !phone || !branch || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        phone,
        branch,
        year: Number(year)
      },
      { new: true } // Return updated document
    ).select('-password');

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.fullName,
        email: user.email,
        branch: user.branch,
        year: user.year,
        prn: user.prn,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/users/change-password
 * Change user password
 * Protected route - requires authentication
 */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Get user with password
    const user = await User.findById(req.user.userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/users/verify-token
 * Verify if token is still valid
 * Protected route - requires authentication
 */
router.get("/verify-token", protect, async (req, res) => {
  // If we reach here, token is valid (protect middleware passed)
  res.json({
    success: true,
    valid: true,
    user: req.user
  });
});

export default router;
