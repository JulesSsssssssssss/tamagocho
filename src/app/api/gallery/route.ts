/**
 * API Route: Gallery - Get Public Monsters
 *
 * GET /api/gallery
 *
 * Responsabilités (SRP):
 * - Recevoir les paramètres de filtres et pagination
 * - Valider les paramètres (types, ranges)
 * - Appeler le Use Case
 * - Retourner la réponse JSON
 *
 * Authentification: Optionnelle (galerie publique)
 * Query params: page, limit, minLevel, maxLevel, state, sortBy
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TamagotchiRepository } from '@/infrastructure/repositories/TamagotchiRepository'
import { GetPublicMonstersUseCase } from '@/application/use-cases/GetPublicMonstersUseCase'
import type { GalleryFilters, PaginationParams, GalleryQueryParams } from '@/shared/types/gallery'
import { MONSTER_STATES } from '@/shared/types/monster'

export async function GET (request: NextRequest): Promise<Response> {
  try {
    // 1. Extraction des query params
    const searchParams = request.nextUrl.searchParams
    const queryParams: GalleryQueryParams = {
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      minLevel: searchParams.get('minLevel') ?? undefined,
      maxLevel: searchParams.get('maxLevel') ?? undefined,
      state: searchParams.get('state') ?? undefined,
      sortBy: searchParams.get('sortBy') ?? undefined
    }

    // 2. Validation et parsing des paramètres
    const parsedPage = parseInt(queryParams.page ?? '1', 10)
    const parsedLimit = parseInt(queryParams.limit ?? '12', 10)

    const pagination: PaginationParams = {
      page: !isNaN(parsedPage) ? Math.max(1, parsedPage) : 1,
      limit: !isNaN(parsedLimit) ? Math.min(100, Math.max(1, parsedLimit)) : 12
    }

    const filters: GalleryFilters = {}

    // Validation minLevel
    if (queryParams.minLevel !== undefined) {
      const minLevel = parseInt(queryParams.minLevel, 10)
      if (!isNaN(minLevel) && minLevel >= 1) {
        filters.minLevel = minLevel
      }
    }

    // Validation maxLevel
    if (queryParams.maxLevel !== undefined) {
      const maxLevel = parseInt(queryParams.maxLevel, 10)
      if (!isNaN(maxLevel) && maxLevel >= 1) {
        filters.maxLevel = maxLevel
      }
    }

    // Validation state
    if (queryParams.state !== undefined && MONSTER_STATES.includes(queryParams.state as any)) {
      filters.state = queryParams.state as any
    }

    // Validation sortBy
    if (queryParams.sortBy !== undefined) {
      const validSortBy = ['newest', 'oldest', 'level']
      if (validSortBy.includes(queryParams.sortBy)) {
        filters.sortBy = queryParams.sortBy as any
      }
    }

    // 3. Exécution du Use Case (Clean Architecture)
    const repository = new TamagotchiRepository()
    const useCase = new GetPublicMonstersUseCase(repository)

    const response = await useCase.execute(filters, pagination)

    // 4. Réponse succès
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Error fetching gallery:', error)

    // Erreur générique
    return NextResponse.json(
      {
        error: 'Failed to fetch public monsters',
        monsters: [],
        total: 0,
        page: 1,
        limit: 12,
        hasMore: false,
        totalPages: 0
      },
      { status: 500 }
    )
  }
}
