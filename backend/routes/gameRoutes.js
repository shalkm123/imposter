import express from "express";
import Game from "../models/Game.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { gameId, playerCount, playerNames } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const prompt = `
        Generate ${playerCount} simple words for a social deduction game.
        - ${playerCount - 1} words must be identical.
        - 1 word must be different but similar category.
        Return ONLY a JSON array. Example: ["Mango","Mango","Apple"]
        `;

        const result = await model.generateText({
        prompt,
        });

        console.log("Gemini:", result.response.text());
        let assignedWords = JSON.parse(result.response.text());

    // 3. Randomize imposter position
    const imposterIndex = assignedWords.findIndex(
      (w) => w !== assignedWords[0]
    );

    // 4. Save game in DB
    const newGame = await Game.create({
      gameId,
      playerCount,
      playerNames,
      assignedWords,
      imposterIndex
    });

    res.status(201).json({
      message: "Game created",
      game: newGame
    });
  } catch (error) {
    console.error("Game Create Error:", error);
    res.status(500).json({ message: "Error creating game" });
  }
});

router.get("/:gameId", authMiddleware, async (req, res) => {
  const { gameId } = req.params;

  const game = await Game.findOne({ gameId });

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  res.json(game);
});


export default router;
