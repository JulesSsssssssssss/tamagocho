import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client, dbName, connectToDatabase } from '@/db'

// Assurer la connexion avant d'initialiser BetterAuth
connectToDatabase().catch((error) => {
  console.error('❌ Échec de connexion MongoDB pour BetterAuth:', error)
})

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    process.env.NEXT_PUBLIC_APP_URL ?? ''
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true // Auto-connexion après inscription
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  advanced: {
    // Augmenter le timeout pour les opérations MongoDB
    generateId: () => crypto.randomUUID()
  }
})
