import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['mongodb', 'better-auth', '@noble/hashes'],

  // Force l'utilisation de webpack au lieu de turbopack pour le build production
  experimental: {
    turbo: undefined
  },

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
