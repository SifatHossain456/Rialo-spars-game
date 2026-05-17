"use client";
import { useEffect, useRef } from "react";
import { useGameStore, GameRound } from "@/store/useGameStore";
import { generatePriceMovement } from "@/lib/utils";

const ASSETS = ["BTC", "ETH", "SOL", "BNB"];
const BASE_PRICES: Record<string, number> = {
  BTC: 108500,
  ETH: 3800,
  SOL: 185,
  BNB: 620,
};

const QUESTIONS = [
  (asset: string, target: number) =>
    `Will ${asset} cross $${target.toLocaleString()} in 60 seconds?`,
  (asset: string, target: number) =>
    `Will ${asset} pump above $${target.toLocaleString()}?`,
  (asset: string, target: number) =>
    `${asset} prediction: above $${target.toLocaleString()} or below?`,
];

function generateRound(): GameRound {
  const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
  const basePrice = BASE_PRICES[asset];
  const volatility = 0.003;
  const startPrice = generatePriceMovement(basePrice, volatility);
  const direction = Math.random() > 0.5 ? "UP" : "DOWN";
  const targetPrice =
    direction === "UP"
      ? startPrice * (1 + Math.random() * 0.005)
      : startPrice * (1 - Math.random() * 0.005);

  const questionFn = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

  return {
    id: `round_${Date.now()}`,
    question: questionFn(asset, Math.round(targetPrice)),
    targetPrice: Math.round(targetPrice * 100) / 100,
    currentPrice: startPrice,
    startPrice,
    direction,
    timeLeft: 60,
    totalVotes: Math.floor(Math.random() * 200) + 50,
    upVotes: 0,
    downVotes: 0,
    status: "active",
    asset,
  };
}

export function useGameRound() {
  const { currentRound, setCurrentRound, addPricePoint, addRoundResult, myPrediction, setMyPrediction, incrementXP } =
    useGameStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roundRef = useRef<GameRound | null>(null);

  useEffect(() => {
    if (!currentRound) {
      const newRound = generateRound();
      setCurrentRound(newRound);
      roundRef.current = newRound;
    }
  }, []);

  useEffect(() => {
    if (!currentRound) return;
    roundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const round = roundRef.current;
      if (!round) return;

      if (round.status === "settled") {
        setTimeout(() => {
          const newRound = generateRound();
          setCurrentRound(newRound);
          setMyPrediction(null);
        }, 3000);
        return;
      }

      const newTimeLeft = round.timeLeft - 1;
      let newStatus = round.status;

      if (newTimeLeft <= 10 && round.status === "active") {
        newStatus = "locked";
      }

      if (newTimeLeft <= 0) {
        const won =
          (round.currentPrice > round.startPrice && myPrediction === "UP") ||
          (round.currentPrice < round.startPrice && myPrediction === "DOWN");

        const result: "UP" | "DOWN" = round.currentPrice > round.startPrice ? "UP" : "DOWN";

        const updatedRound: GameRound = {
          ...round,
          timeLeft: 0,
          status: "settled",
          result,
        };
        setCurrentRound(updatedRound);

        if (myPrediction) {
          addRoundResult({ roundId: round.id, prediction: myPrediction, result, won });
          if (won) incrementXP(100);
        }
        return;
      }

      const updatedRound: GameRound = {
        ...round,
        timeLeft: newTimeLeft,
        status: newStatus,
      };
      setCurrentRound(updatedRound);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentRound?.id]);

  useEffect(() => {
    priceIntervalRef.current = setInterval(() => {
      const round = roundRef.current;
      if (!round || round.status === "settled") return;

      const asset = round.asset;
      const newPrice = generatePriceMovement(round.currentPrice, 0.001);
      addPricePoint(newPrice);

      const updatedRound: GameRound = { ...round, currentPrice: newPrice };
      setCurrentRound(updatedRound);
    }, 2000);

    return () => {
      if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
    };
  }, [currentRound?.id]);
}
