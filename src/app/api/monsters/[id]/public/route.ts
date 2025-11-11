/**
 * API Route: Toggle Monster Public Status
 *
 * PUT /api/monsters/[id]/public
 *
 * Responsabilités (SRP):
 * - Recevoir la requête HTTP pour changer le statut public
 * - Valider l'authentification de l'utilisateur
 * - Appeler le Use Case avec les paramètres
 * - Retourner la réponse appropriée
 *
 * Sécurité:
 * - Authentification obligatoire (Better Auth)
 * - Validation ownership dans le Use Case
 * - Protection CSRF via Better Auth
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { TamagotchiRepository } from '@/infrastructure/repositories/TamagotchiRepository'
import { ToggleMonsterPublicStatusUseCase } from '@/application/use-cases/ToggleMonsterPublicStatusUseCase'

export async function PUT (
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // 1. Authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Extraction des paramètres
    const params = await context.params
    const monsterId = params.id
    const body = await request.json() as { isPublic: boolean }

    // Validation du body
    if (typeof body.isPublic !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body: isPublic must be a boolean' },
        { status: 400 }
      )
    }

    // 3. Exécution du Use Case (Clean Architecture)
    const repository = new TamagotchiRepository()
    const useCase = new ToggleMonsterPublicStatusUseCase(repository)

    const updatedMonster = await useCase.execute(
      monsterId,
      session.user.id,
      body.isPublic
    )

    // 4. Réponse succès
    return NextResponse.json({
      success: true,
      monster: {
        id: updatedMonster._id,
        name: updatedMonster.name,
        isPublic: updatedMonster.isPublic
      }
    })
  } catch (error) {
    console.error('❌ Error toggling monster public status:', error)

    // Gestion des erreurs métier
    if (error instanceof Error) {
      if (error.message === 'Monster not found') {
        return NextResponse.json(
          { error: 'Monster not found' },
          { status: 404 }
        )
      }

      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'You are not the owner of this monster' },
          { status: 403 }
        )
      }
    }

    // Erreur générique
    return NextResponse.json(
      { error: 'Failed to update monster public status' },
      { status: 500 }
    )
  }
}
