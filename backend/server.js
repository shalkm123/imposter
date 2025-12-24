import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 REQUIRED for ES Modules + Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 FORCE load backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV FILE:", path.join(__dirname, ".env"));
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);


import express from "express";
import cors from "cors";

import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";





const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
