import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const secret = process.env.JWT_SECRET || "your-secret-key-change-this";
      const decoded = jwt.verify(token, secret);

      // 3. Handle payload variations (supports both 'id' and 'userId')
      const userId = decoded.userId || decoded.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authorized, invalid token structure" });
      }

      // 4. Fetch the full user from DB
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // ✅ CRITICAL FIX: Attach both the full user object AND userId
      req.user = user;
      req.user.userId = user._id.toString(); // Ensure userId is always available

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
