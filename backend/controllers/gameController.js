import Game from "../models/Game.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createGame = async (req, res) => {
  try {
    const { gameId, playerCount, playerNames } = req.body;
    const n = Number(playerCount);

    if (!gameId || !n || !Array.isArray(playerNames) || playerNames.length !== n) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });

    const categories = ["Fruit","Animal","Vehicle","Tool","Sport","Country","Profession","Food","Object","Place"];
const category = categories[Math.floor(Math.random()*categories.length)];

const prompt = `
Return ONLY valid JSON (no markdown).
Schema: {"common":"<word>","odd":"<word>"}

Pick TWO single-word items from category: ${category}
- common and odd must be different
- not colors, not numbers

Example: {"common":"Mango","odd":"Apple"}
`.trim();


    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    console.log("Gemini raw:", raw);

    const cleaned = raw.replace(/```json\s*|```/gi, "").trim();
    const pair = JSON.parse(cleaned);

    const common = String(pair?.common || "").trim();
    const odd = String(pair?.odd || "").trim();

    if (!common || !odd || common.toLowerCase() === odd.toLowerCase()) {
      return res.status(500).json({ message: "Invalid Gemini word pair", raw });
    }

    const assignedWords = Array(n).fill(common);
    const imposterIndex = Math.floor(Math.random() * n);
    assignedWords[imposterIndex] = odd;

    const newGame = await Game.create({
      gameId,
      playerCount: n,
      playerNames,
      assignedWords,
      imposterIndex,
    });

    return res.status(201).json({ message: "Game created", game: newGame });
  } catch (err) {
    console.error("createGame error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findOne({ gameId });

    if (!game) return res.status(404).json({ message: "Game not found" });
    return res.json(game);
  } catch (err) {
    console.error("getGameById error:", err);
    return res.status(500).json({ message: err.message });
  }
};
