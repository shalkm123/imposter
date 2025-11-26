import express from "express";
import Game from "../models/Game.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { gameId, playerCount, playerNames } = req.body;

    const newGame = new Game({
      gameId,
      playerCount,
      playerNames
    });

    await newGame.save();

    res.status(201).json({
      message: "Game created successfully",
      gameId
    });
  } catch (error) {
    console.error("Game Create Error:", error);
    res.status(500).json({ message: "Error creating game" });
  }
});

export default router;
