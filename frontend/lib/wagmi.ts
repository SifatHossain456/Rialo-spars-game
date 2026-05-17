import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Rialo Rush",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rialo-rush-demo",
  chains: [base, baseSepolia, sepolia],
  ssr: true,
});
