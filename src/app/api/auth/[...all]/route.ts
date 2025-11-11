import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Force dynamic rendering for auth routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Export toutes les méthodes HTTP que BetterAuth peut utiliser
export const { GET, POST } = toNextJsHandler(auth)

// Note: BetterAuth utilise principalement GET et POST
// Les autres méthodes (PUT, PATCH, DELETE) ne sont généralement pas nécessaires
// mais si vous obtenez des erreurs 405, vous pouvez les ajouter ici
