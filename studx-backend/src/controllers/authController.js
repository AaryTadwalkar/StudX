import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import EmailOTP from "../models/EmailOTP.js";
import sendEmail from "../utils/sendEmail.js";
import generateOTP from "../utils/generateOTP.js";

// SIGNUP - Send OTP
export const signup = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email domain
    if (!email.endsWith("@vit.edu")) {
      return res.status(403).json({ message: "Only @vit.edu emails allowed" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    // Generate and send OTP
    const otp = generateOTP();

    // Delete old OTPs for this email
    await EmailOTP.deleteMany({ email });

    // Create new OTP record
    await EmailOTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // Send email
    await sendEmail(email, otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// VERIFY OTP - Complete registration
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password, fullName, year, branch, prn, phone } = req.body;

    // Validate all required fields
    if (!email || !otp || !password || !fullName || !year || !branch || !prn || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find OTP record
    const record = await EmailOTP.findOne({ email, otp });
    
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await EmailOTP.deleteMany({ email }); // Clean up expired OTPs
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Check if user already exists (shouldn't happen, but safety check)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      year: Number(year),
      branch,
      prn,
      email,
      phone,
      password: hashedPassword,
      isVerified: true
    });

    // Delete OTP record after successful verification
    await EmailOTP.deleteMany({ email });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Return token and user data
    res.json({
      success: true,
      token,
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
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, passwordProvided: !!password });

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check email domain
    if (!email.endsWith("@vit.edu")) {
      return res.status(403).json({ message: "Only @vit.edu emails allowed" });
    }

    // 3. Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "User not found. Please sign up first." });
    }

    console.log("User found:", { 
      id: user._id, 
      email: user.email, 
      isVerified: user.isVerified,
      hasPassword: !!user.password 
    });

    // 4. Check if user verified their email
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please complete signup process." });
    }

    // 5. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Password validation failed");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Password validated successfully");

    // 6. Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // 7. Return success response
    res.json({
      success: true,
      token,
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 🆕 FORGOT PASSWORD - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email domain
    if (!email.endsWith("@vit.edu")) {
      return res.status(403).json({ message: "Only @vit.edu emails allowed" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate and send OTP
    const otp = generateOTP();

    // Delete old OTPs for this email
    await EmailOTP.deleteMany({ email });

    // Create new OTP record
    await EmailOTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    // Send email
    await sendEmail(email, otp, "Password Reset");

    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🆕 RESET PASSWORD - Verify OTP and update password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find OTP record
    const record = await EmailOTP.findOne({ email, otp });
    
    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await EmailOTP.deleteMany({ email });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record
    await EmailOTP.deleteMany({ email });

    res.json({ success: true, message: "Password reset successful. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
