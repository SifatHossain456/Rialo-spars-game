"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Zap, Trophy, User, Gift, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/arena", label: "Arena", icon: Target },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-neon-green/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-6 h-6 text-neon-green" />
          </motion.div>
          <span className="font-display font-bold text-lg gradient-text">
            RIALO RUSH
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-mono transition-all duration-200",
                pathname === href
                  ? "text-neon-green bg-neon-green/10 border border-neon-green/30"
                  : "text-gray-400 hover:text-neon-green hover:bg-neon-green/5"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Wallet Connect */}
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex border-t border-neon-green/10">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-mono transition-colors",
              pathname === href ? "text-neon-green" : "text-gray-500"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
