# 🎮 Rialo Rush — Async Crypto Prediction Arena

> A viral browser prediction game powered by Rialo's async execution architecture

![Rialo Rush Banner](https://img.shields.io/badge/Rialo-Rush-00ff88?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Solidity](https://img.shields.io/badge/Solidity-0.8-gray?style=for-the-badge&logo=solidity)

---

## 🎯 What is Rialo Rush?

Rialo Rush is a real-time crypto prediction game where players:

- **Connect wallet** → Enter the arena
- **Predict** → Will BTC go UP or DOWN in 60 seconds?
- **Earn XP** → Win streaks, climb leaderboard
- **Claim rewards** → NFT badges, testnet tokens, rare cosmetics

Built on top of **Rialo's async execution model** — rounds settle automatically via event-driven smart contracts, demonstrating async task completion without user intervention.

---

## 🏗️ Architecture

```
rialo-rush/
├── frontend/      → Next.js 14 + TailwindCSS + RainbowKit
├── backend/       → Node.js + Express + Socket.io + Prisma
└── contracts/     → Solidity + Hardhat (Goerli / Base Testnet)
```

---

## ⚡ Features

| Feature | Description |
|---|---|
| 🔮 Live Prediction Rounds | 60-second rounds with live price simulation |
| 🏆 Animated Leaderboard | Real-time rank updates via WebSocket |
| 🔥 Win Streak System | Daily streaks to keep players addicted |
| 🎖️ NFT Badges | On-chain proof of your prediction skills |
| 👛 Wallet Connect | RainbowKit + Wagmi — Base + Goerli support |
| 📊 Profile Cards | Shareable result cards for X/Twitter |
| 🎯 Missions | Daily/weekly challenges for bonus XP |
| 🌐 Referral System | Invite friends, earn bonus points |

---

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network goerli
```

---

## 🎮 Game Loop

```
[Round Start] → Question appears
     ↓
[60s Timer] → Players vote YES / NO
     ↓
[Lock Phase] → Votes locked at 10s remaining
     ↓
[Settlement] → Smart contract auto-settles (async execution)
     ↓
[Rewards] → XP + Streaks + Badges distributed
     ↓
[Next Round] → Repeat
```

---

## 🌐 Rialo Integration

This game demonstrates:
- **Async task execution** — rounds settle without user action
- **Event-driven settlement** — contracts emit events, UI reacts
- **Cross-chain potential** — built for multi-network deployment
- **Permissionless participation** — any wallet, any time

---

## 📄 License

MIT — Build. Predict. Win. 🚀
