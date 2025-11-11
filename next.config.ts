import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['mongodb', 'better-auth', '@noble/hashes'],

  // Configuration pour servir Docusaurus depuis /documentation
  async rewrites () {
    return {
      beforeFiles: [
        {
          source: '/documentation',
          destination: '/documentation/index.html'
        },
        {
          source: '/documentation/:path*',
          destination: '/documentation/:path*'
        }
      ]
    }
  }
}

export default nextConfig
