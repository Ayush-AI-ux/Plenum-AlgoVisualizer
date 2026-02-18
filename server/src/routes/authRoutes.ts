// import { Router } from "express";
// import { signup, login, forgotPassword,googleLogin, resetPassword } from "../controllers/authController";

// const router = Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/google-login", googleLogin);
// router.post("/reset-password", resetPassword);

// export default router;

import { Router, Request, Response } from "express";
import { signup, login, forgotPassword, googleLogin, resetPassword } from "../controllers/authController";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Existing routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/reset-password", resetPassword);

// ========================================
// NEW: Middleware to verify JWT token
// ========================================
interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ========================================
// NEW: GET /api/auth/me - Get current user profile
// ========================================
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        googleId: user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
});

// ========================================
// NEW: PUT /api/auth/update-profile - Update user profile
// ========================================
router.put("/update-profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        googleId: user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
});

export default router;