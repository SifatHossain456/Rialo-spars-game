"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Lock } from "lucide-react";
import { useGameStore, Prediction } from "@/store/useGameStore";
import { CountdownTimer } from "./CountdownTimer";
import { formatPrice, cn } from "@/lib/utils";
import { useAccount } from "wagmi";

export function PredictionCard() {
  const { currentRound, myPrediction, setMyPrediction } = useGameStore();
  const { isConnected } = useAccount();

  if (!currentRound) {
    return (
      <div className="glass-card rounded-2xl p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 font-mono text-sm">Loading round...</p>
        </div>
      </div>
    );
  }

  const handlePredict = (prediction: Prediction) => {
    if (!isConnected) return;
    if (currentRound.status !== "active") return;
    if (myPrediction) return;
    setMyPrediction(prediction);
  };

  const priceChange = currentRound.currentPrice - currentRound.startPrice;
  const priceChangePct = (priceChange / currentRound.startPrice) * 100;
  const isUp = priceChange >= 0;

  const upPct = currentRound.totalVotes > 0
    ? Math.round((currentRound.upVotes / currentRound.totalVotes) * 100)
    : 50;
  const downPct = 100 - upPct;

  return (
    <div className="glass-card rounded-2xl p-6 neon-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />

      {/* Asset badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
            <span className="text-neon-green font-display font-bold text-xs">
              {currentRound.asset}
            </span>
          </div>
          <span className="text-gray-400 font-mono text-xs">
            Round #{currentRound.id.slice(-6)}
          </span>
        </div>
        {myPrediction && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono font-bold",
              myPrediction === "UP"
                ? "bg-neon-green/20 text-neon-green border border-neon-green/40"
                : "bg-pink-500/20 text-pink-400 border border-pink-500/40"
            )}
          >
            {myPrediction === "UP" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {myPrediction === "UP" ? "LONG" : "SHORT"}
          </motion.div>
        )}
      </div>

      {/* Question */}
      <div className="mb-6 p-4 bg-dark-bg/60 rounded-xl border border-neon-green/10">
        <p className="text-white font-mono text-sm leading-relaxed">
          <span className="text-neon-green font-bold">?</span> {currentRound.question}
        </p>
      </div>

      {/* Price Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 font-mono text-xs mb-1">LIVE PRICE</p>
          <motion.p
            key={Math.round(currentRound.currentPrice)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-display font-bold text-white"
          >
            {formatPrice(currentRound.currentPrice)}
          </motion.p>
          <p className={cn(
            "text-sm font-mono flex items-center gap-1",
            isUp ? "text-neon-green" : "text-pink-400"
          )}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? "+" : ""}{priceChangePct.toFixed(3)}%
          </p>
        </div>
        <CountdownTimer
          timeLeft={currentRound.timeLeft}
          status={currentRound.status}
        />
      </div>

      {/* Vote Distribution */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono mb-1">
          <span className="text-neon-green">{upPct}% UP</span>
          <span className="text-gray-500">{currentRound.totalVotes} votes</span>
          <span className="text-pink-400">{downPct}% DOWN</span>
        </div>
        <div className="h-2 bg-dark-bg rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-green/80 to-neon-green/50"
            animate={{ width: `${upPct}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500/50 to-pink-400/80 flex-1"
          />
        </div>
      </div>

      {/* Prediction Buttons */}
      <AnimatePresence mode="wait">
        {currentRound.status === "settled" ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            {myPrediction ? (
              <div className={cn(
                "text-xl font-display font-bold",
                currentRound.result === myPrediction ? "text-neon-green neon-text" : "text-pink-400"
              )}>
                {currentRound.result === myPrediction ? "WINNER!" : "BETTER LUCK NEXT TIME"}
                {currentRound.result === myPrediction && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  > +100 XP</motion.span>
                )}
              </div>
            ) : (
              <p className="text-gray-400 font-mono">Next round starting...</p>
            )}
          </motion.div>
        ) : currentRound.status === "locked" ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-4 text-pink-400 font-mono"
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm">Votes locked — waiting for settlement</span>
          </motion.div>
        ) : !isConnected ? (
          <motion.div key="connect" className="text-center py-2">
            <p className="text-gray-400 font-mono text-sm">Connect wallet to predict</p>
          </motion.div>
        ) : myPrediction ? (
          <motion.div
            key="voted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-2 text-neon-green font-mono text-sm"
          >
            <Zap className="w-4 h-4" />
            Prediction locked in — waiting for result
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => handlePredict("UP")}
              className="btn-up rounded-xl py-4 font-display font-bold text-lg flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              UP
            </button>
            <button
              onClick={() => handlePredict("DOWN")}
              className="btn-down rounded-xl py-4 font-display font-bold text-lg flex items-center justify-center gap-2"
            >
              <TrendingDown className="w-5 h-5" />
              DOWN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
