"use client";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGameStore } from "@/store/useGameStore";
import { XPBar } from "@/components/XPBar";
import { TrendingUp, TrendingDown, Zap, Award, Share2, Copy } from "lucide-react";
import { shortenAddress, formatNumber, getStreakEmoji } from "@/lib/utils";
import { useState } from "react";

const BADGES = [
  { id: "first_win", label: "First Blood", emoji: "🩸", desc: "Win your first prediction" },
  { id: "streak_3", label: "Hot Streak", emoji: "🔥", desc: "3 win streak" },
  { id: "streak_5", label: "On Fire", emoji: "🔥🔥", desc: "5 win streak" },
  { id: "streak_10", label: "Unstoppable", emoji: "⚡", desc: "10 win streak" },
  { id: "top_10", label: "Elite", emoji: "👑", desc: "Reach top 10 leaderboard" },
  { id: "veteran", label: "Veteran", emoji: "🎖️", desc: "100 total predictions" },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { profile, roundHistory } = useGameStore();
  const [copied, setCopied] = useState(false);

  const wins = roundHistory.filter((r) => r.won).length;
  const total = roundHistory.filter((r) => r.prediction !== null).length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const streak = (() => {
    let s = 0;
    for (const r of roundHistory) {
      if (r.won) s++;
      else break;
    }
    return s;
  })();

  const xp = profile?.xp || 0;
  const level = Math.floor(xp / 1000) + 1;

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen cyber-grid-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-10 text-center max-w-sm neon-border"
        >
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Your Profile
          </h2>
          <p className="text-gray-400 font-mono text-sm mb-6">
            Connect your wallet to view your stats, badges, and win history.
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid-bg px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 neon-border relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neon-green/20 border-2 border-neon-green/40 flex items-center justify-center font-display font-black text-2xl text-neon-green">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-mono font-semibold">
                  {shortenAddress(address!)}
                </span>
                <button
                  onClick={copyAddress}
                  className="text-gray-500 hover:text-neon-green transition-colors"
                >
                  {copied ? (
                    <span className="text-neon-green text-xs">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono">
                  Level {level}
                </span>
                <span className="text-gray-500 font-mono text-xs">
                  {formatNumber(xp)} XP total
                </span>
              </div>
              <XPBar xp={xp} level={level} />
            </div>
          </div>

          {/* Share button */}
          <button className="absolute top-4 right-4 btn-neon p-2 rounded-lg">
            <Share2 className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: "Total Wins", value: wins, icon: TrendingUp, color: "#00ff88" },
            { label: "Win Rate", value: `${winRate}%`, icon: Zap, color: "#ffd700" },
            { label: "Best Streak", value: `${streak} ${getStreakEmoji(streak)}`, icon: Award, color: "#ff0080" },
            { label: "Rounds Played", value: total, icon: TrendingDown, color: "#00ffff" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card rounded-xl p-4 neon-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <span className="text-gray-500 font-mono text-xs">{stat.label}</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 neon-border"
        >
          <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-neon-green" />
            BADGES
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const unlocked =
                (badge.id === "first_win" && wins >= 1) ||
                (badge.id === "streak_3" && streak >= 3) ||
                (badge.id === "streak_5" && streak >= 5) ||
                (badge.id === "streak_10" && streak >= 10) ||
                (badge.id === "veteran" && total >= 100);

              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-3 text-center transition-all ${
                    unlocked
                      ? "glass-card border border-neon-green/30 bg-neon-green/5"
                      : "bg-dark-bg/30 border border-dark-border opacity-40 grayscale"
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs font-display font-bold text-white">
                    {badge.label}
                  </div>
                  <div className="text-xs font-mono text-gray-600 mt-0.5">
                    {badge.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 neon-border"
        >
          <h3 className="font-display font-bold text-white mb-2">
            REFERRAL LINK
          </h3>
          <p className="text-gray-500 font-mono text-xs mb-4">
            Invite frens. Earn 200 XP for every player who joins.
          </p>
          <div className="flex items-center gap-2 p-3 bg-dark-bg/60 rounded-xl border border-neon-green/20">
            <span className="flex-1 text-neon-green font-mono text-xs truncate">
              rialo.rush/ref/{address?.slice(2, 10)}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://rialo.rush/ref/${address?.slice(2, 10)}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="btn-neon px-3 py-1.5 rounded-lg text-xs font-mono"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
