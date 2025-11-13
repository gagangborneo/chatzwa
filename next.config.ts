import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // React strict mode - enabled for better development with Turbopack
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // Add path alias for @/ imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    if (dev) {
      // 禁用 webpack 的热模块替换 - hanya untuk non-Turbopack
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  // Turbopack configuration untuk development yang lebih cepat
  turbopack: {
    // Turbopack-specific settings
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  // Experimental features untuk performance
  experimental: {
    // Enable experimental features untuk performance
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Optimizations untuk development experience
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
