/**
 * API Route: GET /api/quests
 *
 * Récupérer les quêtes journalières de l'utilisateur connecté
 * Si elles n'existent pas, elles sont créées automatiquement
 *
 * Nécessite une session utilisateur authentifiée
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     quests: Quest[],
 *     totalActive: number
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { MongoQuestRepository } from '@/infrastructure/repositories/MongoQuestRepository'
import { GetDailyQuestsUseCase } from '@/application/use-cases/GetDailyQuestsUseCase'

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

    const userId = session.user.id

    // Initialiser le repository et le use case
    const questRepository = new MongoQuestRepository()
    const getDailyQuestsUseCase = new GetDailyQuestsUseCase(questRepository)

    // Récupérer ou créer les quêtes journalières
    const quests = await getDailyQuestsUseCase.execute(userId)

    // Convertir en JSON pour la réponse
    const questsData = quests.map(q => ({
      id: q.id,
      type: q.type,
      description: q.description,
      target: q.target,
      progress: q.progress,
      reward: q.reward,
      status: q.status,
      assignedAt: q.assignedAt.toISOString(),
      completedAt: q.completedAt?.toISOString(),
      claimedAt: q.claimedAt?.toISOString(),
      expiresAt: q.expiresAt.toISOString(),
      progressPercentage: q.getProgressPercentage(),
      hoursUntilExpiration: q.getHoursUntilExpiration(),
      canBeClaimed: q.canBeClaimed(),
      isCompleted: q.isCompleted(),
      isExpired: q.isExpired()
    }))

    return NextResponse.json({
      success: true,
      data: {
        quests: questsData,
        totalActive: quests.length
      }
    })
  } catch (error) {
    console.error('Error fetching daily quests:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch daily quests'
      },
      { status: 500 }
    )
  }
}
