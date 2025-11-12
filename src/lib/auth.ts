import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client, dbName, connectToDatabase } from '@/db'

const REQUIRED_MONGO_ENV_VARS = [
  'MONGODB_USERNAME',
  'MONGODB_PASSWORD',
  'MONGODB_HOST',
  'MONGODB_DATABASE_NAME',
  'MONGODB_PARAMS',
  'MONGODB_APP_NAME'
] as const

const DEFAULT_SESSION_TIMEOUT_MS = 3000

function hasMongoConfiguration (): boolean {
  return REQUIRED_MONGO_ENV_VARS.every((key) => Boolean(process.env[key]))
}

async function ensureDatabaseConnection (): Promise<void> {
  if (!hasMongoConfiguration()) {
    console.warn('BetterAuth initialisation skipped: missing MongoDB environment variables.')
    return
  }

  try {
    await connectToDatabase()
  } catch (error) {
    console.error('❌ Échec de connexion MongoDB pour BetterAuth:', error)
  }
}

// Assurer la connexion avant d'initialiser BetterAuth sans bloquer la page
void ensureDatabaseConnection()

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'https://tamagocho-2.vercel.app',
    'https://*.vercel.app', // Accepter toutes les URLs de preview Vercel
    process.env.BETTER_AUTH_URL ?? '',
    process.env.NEXT_PUBLIC_APP_URL ?? '',
    (process.env.VERCEL_URL != null && process.env.VERCEL_URL !== '') ? `https://${process.env.VERCEL_URL}` : ''
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },
  advanced: {
    // Augmenter le timeout pour les opérations MongoDB
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false
    }
  }
})

export type AuthSession = typeof auth.$Infer.Session

type HeadersSource = Headers | (() => Headers) | (() => Promise<Headers>)

async function resolveHeadersSource (source: HeadersSource): Promise<Headers> {
  try {
    if (source instanceof Headers) {
      return await Promise.resolve(source)
    }

    const result = source()
    return result instanceof Promise ? await result : await Promise.resolve(result)
  } catch (error) {
    return await Promise.reject(error)
  }
}

export async function getServerSessionSafely (headersSource: HeadersSource, timeoutMs: number = Number(process.env.AUTH_SESSION_TIMEOUT_MS ?? DEFAULT_SESSION_TIMEOUT_MS)): Promise<AuthSession | null> {
  if (!hasMongoConfiguration()) {
    return null
  }

  try {
    const headersList = await resolveHeadersSource(headersSource)

    const sessionPromise = auth.api.getSession({ headers: headersList }).catch((error) => {
      console.warn('BetterAuth session lookup failed:', error)
      return null
    })

    const timeoutPromise = new Promise<AuthSession | null>((resolve) => {
      setTimeout(() => {
        console.warn(`BetterAuth session lookup timed out after ${timeoutMs}ms.`)
        resolve(null)
      }, timeoutMs)
    })

    return await Promise.race([sessionPromise, timeoutPromise])
  } catch (error) {
    console.warn('Unable to resolve headers for BetterAuth session lookup:', error)
    return null
  }
}
