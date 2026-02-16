import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker
  output: "standalone",

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.circleburo.kz",
      },
    ],
  },

  // Enable compression
  compress: true,

  // Strict mode for better debugging
  reactStrictMode: true,

  // Experimental features (optimizeCss requires critters: pnpm add critters)
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
