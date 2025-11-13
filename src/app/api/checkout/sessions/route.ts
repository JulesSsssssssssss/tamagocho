import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { pricingTable } from '@/config/pricing'
import { headers } from 'next/headers'

/**
 * API Route: POST /api/checkout/sessions
 *
 * Crée une session Stripe Checkout pour l'achat de Koins.
 *
 * @remarks
 * Cette route est appelée côté client lorsqu'un utilisateur clique sur un package de Koins.
 * Elle crée une session Stripe et retourne l'URL de redirection vers le formulaire de paiement.
 *
 * Architecture:
 * - Layer: Infrastructure (API)
 * - Dépendances: auth (session), stripe (paiement), pricingTable (configuration)
 *
 * Flow:
 * 1. Vérification de l'authentification
 * 2. Validation du montant demandé
 * 3. Création de la session Stripe
 * 4. Retour de l'URL de checkout
 *
 * @example
 * ```typescript
 * // Côté client
 * const response = await fetch('/api/checkout/sessions', {
 *   method: 'POST',
 *   body: JSON.stringify({ amount: 50 })
 * })
 * const { url } = await response.json()
 * window.location.href = url
 * ```
 *
 * @param request - Request avec { amount: number } dans le body
 * @returns Response avec { url: string } ou erreur
 */
export async function POST (request: Request): Promise<Response> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Vérification de l'authentification
  if (session === null || session === undefined) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Extraction du montant de Koins demandé
  const { amount } = await request.json() as { amount: number }

  console.log('🛒 Checkout session requested')
  console.log('  - User ID:', session.user.id)
  console.log('  - Amount:', amount, 'coins')

  // Validation: le montant doit exister dans la table de prix
  const product = pricingTable[amount]

  if (product === undefined || product === null) {
    console.error('❌ Product not found for amount:', amount)
    return new Response('Product not found', { status: 404 })
  }

  console.log('  - Price:', product.price, 'EUR')
  console.log('  - Product ID:', product.productId)

  // Création de la session Stripe Checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${amount} Tamagocho Coins`,
            description: `Pack de ${amount} pièces pour votre Tamagotchi`,
            images: ['https://tamagocho-2.vercel.app/coin-icon.png'] // Optionnel
          },
          unit_amount: Math.round(product.price * 100) // Stripe utilise les centimes
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet?canceled=true`,
    metadata: {
      userId: session.user.id,
      koinsAmount: amount.toString()
    }
  })

  // Retour de l'URL de redirection
  return new Response(
    JSON.stringify({ url: checkoutSession.url }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
