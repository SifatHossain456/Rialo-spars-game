import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import roundsRouter from "./routes/rounds";
import leaderboardRouter from "./routes/leaderboard";
import usersRouter from "./routes/users";
import { startGameEngine, placePrediction } from "./services/gameEngine";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/rounds", roundsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/users", usersRouter);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("predict", ({ address, roundId, choice }) => {
    const result = placePrediction(address, roundId, choice);
    socket.emit("predict:result", result);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

startGameEngine(io);

httpServer.listen(PORT, () => {
  console.log(`Rialo Rush backend running on port ${PORT}`);
});
