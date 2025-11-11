/**
 * API Route: GET /api/shop/items
 *
 * Récupérer les items de la boutique avec filtres optionnels
 *
 * Query params:
 * - category?: 'hat' | 'glasses' | 'shoes'
 * - rarity?: 'common' | 'rare' | 'epic' | 'legendary'
 * - availableOnly?: 'true' | 'false'
 */

import { NextResponse } from 'next/server'
import { MongoShopRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { GetShopItemsUseCase } from '@/application/use-cases/shop'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

export async function GET (request: Request): Promise<NextResponse> {
  try {
    // Parser les query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as ItemCategory | null
    const rarity = searchParams.get('rarity') as ItemRarity | null
    const availableOnly = searchParams.get('availableOnly') === 'true'

    // Initialiser le repository et le use case
    const shopRepository = new MongoShopRepository()
    const getShopItemsUseCase = new GetShopItemsUseCase(shopRepository)

    // Exécuter le use case avec les filtres
    const items = await getShopItemsUseCase.execute({
      category: category ?? undefined,
      rarity: rarity ?? undefined,
      availableOnly
    })

    // Retourner les items
    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    })
  } catch (error) {
    console.error('Error fetching shop items:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shop items'
      },
      { status: 500 }
    )
  }
}
