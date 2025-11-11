/**
 * API Route: GET /api/inventory/owner/[ownerId]
 *
 * Récupérer tous les items possédés par un joueur (toutes créatures confondues)
 */

import { NextResponse } from 'next/server'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { GetAllOwnerItemsUseCase } from '@/application/use-cases/shop/GetAllOwnerItems'

export async function GET (
  request: Request,
  { params }: { params: Promise<{ ownerId: string }> }
): Promise<NextResponse> {
  try {
    const { ownerId } = await params

    if (typeof ownerId !== 'string' || ownerId === '') {
      return NextResponse.json(
        { success: false, error: 'Owner ID is required' },
        { status: 400 }
      )
    }

    // Initialiser les repositories et le use case
    const shopRepository = new MongoShopRepository()
    const inventoryRepository = new MongoInventoryRepository()

    const getAllOwnerItemsUseCase = new GetAllOwnerItemsUseCase(
      inventoryRepository,
      shopRepository
    )

    // Récupérer tous les items du joueur
    const items = await getAllOwnerItemsUseCase.execute(ownerId)

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    })
  } catch (error) {
    console.error('Error fetching owner inventory:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch owner inventory'
      },
      { status: 500 }
    )
  }
}
