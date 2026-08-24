import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    // The project prerenders more than 450 place routes. Lower worker pressure keeps
    // static export stable on local Windows development machines.
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 100,
  },
};

export default nextConfig;
