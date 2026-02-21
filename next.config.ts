import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 64, 128, 256],
    minimumCacheTTL: 60 * 60 * 24,
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
