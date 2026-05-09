import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
