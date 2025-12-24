import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createGame, getGameById } from "../controllers/gameController.js";

const router = express.Router();

router.post("/create", authMiddleware, createGame);
router.get("/:gameId", authMiddleware, getGameById);

export default router;
