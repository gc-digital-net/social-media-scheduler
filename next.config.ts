import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production on low-resource VPS
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
  },
  
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp'],
  },
  
  // Reduce build memory usage
  compress: true,
  
  // Optimized for production
  poweredByHeader: false,
};

export default nextConfig;
