"use client";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGameStore } from "@/store/useGameStore";
import { Gift, Star, Zap, Lock, CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const REWARD_TIERS = [
  {
    id: "bronze",
    label: "Bronze Predictor",
    emoji: "🥉",
    xpRequired: 1000,
    rewards: ["Bronze Badge NFT", "Arena Access: Standard", "50 Bonus XP/round"],
    color: "#cd7f32",
  },
  {
    id: "silver",
    label: "Silver Analyst",
    emoji: "🥈",
    xpRequired: 5000,
    rewards: ["Silver Badge NFT", "Arena Access: Advanced", "Profile Border", "100 Bonus XP/round"],
    color: "#c0c0c0",
  },
  {
    id: "gold",
    label: "Gold Trader",
    emoji: "🏆",
    xpRequired: 15000,
    rewards: ["Gold Badge NFT", "VIP Arena Access", "Custom Profile Skin", "200 Bonus XP/round"],
    color: "#ffd700",
  },
  {
    id: "diamond",
    label: "Diamond Oracle",
    emoji: "💎",
    xpRequired: 50000,
    rewards: ["Diamond Badge NFT", "Exclusive Arena", "Legendary Profile Skin", "500 Bonus XP/round", "Season Champion Title"],
    color: "#00ffff",
  },
];

const CLAIMABLE = [
  { id: 1, label: "Daily Login Bonus", xp: 50, claimed: false, type: "daily" },
  { id: 2, label: "First Win of the Day", xp: 100, claimed: false, type: "daily" },
  { id: 3, label: "Week 1 Survivor", xp: 500, claimed: true, type: "achievement" },
  { id: 4, label: "Early Adopter Bonus", xp: 1000, claimed: false, type: "special" },
];

export default function RewardsPage() {
  const { isConnected } = useAccount();
  const { profile, roundHistory } = useGameStore();

  const xp = profile?.xp || 0;
  const wins = roundHistory.filter((r) => r.won).length;

  const currentTier = REWARD_TIERS.filter((t) => xp >= t.xpRequired).pop();
  const nextTier = REWARD_TIERS.find((t) => xp < t.xpRequired);

  if (!isConnected) {
    return (
      <div className="min-h-screen cyber-grid-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-sm neon-border"
        >
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-xl font-display font-bold text-white mb-2">Claim Your Rewards</h2>
          <p className="text-gray-400 font-mono text-sm mb-6">
            Connect your wallet to view and claim your earned rewards.
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid-bg px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-display font-black gradient-text mb-2">REWARDS</h1>
          <p className="text-gray-500 font-mono text-sm">Earn XP. Unlock tiers. Claim NFTs.</p>
        </motion.div>

        {/* Current Tier Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 neon-border text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none" />
          <div className="text-5xl mb-3">{currentTier?.emoji || "⚡"}</div>
          <div className="text-2xl font-display font-bold text-white mb-1">
            {currentTier?.label || "Unranked"}
          </div>
          <div className="text-neon-green font-mono text-sm mb-4">
            {formatNumber(xp)} XP earned
          </div>
          {nextTier && (
            <div className="bg-dark-bg/60 rounded-xl p-3 border border-neon-green/10">
              <p className="text-gray-400 font-mono text-xs mb-2">
                Next tier: <span className="text-white">{nextTier.label}</span>
              </p>
              <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, (xp / nextTier.xpRequired) * 100)}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-gray-600 font-mono text-xs mt-1 text-right">
                {formatNumber(nextTier.xpRequired - xp)} XP to go
              </p>
            </div>
          )}
        </motion.div>

        {/* Claimable Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 neon-border"
        >
          <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4 text-neon-green" />
            CLAIMABLE NOW
          </h3>
          <div className="space-y-3">
            {CLAIMABLE.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  item.claimed
                    ? "border-dark-border bg-dark-bg/30 opacity-50"
                    : "border-neon-green/20 bg-neon-green/5 hover:border-neon-green/40"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.type === "daily" ? "bg-neon-green/20" :
                  item.type === "special" ? "bg-neon-cyan/20" : "bg-purple-500/20"
                }`}>
                  {item.claimed
                    ? <CheckCircle className="w-5 h-5 text-gray-500" />
                    : item.type === "daily"
                    ? <Star className="w-5 h-5 text-neon-green" />
                    : item.type === "special"
                    ? <Zap className="w-5 h-5 text-neon-cyan" />
                    : <Gift className="w-5 h-5 text-purple-400" />}
                </div>
                <div className="flex-1">
                  <div className="text-white font-mono text-sm font-semibold">
                    {item.label}
                  </div>
                  <div className="text-gray-500 font-mono text-xs capitalize">{item.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-neon-green font-display font-bold text-sm">
                    +{item.xp} XP
                  </div>
                  <button
                    disabled={item.claimed}
                    className={`mt-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      item.claimed
                        ? "bg-dark-bg/30 text-gray-600 cursor-not-allowed"
                        : "btn-neon cursor-pointer"
                    }`}
                  >
                    {item.claimed ? "Claimed" : "Claim"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-neon-green" />
            REWARD TIERS
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {REWARD_TIERS.map((tier, i) => {
              const unlocked = xp >= tier.xpRequired;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`glass-card rounded-2xl p-5 border transition-all ${
                    unlocked
                      ? "border-opacity-50 bg-opacity-10"
                      : "border-dark-border opacity-60"
                  }`}
                  style={unlocked ? { borderColor: `${tier.color}40`, background: `${tier.color}05` } : {}}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{tier.emoji}</span>
                    <div>
                      <div className="font-display font-bold text-white text-sm">{tier.label}</div>
                      <div className="font-mono text-xs" style={{ color: tier.color }}>
                        {formatNumber(tier.xpRequired)} XP required
                      </div>
                    </div>
                    {!unlocked && <Lock className="w-4 h-4 text-gray-600 ml-auto" />}
                    {unlocked && <CheckCircle className="w-4 h-4 text-neon-green ml-auto" />}
                  </div>
                  <ul className="space-y-1">
                    {tier.rewards.map((r) => (
                      <li key={r} className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                        <span style={{ color: tier.color }}>▸</span> {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
