import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#00ff88",
          cyan: "#00ffff",
          purple: "#7c3aed",
          pink: "#ff0080",
          gold: "#ffd700",
        },
        dark: {
          bg: "#030308",
          card: "#0d0d1a",
          border: "#1a1a2e",
          surface: "#0f0f1e",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        display: ["'Orbitron'", "monospace"],
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 5px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88" },
          "50%": { boxShadow: "0 0 2px #00ff88, 0 0 10px #00ff88" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px #00ff88, 0 0 20px #00ff88" },
          "100%": { textShadow: "0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff" },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        "neon-gradient": "linear-gradient(135deg, #00ff88 0%, #00ffff 50%, #7c3aed 100%)",
        "dark-gradient": "linear-gradient(180deg, #030308 0%, #0d0d1a 100%)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};

export default config;
