import { Router } from "express";

const router = Router();

const users: Record<string, { address: string; username?: string; xp: number; createdAt: number }> = {};

router.get("/:address", (req, res) => {
  const { address } = req.params;
  if (!users[address]) {
    users[address] = { address, xp: 0, createdAt: Date.now() };
  }
  res.json(users[address]);
});

router.post("/:address/username", (req, res) => {
  const { address } = req.params;
  const { username } = req.body as { username: string };

  if (!username || username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: "Username must be 3–20 characters" });
  }

  if (!users[address]) {
    users[address] = { address, xp: 0, createdAt: Date.now() };
  }
  users[address].username = username;

  res.json({ success: true, user: users[address] });
});

export default router;
