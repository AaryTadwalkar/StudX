import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";  // NEW
import skillRoutes from "./routes/skillRoutes.js";
import skillBarterRoutes from "./routes/skillBarterRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/messages", messageRoutes);  // NEW
app.use("/api/skills", skillRoutes);
app.use("/api/skill-barter", skillBarterRoutes);
// In studx-backend/src/server.js
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://studx.vercel.app", // We will try to get this URL, or update it later
    process.env.FRONTEND_URL // Good practice to use an env variable
  ],
  credentials: true
}));
// Health check
app.get("/", (req, res) => {
  res.json({ message: "StudX API is running!" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
