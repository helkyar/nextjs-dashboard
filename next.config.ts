import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // typedRoutes: true,
    // ppr: 'incremental',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-teams-slug.flaticon.com',
        port: '',
        // pathname: '/account123/**',
      },
    ],
  },
}

export default nextConfig
