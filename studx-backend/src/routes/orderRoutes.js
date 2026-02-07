
// Add these imports
import skillRoutes from "./routes/skillRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Add these routes
app.use("/api/skills", skillRoutes);
app.use("/api/orders", orderRoutes);