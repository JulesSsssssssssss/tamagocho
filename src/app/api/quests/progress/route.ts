/**
 * API Route: POST /api/quests/progress
 *
 * Mettre à jour la progression d'une quête
 *
 * Nécessite une session utilisateur authentifiée
 *
 * Request Body:
 * {
 *   questType: QuestType,
 *   incrementBy?: number
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     quest: Quest | null,
 *     isCompleted: boolean
 *   }
 * }
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { MongoQuestRepository } from '@/infrastructure/repositories/MongoQuestRepository'
import { UpdateQuestProgressUseCase } from '@/application/use-cases/UpdateQuestProgressUseCase'
import { type QuestType } from '@/domain/entities/Quest'

interface UpdateProgressRequest {
  questType: QuestType
  incrementBy?: number
}

export async function POST (request: Request): Promise<NextResponse> {
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
    const body: UpdateProgressRequest = await request.json()

    if (body.questType === undefined || body.questType === null) {
      return NextResponse.json(
        { success: false, error: 'Quest type is required' },
        { status: 400 }
      )
    }

    const incrementBy = body.incrementBy ?? 1

    // Initialiser le repository et le use case
    const questRepository = new MongoQuestRepository()
    const updateQuestProgressUseCase = new UpdateQuestProgressUseCase(questRepository)

    // Mettre à jour la progression
    const updatedQuest = await updateQuestProgressUseCase.execute(
      userId,
      body.questType,
      incrementBy
    )

    // Si aucune quête de ce type n'est active
    if (updatedQuest === null) {
      return NextResponse.json({
        success: true,
        data: {
          quest: null,
          isCompleted: false
        }
      })
    }

    // Convertir la quête en JSON pour la réponse
    const questData = {
      id: updatedQuest.id,
      type: updatedQuest.type,
      description: updatedQuest.description,
      target: updatedQuest.target,
      progress: updatedQuest.progress,
      reward: updatedQuest.reward,
      status: updatedQuest.status,
      progressPercentage: updatedQuest.getProgressPercentage(),
      isCompleted: updatedQuest.isCompleted()
    }

    return NextResponse.json({
      success: true,
      data: {
        quest: questData,
        isCompleted: updatedQuest.isCompleted()
      }
    })
  } catch (error) {
    console.error('Error updating quest progress:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update quest progress'
      },
      { status: 500 }
    )
  }
}
