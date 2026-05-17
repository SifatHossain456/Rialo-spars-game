import { v4 as uuidv4 } from "uuid";
import { Server } from "socket.io";
import { tickAllPrices, getPrice } from "./marketSimulator";

const ASSETS = ["BTC", "ETH", "SOL", "BNB"];
const ROUND_DURATION = 60;
const LOCK_PHASE = 10;

export interface Round {
  id: string;
  asset: string;
  question: string;
  startPrice: number;
  targetPrice: number;
  currentPrice: number;
  direction: "UP" | "DOWN";
  timeLeft: number;
  status: "active" | "locked" | "settled";
  result?: "UP" | "DOWN";
  upVotes: number;
  downVotes: number;
  totalVotes: number;
}

const inMemoryUsers: Record<string, { xp: number; wins: number; streak: number; username: string }> = {};

let currentRound: Round | null = null;
let roundTimer: NodeJS.Timeout | null = null;
let priceTimer: NodeJS.Timeout | null = null;

function generateRound(): Round {
  const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
  const startPrice = getPrice(asset);
  const direction = Math.random() > 0.5 ? "UP" : "DOWN";
  const targetPrice =
    direction === "UP"
      ? startPrice * (1 + Math.random() * 0.005)
      : startPrice * (1 - Math.random() * 0.005);

  return {
    id: uuidv4(),
    asset,
    question: `Will ${asset} ${direction === "UP" ? "rise above" : "drop below"} $${Math.round(targetPrice).toLocaleString()} in 60 seconds?`,
    startPrice,
    targetPrice: Math.round(targetPrice * 100) / 100,
    currentPrice: startPrice,
    direction,
    timeLeft: ROUND_DURATION,
    status: "active",
    upVotes: Math.floor(Math.random() * 50) + 10,
    downVotes: Math.floor(Math.random() * 50) + 10,
    totalVotes: 0,
  };
}

export function startGameEngine(io: Server) {
  function startNewRound() {
    const prices = tickAllPrices();
    currentRound = generateRound();
    currentRound.totalVotes = currentRound.upVotes + currentRound.downVotes;

    io.emit("round:new", currentRound);

    let elapsed = 0;

    roundTimer = setInterval(() => {
      if (!currentRound) return;
      elapsed++;
      currentRound.timeLeft = ROUND_DURATION - elapsed;

      if (currentRound.timeLeft <= LOCK_PHASE && currentRound.status === "active") {
        currentRound.status = "locked";
        io.emit("round:locked", { roundId: currentRound.id });
      }

      io.emit("round:tick", {
        roundId: currentRound.id,
        timeLeft: currentRound.timeLeft,
        status: currentRound.status,
      });

      if (elapsed >= ROUND_DURATION) {
        clearInterval(roundTimer!);
        settleRound(io);
      }
    }, 1000);
  }

  function settleRound(io: Server) {
    if (!currentRound) return;
    const finalPrice = currentRound.currentPrice;
    const result: "UP" | "DOWN" = finalPrice > currentRound.startPrice ? "UP" : "DOWN";

    currentRound.status = "settled";
    currentRound.result = result;

    io.emit("round:settled", {
      roundId: currentRound.id,
      result,
      finalPrice,
    });

    setTimeout(startNewRound, 5000);
  }

  priceTimer = setInterval(() => {
    if (!currentRound || currentRound.status === "settled") return;
    const prices = tickAllPrices();
    currentRound.currentPrice = prices[currentRound.asset] ?? currentRound.currentPrice;
    io.emit("price:update", {
      asset: currentRound.asset,
      price: currentRound.currentPrice,
      allPrices: prices,
    });
  }, 2000);

  startNewRound();
}

export function getCurrentRound(): Round | null {
  return currentRound;
}

export function placePrediction(
  address: string,
  roundId: string,
  choice: "UP" | "DOWN"
): { success: boolean; message: string } {
  if (!currentRound || currentRound.id !== roundId) {
    return { success: false, message: "Round not found" };
  }
  if (currentRound.status !== "active") {
    return { success: false, message: "Round is locked or settled" };
  }

  if (!inMemoryUsers[address]) {
    inMemoryUsers[address] = { xp: 0, wins: 0, streak: 0, username: `Player_${address.slice(2, 6)}` };
  }

  if (choice === "UP") currentRound.upVotes++;
  else currentRound.downVotes++;
  currentRound.totalVotes++;

  return { success: true, message: "Prediction placed" };
}

export function getLeaderboard() {
  return Object.entries(inMemoryUsers)
    .map(([address, data], i) => ({
      rank: i + 1,
      address,
      ...data,
      badge: data.streak >= 10 ? "👑" : data.streak >= 5 ? "🔥" : "⚡",
    }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 50)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}
