import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. DEBUG LOGS (Check your terminal for these!)
      // console.log("Verifying token:", token);

      // 3. Verify token (Using the same fallback secret as your controller)
      const secret = process.env.JWT_SECRET || "your-secret-key-change-this";
      const decoded = jwt.verify(token, secret);

      console.log("Decoded Payload:", decoded); // <--- LOOK AT THIS IN TERMINAL

      // 4. Check if 'userId' or 'id' exists in payload
      const userId = decoded.userId || decoded.id; 
      
      if (!userId) {
        console.log("No ID found in token payload");
        return res.status(401).json({ message: "Invalid token payload" });
      }

      // 5. Find user in database
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        console.log("Token valid, but User ID not found in DB:", userId);
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};