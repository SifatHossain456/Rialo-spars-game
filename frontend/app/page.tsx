"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, Trophy, Shield, TrendingUp, Users, Cpu } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Live Prediction Rounds",
    desc: "60-second rounds with real-time price simulation. Vote UP or DOWN and earn XP instantly.",
    color: "#00ff88",
  },
  {
    icon: Trophy,
    title: "Competitive Leaderboard",
    desc: "Weekly rank resets. Top predictors win NFT badges and special arena access.",
    color: "#ffd700",
  },
  {
    icon: Zap,
    title: "Win Streak System",
    desc: "Chain victories for massive XP bonuses. Lose your streak and start the climb again.",
    color: "#00ffff",
  },
  {
    icon: Shield,
    title: "On-Chain Rewards",
    desc: "NFT badges minted directly to your wallet. Proof of your prediction mastery.",
    color: "#7c3aed",
  },
  {
    icon: Users,
    title: "Referral System",
    desc: "Invite frens, earn bonus points for every player who joins through your link.",
    color: "#ff0080",
  },
  {
    icon: Cpu,
    title: "Async Execution",
    desc: "Built on Rialo's async architecture. Rounds settle automatically without any user action.",
    color: "#00ff88",
  },
];

const MOCK_LEADERS = [
  { rank: 1, name: "0xCrypt0K1ng", xp: "142K", streak: 12 },
  { rank: 2, name: "WhaleHunter", xp: "98K", streak: 7 },
  { rank: 3, name: "MoonPredictor", xp: "76K", streak: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen cyber-grid-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-xs font-mono mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            LIVE — 847 Players In Arena
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-display font-black mb-4 leading-tight">
            <span className="gradient-text">RIALO</span>
            <br />
            <span className="text-white">RUSH</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-mono mb-2 max-w-2xl mx-auto">
            Predict. Win. Dominate the leaderboard.
          </p>
          <p className="text-gray-600 text-sm font-mono mb-10 max-w-xl mx-auto">
            Real-time crypto prediction arena powered by Rialo&apos;s async execution network.
            Rounds auto-settle. Rewards auto-distribute. Pure skill.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/arena"
              className="px-8 py-4 rounded-xl font-display font-bold text-lg bg-neon-green text-dark-bg hover:bg-neon-cyan transition-all duration-300 pulse-glow"
            >
              ENTER ARENA
            </Link>
            <Link
              href="/leaderboard"
              className="btn-neon px-8 py-4 rounded-xl font-display font-bold text-lg"
            >
              VIEW LEADERBOARD
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neon-green/40 text-xs font-mono"
        >
          ▼ scroll
        </motion.div>
      </section>

      {/* Ticker Tape */}
      <div className="border-y border-neon-green/10 bg-dark-card/50 py-2 overflow-hidden">
        <div className="ticker-tape inline-flex gap-8 text-xs font-mono text-neon-green/60">
          {Array.from({ length: 3 }).flatMap(() => [
            "BTC $108,542.00 ↑ +2.3%",
            "ETH $3,821.44 ↓ -0.8%",
            "SOL $186.23 ↑ +5.1%",
            "BNB $621.77 ↑ +1.2%",
            "RIALO RUSH — 847 PLAYERS ONLINE",
            "NEXT ROUND IN 32s",
          ]).map((item, i) => (
            <span key={i} className="px-4">⬡ {item}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Players", value: "12.4K" },
            { label: "Rounds Played", value: "284K" },
            { label: "XP Distributed", value: "9.2M" },
            { label: "NFTs Minted", value: "3.1K" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-4 text-center neon-border"
            >
              <div className="text-2xl font-display font-bold text-neon-green mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-display font-bold text-center gradient-text mb-2"
          >
            BUILT TO WIN
          </motion.h2>
          <p className="text-center text-gray-500 font-mono text-sm mb-12">
            Everything you need to dominate the arena
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 neon-border group hover:scale-[1.02] transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-white mb-2 text-sm">
                  {f.title}
                </h3>
                <p className="text-gray-500 font-mono text-xs leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-y border-neon-green/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center gradient-text mb-12">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Connect Wallet", desc: "Link your Web3 wallet via RainbowKit" },
              { step: "02", title: "Enter Arena", desc: "Join any active prediction round" },
              { step: "03", title: "Vote UP or DOWN", desc: "Choose your price direction before timer locks" },
              { step: "04", title: "Earn & Repeat", desc: "Auto-settle. Collect XP, climb ranks" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl font-display font-black text-neon-green/20 mb-2">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 font-mono text-xs">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 text-neon-green/30">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Leaderboard Preview */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-display font-bold gradient-text mb-2">
            TOP PREDICTORS
          </h2>
          <p className="text-gray-500 font-mono text-xs mb-8">This week&apos;s arena kings</p>
          <div className="space-y-3 mb-8">
            {MOCK_LEADERS.map((l, i) => (
              <motion.div
                key={l.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4 flex items-center gap-3 neon-border"
              >
                <span className="text-2xl">{["👑", "🥈", "🥉"][i]}</span>
                <div className="flex-1 text-left">
                  <p className="text-white font-mono text-sm font-semibold">{l.name}</p>
                  <p className="text-gray-500 font-mono text-xs">{l.streak} win streak 🔥</p>
                </div>
                <div className="text-neon-green font-display font-bold">{l.xp}</div>
              </motion.div>
            ))}
          </div>
          <Link
            href="/arena"
            className="inline-block px-8 py-4 rounded-xl font-display font-bold text-lg bg-neon-green text-dark-bg hover:bg-neon-cyan transition-all pulse-glow"
          >
            JOIN THE ARENA
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-green/10 py-8 px-4 text-center">
        <div className="text-neon-green font-display font-bold text-lg mb-2">RIALO RUSH</div>
        <p className="text-gray-600 font-mono text-xs">
          Powered by Rialo&apos;s async execution network • Built for the brave
        </p>
      </footer>
    </div>
  );
}
