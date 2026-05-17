const BASE_PRICES: Record<string, number> = {
  BTC: 108500,
  ETH: 3800,
  SOL: 185,
  BNB: 620,
};

const state: Record<string, number> = { ...BASE_PRICES };

export function getPrice(asset: string): number {
  return state[asset] ?? 0;
}

export function tickPrice(asset: string): number {
  const current = state[asset];
  if (!current) return 0;
  const change = (Math.random() - 0.5) * 2 * 0.001;
  state[asset] = current * (1 + change);
  return state[asset];
}

export function getAllPrices(): Record<string, number> {
  return { ...state };
}

export function tickAllPrices(): Record<string, number> {
  for (const asset of Object.keys(state)) tickPrice(asset);
  return getAllPrices();
}
