import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseGoerli, goerli } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Rialo Rush",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rialo-rush-demo",
  chains: [base, baseGoerli, goerli],
  ssr: true,
});
