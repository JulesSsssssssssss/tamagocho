import Stripe from 'stripe'

/**
 * Configuration Stripe (côté serveur uniquement)
 *
 * Ce module configure l'instance Stripe utilisée pour les paiements.
 * Il ne doit être importé que dans les routes API ou Server Components.
 *
 * @module lib/stripe
 *
 * @remarks
 * IMPORTANT: Ne jamais importer ce fichier dans un composant client ('use client')
 * car il contient des clés secrètes.
 *
 * @example
 * ```typescript
 * import { stripe } from '@/lib/stripe'
 *
 * const session = await stripe.checkout.sessions.create({...})
 * ```
 */

// Vérification de la présence de la clé Stripe
if (
  process.env.STRIPE_SECRET_KEY === undefined ||
  process.env.STRIPE_SECRET_KEY === null ||
  process.env.STRIPE_SECRET_KEY === ''
) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

/**
 * Instance Stripe configurée
 *
 * @remarks
 * - Utilise la clé secrète depuis les variables d'environnement
 * - TypeScript est activé pour une meilleure sécurité de type
 * - Version API : 2025-09-30.clover (version par défaut du package)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true
})

// Re-export de la table de prix pour simplifier les imports
export { pricingTable } from '@/config/pricing'
