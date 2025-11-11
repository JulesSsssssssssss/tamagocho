/**
 * API Route: POST /api/quests/[questId]/claim
 *
 * Réclamer les récompenses d'une quête complétée
 *
 * Nécessite une session utilisateur authentifiée
 *
 * Request Body: {}
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     reward: number,
 *     newBalance: number,
 *     quest: Quest
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { MongoQuestRepository } from '@/infrastructure/repositories/MongoQuestRepository'
import { MongoWalletRepository } from '@/infrastructure/repositories/MongoWalletRepository'
import { MongoTransactionRepository } from '@/infrastructure/repositories/MongoTransactionRepository'
import { ClaimQuestRewardUseCase } from '@/application/use-cases/ClaimQuestRewardUseCase'

export async function POST (
  request: Request,
  { params }: { params: Promise<{ questId: string }> }
): Promise<NextResponse> {
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

    const { questId } = await params
    const userId = session.user.id

    if (typeof questId !== 'string' || questId === '') {
      return NextResponse.json(
        { success: false, error: 'Quest ID is required' },
        { status: 400 }
      )
    }

    // Initialiser les repositories et le use case
    const questRepository = new MongoQuestRepository()
    const walletRepository = new MongoWalletRepository()
    const transactionRepository = new MongoTransactionRepository()

    const claimQuestRewardUseCase = new ClaimQuestRewardUseCase(
      questRepository,
      walletRepository,
      transactionRepository
    )

    // Réclamer la récompense
    const result = await claimQuestRewardUseCase.execute(questId, userId)

    // Récupérer le nouveau balance
    const wallet = await walletRepository.findByOwnerId(userId)

    // Convertir la quête en JSON pour la réponse
    const questData = {
      id: result.quest.id,
      type: result.quest.type,
      description: result.quest.description,
      target: result.quest.target,
      progress: result.quest.progress,
      reward: result.quest.reward,
      status: result.quest.status,
      assignedAt: result.quest.assignedAt.toISOString(),
      completedAt: result.quest.completedAt?.toISOString(),
      claimedAt: result.quest.claimedAt?.toISOString(),
      expiresAt: result.quest.expiresAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        reward: result.reward,
        newBalance: wallet?.balance ?? 0,
        quest: questData
      }
    })
  } catch (error) {
    console.error('Error claiming quest reward:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to claim quest reward'
      },
      { status: 500 }
    )
  }
}
