import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'files.freemusicarchive.org',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    // Fix: Prevent webpack cache from consuming too much memory (RangeError)
    if (dev) {
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 1,
        maxAge: 1000 * 60 * 60 * 24,
        compression: false,
      };
    }

    return config;
  },
};

export default nextConfig;
