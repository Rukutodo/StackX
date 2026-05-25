import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "**.stackx.co.in",
      },
      {
        protocol: "https",
        hostname: "stackx.co.in",
      },
    ],
  },
};

export default nextConfig;
