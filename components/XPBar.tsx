"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
}

const XP_PER_LEVEL = 1000;

export function XPBar({ xp, level, className }: XPBarProps) {
  const currentLevelXP = xp % XP_PER_LEVEL;
  const progress = (currentLevelXP / XP_PER_LEVEL) * 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">
          Level <span className="text-neon-green font-bold">{level}</span>
        </span>
        <span className="text-xs font-mono text-gray-500">
          {currentLevelXP} / {XP_PER_LEVEL} XP
        </span>
      </div>
      <div className="h-2 bg-dark-bg rounded-full overflow-hidden border border-neon-green/10">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ boxShadow: "0 0 8px rgba(0,255,136,0.5)" }}
        />
      </div>
    </div>
  );
}
