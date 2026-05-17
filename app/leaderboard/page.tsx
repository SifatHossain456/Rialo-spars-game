"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Trophy, Flame, TrendingUp, Clock } from "lucide-react";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { cn } from "@/lib/utils";

const ALL_PLAYERS = [
  { rank: 1, address: "0xCrypt0K1ng0000", username: "Crypt0K1ng", xp: 142000, wins: 284, streak: 12, badge: "👑" },
  { rank: 2, address: "0xWhaleHunter111", username: "WhaleHunter", xp: 98000, wins: 196, streak: 7, badge: "🐋" },
  { rank: 3, address: "0xMoonPredictor2", username: "MoonPred", xp: 76000, wins: 152, streak: 5, badge: "🌙" },
  { rank: 4, address: "0xDegen4Life3333", username: "Degen4Life", xp: 54000, wins: 108, streak: 3, badge: "⚡" },
  { rank: 5, address: "0xSatoshi99999x", username: "Satoshi99", xp: 42000, wins: 84, streak: 2, badge: "₿" },
  { rank: 6, address: "0xNightTrader55", username: "NightTrader", xp: 38000, wins: 76, streak: 1, badge: "🌙" },
  { rank: 7, address: "0xApeStrong6666", username: "ApeStrong", xp: 31000, wins: 62, streak: 4, badge: "🦍" },
  { rank: 8, address: "0xZeroToHero777", username: "ZeroHero", xp: 27000, wins: 54, streak: 0, badge: "🚀" },
  { rank: 9, address: "0xDiamondHands8", username: "DiamondHnd", xp: 22000, wins: 44, streak: 2, badge: "💎" },
  { rank: 10, address: "0xRektNotRekt99", username: "NotRekt", xp: 18000, wins: 36, streak: 1, badge: "😤" },
];

const TABS = [
  { id: "weekly", label: "Weekly", icon: Trophy },
  { id: "alltime", label: "All Time", icon: TrendingUp },
  { id: "streaks", label: "Streaks", icon: Flame },
];

export default function LeaderboardPage() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("weekly");

  const sorted = [...ALL_PLAYERS].sort((a, b) => {
    if (activeTab === "streaks") return b.streak - a.streak;
    return b.xp - a.xp;
  }).map((p, i) => ({ ...p, rank: i + 1 }));

  const top3 = sorted.slice(0, 3);

  return (
    <div className="min-h-screen cyber-grid-bg px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-display font-black gradient-text mb-2">
            LEADERBOARD
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            The top predictors in the arena
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-10 items-end">
          {/* 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 text-center border border-gray-400/20 bg-gray-400/5 h-40 flex flex-col justify-end"
          >
            <div className="text-3xl mb-2">🥈</div>
            <div className="font-mono font-semibold text-sm text-white truncate">
              {top3[1]?.username}
            </div>
            <div className="text-neon-green font-display font-bold text-sm">
              {(top3[1]?.xp / 1000).toFixed(1)}K XP
            </div>
          </motion.div>

          {/* 1st */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 text-center border border-yellow-400/40 bg-yellow-400/5 h-52 flex flex-col justify-end pulse-glow"
          >
            <div className="text-4xl mb-2">👑</div>
            <div className="font-mono font-semibold text-sm text-white truncate">
              {top3[0]?.username}
            </div>
            <div className="text-neon-green font-display font-bold">
              {(top3[0]?.xp / 1000).toFixed(1)}K XP
            </div>
            <div className="text-yellow-400 font-mono text-xs mt-1">
              {top3[0]?.streak} win streak 🔥
            </div>
          </motion.div>

          {/* 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-4 text-center border border-orange-600/20 bg-orange-600/5 h-36 flex flex-col justify-end"
          >
            <div className="text-3xl mb-2">🥉</div>
            <div className="font-mono font-semibold text-sm text-white truncate">
              {top3[2]?.username}
            </div>
            <div className="text-neon-green font-display font-bold text-sm">
              {(top3[2]?.xp / 1000).toFixed(1)}K XP
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-sm transition-all",
                activeTab === id
                  ? "bg-neon-green/20 border border-neon-green/50 text-neon-green"
                  : "glass-card text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LeaderboardTable
            entries={sorted}
            currentAddress={address}
          />
        </motion.div>

        {/* Season info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="glass-card rounded-2xl p-5 mt-8 neon-border text-center"
        >
          <Clock className="w-5 h-5 text-neon-green mx-auto mb-2" />
          <p className="text-white font-display font-bold text-sm mb-1">
            SEASON 1 ENDS IN
          </p>
          <p className="text-neon-green font-display font-bold text-2xl">
            6d 14h 32m
          </p>
          <p className="text-gray-500 font-mono text-xs mt-2">
            Top 10 players earn exclusive NFT badges + Season Champion title
          </p>
        </motion.div>
      </div>
    </div>
  );
}
