"use client";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useGameStore } from "@/store/useGameStore";
import { formatPrice } from "@/lib/utils";

export function PriceChart() {
  const { priceHistory, currentRound } = useGameStore();

  const data = priceHistory.map((p, i) => ({
    t: i,
    price: p.price,
  }));

  const isUp =
    data.length > 1 && data[data.length - 1].price >= data[0].price;
  const color = isUp ? "#00ff88" : "#ff0080";

  return (
    <div className="glass-card rounded-2xl p-4 neon-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 font-mono text-xs">
          {currentRound?.asset || "BTC"} PRICE LIVE
        </span>
        <span className="text-xs font-mono text-gray-600">
          last 60 ticks
        </span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis
              domain={["auto", "auto"]}
              hide
            />
            <Tooltip
              contentStyle={{
                background: "#0d0d1a",
                border: "1px solid rgba(0,255,136,0.2)",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              formatter={(value: number) => [formatPrice(value), "Price"]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGrad)"
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
