/**
 * API Route: GET /api/inventory/[monsterId]
 *
 * Récupérer l'inventaire d'une créature spécifique
 */

import { NextResponse } from 'next/server'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { GetPlayerInventoryUseCase } from '@/application/use-cases/shop'

export async function GET (
  request: Request,
  { params }: { params: Promise<{ monsterId: string }> }
): Promise<NextResponse> {
  try {
    const { monsterId } = await params

    if (typeof monsterId !== 'string' || monsterId === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    // Initialiser les repositories et le use case
    const shopRepository = new MongoShopRepository()
    const inventoryRepository = new MongoInventoryRepository()

    const getInventoryUseCase = new GetPlayerInventoryUseCase(
      inventoryRepository,
      shopRepository
    )

    // Récupérer l'inventaire
    const items = await getInventoryUseCase.execute(monsterId)

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch inventory'
      },
      { status: 500 }
    )
  }
}
