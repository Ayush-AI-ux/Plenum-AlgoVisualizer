// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// connectDB();

// app.get("/", (_, res) => {
//   res.send("Auth Server Running 🚀");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import problemRoutes from "./routes/problemRoutes";  // ⭐ NEW

dotenv.config();

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
app.use("/api/problems", problemRoutes);  // ⭐ NEW

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "DSA 3D Visualizer API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      problems: "/api/problems",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;