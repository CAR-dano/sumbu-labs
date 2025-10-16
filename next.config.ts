import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "standalone", // Disable standalone untuk Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Disable image optimization untuk uploads
  },
  experimental: {
    optimizePackageImports: ["@next/font"],
  },
  // Handle font loading issues during build
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
