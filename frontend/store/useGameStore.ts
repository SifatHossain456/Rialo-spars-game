"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Prediction = "UP" | "DOWN" | null;

export interface GameRound {
  id: string;
  question: string;
  targetPrice: number;
  currentPrice: number;
  startPrice: number;
  direction: "UP" | "DOWN";
  timeLeft: number;
  totalVotes: number;
  upVotes: number;
  downVotes: number;
  status: "active" | "locked" | "settled";
  result?: "UP" | "DOWN";
  asset: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  username: string;
  xp: number;
  wins: number;
  streak: number;
  badge: string;
}

export interface UserProfile {
  address: string;
  username: string;
  xp: number;
  level: number;
  wins: number;
  losses: number;
  streak: number;
  maxStreak: number;
  totalPredictions: number;
  badges: string[];
  joinedAt: number;
}

interface GameStore {
  currentRound: GameRound | null;
  myPrediction: Prediction;
  leaderboard: LeaderboardEntry[];
  profile: UserProfile | null;
  priceHistory: { time: number; price: number }[];
  roundHistory: { roundId: string; prediction: Prediction; result: "UP" | "DOWN"; won: boolean }[];
  isConnected: boolean;

  setCurrentRound: (round: GameRound) => void;
  setMyPrediction: (prediction: Prediction) => void;
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setProfile: (profile: UserProfile) => void;
  addPricePoint: (price: number) => void;
  addRoundResult: (result: { roundId: string; prediction: Prediction; result: "UP" | "DOWN"; won: boolean }) => void;
  setConnected: (val: boolean) => void;
  incrementXP: (amount: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentRound: null,
      myPrediction: null,
      leaderboard: [],
      profile: null,
      priceHistory: [],
      roundHistory: [],
      isConnected: false,

      setCurrentRound: (round) => set({ currentRound: round }),
      setMyPrediction: (prediction) => set({ myPrediction: prediction }),
      setLeaderboard: (entries) => set({ leaderboard: entries }),
      setProfile: (profile) => set({ profile }),
      addPricePoint: (price) =>
        set((state) => ({
          priceHistory: [
            ...state.priceHistory.slice(-59),
            { time: Date.now(), price },
          ],
        })),
      addRoundResult: (result) =>
        set((state) => ({
          roundHistory: [result, ...state.roundHistory.slice(0, 19)],
        })),
      setConnected: (val) => set({ isConnected: val }),
      incrementXP: (amount) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, xp: state.profile.xp + amount }
            : null,
        })),
    }),
    {
      name: "rialo-rush-store",
      partialize: (state) => ({
        profile: state.profile,
        roundHistory: state.roundHistory,
      }),
    }
  )
);
