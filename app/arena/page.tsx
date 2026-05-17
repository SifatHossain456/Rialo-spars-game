"use client";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useGameRound } from "@/hooks/useGameRound";
import { useGameStore } from "@/store/useGameStore";
import { PredictionCard } from "@/components/PredictionCard";
import { PriceChart } from "@/components/PriceChart";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { XPBar } from "@/components/XPBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, shortenAddress } from "@/lib/utils";

const MOCK_LEADERBOARD = [
  { rank: 1, address: "0xCrypt0K1ng0000", username: "Crypt0K1ng", xp: 142000, wins: 284, streak: 12, badge: "👑" },
  { rank: 2, address: "0xWhaleHunter111", username: "WhaleHunter", xp: 98000, wins: 196, streak: 7, badge: "🐋" },
  { rank: 3, address: "0xMoonPredictor2", username: "MoonPred", xp: 76000, wins: 152, streak: 5, badge: "🌙" },
  { rank: 4, address: "0xDegen4Life3333", username: "Degen4Life", xp: 54000, wins: 108, streak: 3, badge: "⚡" },
  { rank: 5, address: "0xSatoshi99999x", username: "Satoshi99", xp: 42000, wins: 84, streak: 2, badge: "₿" },
];

function StatCard({ label, value, icon: Icon, color }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 neon-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-gray-500 font-mono text-xs">{label}</span>
      </div>
      <div className="font-display font-bold text-xl text-white">{value}</div>
    </div>
  );
}

export default function ArenaPage() {
  const { address, isConnected } = useAccount();
  const { profile, roundHistory } = useGameStore();

  useGameRound();

  const wins = roundHistory.filter((r) => r.won).length;
  const losses = roundHistory.filter((r) => !r.won && r.prediction !== null).length;
  const streak = (() => {
    let s = 0;
    for (const r of roundHistory) {
      if (r.won) s++;
      else break;
    }
    return s;
  })();

  return (
    <div className="min-h-screen cyber-grid-bg px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-black gradient-text">
              THE ARENA
            </h1>
            <p className="text-gray-500 font-mono text-sm">
              Predict. Win. Dominate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-neon-green font-mono text-xs">LIVE</span>
          </div>
        </motion.div>

        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center mb-8 neon-border"
          >
            <Zap className="w-12 h-12 text-neon-green mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-display font-bold text-white mb-2">
              Connect to Compete
            </h2>
            <p className="text-gray-400 font-mono text-sm mb-6">
              Link your wallet to vote, earn XP, and climb the leaderboard
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </motion.div>
        )}

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 mb-6 neon-border flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center font-display font-bold text-neon-green">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-white font-mono text-sm font-semibold">
                {shortenAddress(address!)}
              </div>
              <XPBar xp={profile?.xp || 0} level={profile?.level || 1} />
            </div>
            <div className="text-right">
              <div className="text-neon-green font-display font-bold">
                {formatNumber(profile?.xp || 0)}
              </div>
              <div className="text-gray-500 font-mono text-xs">Total XP</div>
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        {isConnected && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Wins" value={wins} icon={TrendingUp} color="#00ff88" />
            <StatCard label="Losses" value={losses} icon={TrendingDown} color="#ff0080" />
            <StatCard label="Streak" value={`${streak}🔥`} icon={Zap} color="#ffd700" />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Prediction + Chart */}
          <div className="lg:col-span-2 space-y-6">
            <PredictionCard />
            <PriceChart />

            {/* Round History */}
            {roundHistory.length > 0 && (
              <div className="glass-card rounded-2xl p-5 neon-border">
                <h3 className="font-display font-bold text-white text-sm mb-4">
                  RECENT PREDICTIONS
                </h3>
                <div className="space-y-2">
                  {roundHistory.slice(0, 5).map((r, i) => (
                    <div
                      key={r.roundId}
                      className="flex items-center justify-between py-2 border-b border-dark-border last:border-0"
                    >
                      <span className="text-gray-500 font-mono text-xs">
                        Round #{r.roundId.slice(-6)}
                      </span>
                      <span className={`text-xs font-mono flex items-center gap-1 ${
                        r.prediction === "UP" ? "text-neon-green" : "text-pink-400"
                      }`}>
                        {r.prediction === "UP" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {r.prediction}
                      </span>
                      <span className={`text-xs font-display font-bold ${
                        r.won ? "text-neon-green" : "text-pink-400"
                      }`}>
                        {r.won ? "+100 XP" : "MISS"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Leaderboard */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5 neon-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white text-sm">
                  TOP PREDICTORS
                </h3>
                <span className="text-gray-500 font-mono text-xs">This Week</span>
              </div>
              <LeaderboardTable
                entries={MOCK_LEADERBOARD}
                currentAddress={address}
                compact
              />
            </div>

            {/* Missions */}
            <div className="glass-card rounded-2xl p-5 neon-border">
              <h3 className="font-display font-bold text-white text-sm mb-4">
                DAILY MISSIONS
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Win 3 rounds", reward: "+500 XP", done: wins >= 3 },
                  { label: "5 Win Streak", reward: "+1000 XP", done: streak >= 5 },
                  { label: "Predict 10 rounds", reward: "+300 XP", done: (wins + losses) >= 10 },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                      m.done
                        ? "bg-neon-green/20 border-neon-green text-neon-green"
                        : "border-dark-border"
                    }`}>
                      {m.done && "✓"}
                    </div>
                    <span className={`flex-1 font-mono text-xs ${
                      m.done ? "text-gray-500 line-through" : "text-white"
                    }`}>
                      {m.label}
                    </span>
                    <span className="text-neon-green font-mono text-xs">{m.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
