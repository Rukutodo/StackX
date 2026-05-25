import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  /* config options here */
};

export default nextConfig;
