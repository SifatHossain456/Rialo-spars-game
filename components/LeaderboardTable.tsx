"use client";
import { motion } from "framer-motion";
import { LeaderboardEntry } from "@/store/useGameStore";
import { shortenAddress, getRankIcon, formatNumber, getStreakEmoji } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentAddress?: string;
  compact?: boolean;
}

export function LeaderboardTable({ entries, currentAddress, compact }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-mono text-sm">
        No players yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.address}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "glass-card rounded-xl p-3 flex items-center gap-3 transition-all duration-200",
            entry.rank === 1 && "border-neon-gold/40 bg-neon-gold/5",
            entry.rank === 2 && "border-gray-400/30 bg-gray-400/5",
            entry.rank === 3 && "border-orange-600/30 bg-orange-600/5",
            entry.address.toLowerCase() === currentAddress?.toLowerCase() &&
              "border-neon-cyan/40 bg-neon-cyan/5",
          )}
        >
          {/* Rank */}
          <div className="w-8 text-center font-display font-bold text-sm">
            {entry.rank <= 3 ? (
              <span className="text-lg">{getRankIcon(entry.rank)}</span>
            ) : (
              <span className="text-gray-500">#{entry.rank}</span>
            )}
          </div>

          {/* Avatar */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
            entry.rank === 1 && "border-yellow-400 bg-yellow-400/20 text-yellow-400",
            entry.rank === 2 && "border-gray-400 bg-gray-400/20 text-gray-300",
            entry.rank === 3 && "border-orange-500 bg-orange-500/20 text-orange-400",
            entry.rank > 3 && "border-neon-green/30 bg-neon-green/10 text-neon-green",
          )}>
            {entry.badge || entry.username[0]?.toUpperCase() || "?"}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-mono text-sm font-semibold truncate">
                {entry.username || shortenAddress(entry.address)}
              </span>
              {entry.streak >= 3 && (
                <span className="text-xs">{getStreakEmoji(entry.streak)}</span>
              )}
            </div>
            {!compact && (
              <div className="text-gray-500 font-mono text-xs">
                {entry.wins} wins
              </div>
            )}
          </div>

          {/* XP */}
          <div className="text-right">
            <div className="text-neon-green font-display font-bold text-sm">
              {formatNumber(entry.xp)}
            </div>
            <div className="text-gray-600 font-mono text-xs">XP</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
