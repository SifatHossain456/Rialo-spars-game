import { Router } from "express";
import { getCurrentRound, placePrediction } from "../services/gameEngine";

const router = Router();

router.get("/current", (_req, res) => {
  const round = getCurrentRound();
  if (!round) return res.status(404).json({ error: "No active round" });
  res.json(round);
});

router.post("/predict", (req, res) => {
  const { address, roundId, choice } = req.body as {
    address: string;
    roundId: string;
    choice: "UP" | "DOWN";
  };

  if (!address || !roundId || !choice) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (choice !== "UP" && choice !== "DOWN") {
    return res.status(400).json({ error: "Invalid choice" });
  }

  const result = placePrediction(address, roundId, choice);
  if (!result.success) return res.status(400).json({ error: result.message });

  res.json({ success: true });
});

export default router;
