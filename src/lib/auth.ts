import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/db' // your mongodb client

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB_NAME ?? 'tamagocho-db')),
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
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  }
})
