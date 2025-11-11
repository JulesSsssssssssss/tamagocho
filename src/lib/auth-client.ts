import { createAuthClient } from 'better-auth/react'

/**
 * BetterAuth Client Configuration
 *
 * Le baseURL n'est PAS nécessaire si les routes API sont au même domaine
 * BetterAuth utilise par défaut '/api/auth' comme chemin
 *
 * En production sur Vercel, l'app et l'API sont sur le même domaine
 * donc pas besoin de spécifier baseURL
 */
export const authClient = createAuthClient({
  // baseURL est optionnel quand l'API est sur le même domaine
  // BetterAuth utilise automatiquement window.location.origin + '/api/auth'
})
