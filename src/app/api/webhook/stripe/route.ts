import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Player from '@/db/models/player.model'
import { pricingTable } from '@/config/pricing'
import { connectMongooseToDatabase } from '@/db'

/**
 * API Route: POST /api/webhook/stripe
 *
 * Webhook Stripe pour gérer les événements de paiement.
 *
 * @remarks
 * Cette route est appelée automatiquement par Stripe lorsqu'un événement se produit
 * (paiement réussi, échec, remboursement, etc.).
 *
 * Architecture:
 * - Layer: Infrastructure (API)
 * - Dépendances: stripe (webhook verification), Wallet (persistence)
 *
 * IMPORTANT:
 * - Cette route doit être configurée dans le Dashboard Stripe
 * - URL du webhook: https://your-domain.com/api/webhook/stripe
 * - Secret du webhook: STRIPE_WEBHOOK_SECRET (env variable)
 *
 * Sécurité:
 * - Vérifie la signature du webhook pour garantir l'authenticité
 * - Utilise le payload brut (raw body) requis par Stripe
 *
 * Flow:
 * 1. Récupération de la signature Stripe
 * 2. Validation du payload avec constructEvent
 * 3. Traitement selon le type d'événement
 * 4. Mise à jour du wallet de l'utilisateur
 *
 * @example
 * Configuration Stripe CLI pour tester localement:
 * ```bash
 * stripe listen --forward-to localhost:3000/api/webhook/stripe
 * stripe trigger checkout.session.completed
 * ```
 *
 * @param req - Request avec le payload Stripe
 * @returns Response 200 si succès, 400 si erreur
 */

// Force l'utilisation du runtime Node.js (requis pour Stripe webhooks)
export const runtime = 'nodejs'

export async function POST (req: Request): Promise<Response> {
  // Récupération de la signature Stripe depuis les headers
  const sig = (await headers()).get('stripe-signature')

  // Lecture du payload brut (requis par Stripe)
  const payload = await req.text()

  let event: Stripe.Event

  try {
    // Vérification de la signature et construction de l'événement
    event = stripe.webhooks.constructEvent(
      payload,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message as string}`, {
      status: 400
    })
  }

  // Traitement selon le type d'événement
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('========================================')
      console.log('✅ Checkout session completed')
      console.log('Event ID:', event.id)
      console.log('Full event data:', JSON.stringify(event.data.object, null, 2))
      console.log('Metadata:', event?.data?.object?.metadata)
      console.log('Amount total:', event?.data?.object?.amount_total)
      console.log('========================================')

      // Connexion à la base de données
      await connectMongooseToDatabase()

      // Récupération ou création du joueur via userId dans les metadata
      const userId = event?.data?.object?.metadata?.userId

      console.log('🔍 Looking for userId:', userId)

      if (!userId) {
        console.error('⚠️ No userId found in metadata')
        console.error('Available metadata:', event?.data?.object?.metadata)
        break
      }

      let player = await Player.findOne({ userId })
      console.log('🔍 Player found:', player ? `Yes (coins: ${player.coins})` : 'No')

      // Si le joueur n'existe pas, le créer
      if (!player) {
        console.log(`🆕 Creating new player for user ${userId}`)
        player = await Player.create({
          userId,
          coins: 0,
          totalMonstersCreated: 0
        })
        console.log('✅ Player created successfully')
      }

      // Calcul du montant payé (Stripe renvoie en centimes)
      const amountPaid = (event?.data?.object?.amount_total ?? 0) / 100
      console.log('💵 Amount paid:', amountPaid, 'EUR')

      // Recherche du package correspondant au prix payé
      const entry = Object.entries(pricingTable).find(
        ([_, pkg]) => pkg.price === amountPaid
      )

      console.log('📦 Pricing table:', pricingTable)
      console.log('🔍 Found package:', entry)

      if (entry !== undefined) {
        const koinsToAdd = Number(entry[0])

        console.log(`💰 Adding ${koinsToAdd} Koins to user ${String(player.userId)}`)

        // Mise à jour du solde (Player.coins)
        const currentCoins = Number(player.coins ?? 0)
        console.log('💰 Current coins:', currentCoins)
        player.coins = currentCoins + koinsToAdd
        console.log('💰 New coins after addition:', player.coins)
        player.markModified('coins')
        await player.save()

        console.log(`✅ Wallet updated successfully. New balance: ${String(player.coins)}`)
      } else {
        console.error('⚠️ No matching package found for amount:', amountPaid)
        console.error('Available packages:', Object.entries(pricingTable).map(([k, v]) => ({ koins: k, price: v.price })))
      }
      console.log('========================================')
      break
    }

    case 'payment_intent.succeeded': {
      console.log('✅ Payment intent succeeded')
      console.log('Event data:', event.data.object)
      // TODO: Gérer le flow Payment Element si nécessaire
      break
    }

    case 'payment_intent.payment_failed': {
      console.log('❌ Payment failed')
      console.log('Event data:', event.data.object)
      // TODO: Gérer les échecs de paiement (notification utilisateur, etc.)
      break
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`)
  }

  // Stripe attend toujours une réponse 200
  return new Response('ok', { status: 200 })
}
