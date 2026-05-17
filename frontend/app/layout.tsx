import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Rialo Rush — Async Crypto Prediction Arena",
  description:
    "Predict crypto price movements, earn XP, climb leaderboard, and claim rewards on Rialo's async execution network.",
  keywords: ["crypto", "prediction game", "rialo", "defi", "blockchain", "web3"],
  openGraph: {
    title: "Rialo Rush",
    description: "The ultimate async crypto prediction arena",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-dark-bg min-h-screen">
        <Providers>
          <div className="scanline" />
          <Navbar />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
