import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Configuration for the Next.js Image Component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-refactor-cms.talkremit.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  
};

export default nextConfig;