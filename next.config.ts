import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      { source: '/landing', destination: '/', permanent: true },
    ]
  },
  async rewrites() {
    return [
      { source: '/about',    destination: '/' },
      { source: '/signals',  destination: '/' },
      { source: '/pricing',  destination: '/' },
      { source: '/reviews',  destination: '/' },
      { source: '/faq',      destination: '/' },
    ]
  },
}

export default nextConfig
