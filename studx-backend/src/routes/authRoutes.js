import express from "express";
import { 
  signup, 
  verifyOTP, 
  login, 
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";

const router = express.Router();

// Existing routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// 🆕 New forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
