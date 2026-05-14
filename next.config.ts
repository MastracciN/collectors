import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        pathname: '/asr/**',
      }
    ]
  }
};

export default nextConfig;
