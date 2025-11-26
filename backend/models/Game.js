import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: String,
  playerCount: Number,
  playerNames: [String],
  assignedWords: [String],   // <--- NEW
  imposterIndex: Number,     // <--- NEW
}, { timestamps: true });

export default mongoose.model("Game", gameSchema);
