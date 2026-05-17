import { Router } from "express";
import { getLeaderboard } from "../services/gameEngine";

const router = Router();

router.get("/", (_req, res) => {
  const board = getLeaderboard();
  res.json(board);
});

export default router;
