import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  verifyEmailOtp,
  resendEmailOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmailOtp);
router.post("/resend-otp", resendEmailOtp);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

export default router;
