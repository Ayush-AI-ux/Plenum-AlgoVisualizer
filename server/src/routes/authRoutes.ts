import { Router } from "express";
import { signup, login, forgotPassword,googleLogin, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/reset-password", resetPassword);

export default router;