import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker and optimized deployments
  output: 'standalone',
  
  // Experimental optimizations for low-resource VPS
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
    
    // Optimize for production
    optimizeCss: true,
    
    // Server components optimization
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    
    // Memory optimization
    isrMemoryCacheSize: 0, // Disable ISR memory cache on low-mem servers
  },
  
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
  
  // Optimize images with Cloudflare or external service
  images: {
    deviceSizes: [640, 828, 1200],
    imageSizes: [16, 32, 48, 64],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Build optimizations
  swcMinify: true,
  compress: true,
  
  // Security and performance headers
  poweredByHeader: false,
  generateEtags: true,
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize for production builds
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }
    
    // Reduce bundle size
    config.externals = {
      ...config.externals,
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    };
    
    return config;
  },
  
  // Environment variables validation
  env: {
    // Runtime config
    MAX_UPLOAD_SIZE: '5242880', // 5MB
    SESSION_TIMEOUT: '86400000', // 24 hours
    API_RATE_LIMIT: '100', // requests per minute
  },
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for common patterns
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;