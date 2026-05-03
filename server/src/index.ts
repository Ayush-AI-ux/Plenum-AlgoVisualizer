import dotenv from "dotenv";
dotenv.config();  // ← MUST be before all other imports

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import problemRoutes from "./routes/problemRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dsa-visualizer";

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "DSA 3D Visualizer API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      problems: "/api/problems",
      ai: "/api/ai",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;