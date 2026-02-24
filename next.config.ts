import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "admin.bikerfun.nl",
      },
      {
        protocol: "https",
        hostname: "**.bikerfun.nl",
      },
      {
        protocol: "http",
        hostname: "admin.bikerfun.nl",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Force clean builds
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
