import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — all pages are "use client" so SSR is not needed.
  // This produces an `out/` directory that any static host (Vercel, Netlify, S3) can serve.
  output: "export",
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  webpack: (config) => {
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : []),
      "pino-pretty",
      "lokijs",
      "encoding",
    ];
    return config;
  },
};

export default nextConfig;
