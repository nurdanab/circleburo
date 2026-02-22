import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.circleburo.kz",
      },
    ],
  },
  compress: true,

  // Strict mode for better debugging
  reactStrictMode: true,

  // Experimental features (optimizeCss requires critters: pnpm add critters)
  experimental: {
    optimizeCss: false,
  },
};

export default withNextIntl(nextConfig);
