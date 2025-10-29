/**
 * API Route: GET /api/wallet
 *
 * Récupérer le wallet (balance) de l'utilisateur connecté
 *
 * Nécessite une session utilisateur authentifiée
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     balance: number,
 *     currency: string
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectMongooseToDatabase } from '@/db'
import Player from '@/db/models/player.model'
import { MongoTransactionRepository } from '@/infrastructure/repositories/MongoTransactionRepository'
import { INITIAL_COINS } from '@/shared/types/coins'

export async function GET (request: Request): Promise<NextResponse> {
  try {
    // Vérifier l'authentification avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (session === null || session === undefined) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Utiliser le modèle Player comme source de vérité (même que le dashboard)
    await connectMongooseToDatabase()

    const transactionsRepo = new MongoTransactionRepository()

    // Récupérer ou créer le Player associé à l'utilisateur
    let player = await Player.findOne({ userId: session.user.id }).exec()
    if (player === null || player === undefined) {
      player = new Player({
        userId: session.user.id,
        coins: INITIAL_COINS,
        totalMonstersCreated: 0
      })
      await player.save()
    }

    // Calculer totalEarned / totalSpent depuis les transactions
    const transactions = await transactionsRepo.findByWalletId(player._id.toString(), { limit: 1000 })
    const totalEarned = transactions.filter(t => t.type === 'EARN').reduce((s, t) => s + t.amount, 0)
    const totalSpent = transactions.filter(t => t.type === 'SPEND').reduce((s, t) => s + t.amount, 0)

    return NextResponse.json({
      success: true,
      data: {
        balance: Number(player.coins ?? 0),
        currency: 'TC',
        totalEarned: totalEarned + INITIAL_COINS,
        totalSpent
      }
    })
  } catch (error) {
    console.error('Error fetching wallet:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallet'
      },
      { status: 500 }
    )
  }
}
