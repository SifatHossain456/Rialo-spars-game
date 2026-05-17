"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  timeLeft: number;
  totalTime?: number;
  status: "active" | "locked" | "settled";
}

export function CountdownTimer({ timeLeft, totalTime = 60, status }: CountdownTimerProps) {
  const progress = (timeLeft / totalTime) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (status === "settled") return "#7c3aed";
    if (status === "locked") return "#ff0080";
    if (timeLeft <= 15) return "#ff4444";
    if (timeLeft <= 30) return "#ffaa00";
    return "#00ff88";
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-display font-bold"
            style={{ color, textShadow: `0 0 10px ${color}` }}
          >
            {status === "settled" ? "END" : timeLeft}
          </motion.span>
          <span className="text-xs text-gray-500 font-mono">
            {status === "settled" ? "settled" : status === "locked" ? "locked" : "seconds"}
          </span>
        </div>
      </div>

      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-mono font-bold",
        status === "active" && "bg-neon-green/10 text-neon-green border border-neon-green/30",
        status === "locked" && "bg-pink-500/10 text-pink-400 border border-pink-500/30",
        status === "settled" && "bg-purple-500/10 text-purple-400 border border-purple-500/30",
      )}>
        {status === "active" && "ROUND ACTIVE"}
        {status === "locked" && "VOTES LOCKED"}
        {status === "settled" && "ROUND SETTLED"}
      </div>
    </div>
  );
}
