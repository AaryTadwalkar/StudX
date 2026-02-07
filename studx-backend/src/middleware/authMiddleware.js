import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify JWT token and attach user to request
 * Usage: Add this middleware to any route that requires authentication
 * 
 * Example:
 * router.get('/protected-route', authMiddleware, (req, res) => {
 *   // req.user is available here
 *   console.log(req.user); // { userId: '123abc', email: 'user@vit.edu' }
 * });
 */

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "No token provided. Please login." 
      });
    }

    // Extract token (format: "Bearer TOKEN_HERE")
    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "your-secret-key-change-this"
    );

    // 3. Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: "User not found. Please login again." 
      });
    }

    // 4. Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Email not verified." 
      });
    }

    // 5. Attach user to request object
    req.user = {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      branch: user.branch,
      year: user.year,
      prn: user.prn,
      phone: user.phone
    };

    // 6. Continue to next middleware/route handler
    next();

  } catch (err) {
    console.error("Auth middleware error:", err);

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }

    res.status(500).json({ message: "Server error during authentication" });
  }
};

export default authMiddleware;
