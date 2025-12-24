// controllers/authController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/mailer.js";

const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const genVerifyId = () => crypto.randomBytes(16).toString("hex"); // 32-char

export const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    // If verified user exists, block registration
    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP + store hashed OTP + expiry
    const otp = genOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // ✅ Create a verification session id (frontend will use this instead of email)
    const emailVerifyId = genVerifyId();

    // If user exists but not verified, update their details + resend OTP
    if (!user) {
      user = await User.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        emailOtpHash: otpHash,
        emailOtpExpiry: otpExpiry,
        emailVerifyId, // ✅ store
      });
    } else {
      user.username = username;
      user.password = hashedPassword;
      user.isVerified = false;
      user.emailOtpHash = otpHash;
      user.emailOtpExpiry = otpExpiry;
      user.emailVerifyId = emailVerifyId; // ✅ refresh
      await user.save();
    }

    console.log("📨 Sending OTP to:", normalizedEmail);
    console.log("🔑 OTP:", otp);

    await sendOtpEmail(normalizedEmail, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify to complete registration.",
      email: normalizedEmail,       // optional (UI display)
      emailVerifyId: emailVerifyId, // ✅ IMPORTANT for OTP-only verify page
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ✅ Verify email OTP (NO EMAIL REQUIRED)
export const verifyEmailOtp = async (req, res) => {
  try {
    const { emailVerifyId, otp } = req.body;

    if (!emailVerifyId || !otp) {
      return res.status(400).json({ message: "Verification ID and OTP are required" });
    }

    const user = await User.findOne({ emailVerifyId });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification session" });
    }

    if (user.isVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (!user.emailOtpHash || !user.emailOtpExpiry) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.emailOtpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const ok = await bcrypt.compare(String(otp), user.emailOtpHash);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiry = null;
    user.emailVerifyId = null; // ✅ invalidate session after success
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};

// ✅ Resend OTP (still needs email to send OTP), returns new verifyId
export const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = genOtp();
    user.emailOtpHash = await bcrypt.hash(otp, 10);
    user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ refresh verify session id
    user.emailVerifyId = genVerifyId();

    await user.save();
    await sendOtpEmail(normalizedEmail, otp);

    res.json({
      message: "OTP resent to email",
      emailVerifyId: user.emailVerifyId, // ✅ frontend must update state with this
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Resend OTP failed", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email?.toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Block login until verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Profile route for PlayerNames.jsx
export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
