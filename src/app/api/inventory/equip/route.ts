/**
 * API Route: POST /api/inventory/equip
 *
 * Équiper un item sur une créature
 *
 * Body:
 * {
 *   monsterId: string
 *   inventoryItemId: string
 * }
 */

import { NextResponse } from 'next/server'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { EquipItemUseCase } from '@/application/use-cases/shop'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Parser le body
    const body = await request.json()
    const { monsterId, inventoryItemId } = body

    if (typeof monsterId !== 'string' || monsterId === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    if (typeof inventoryItemId !== 'string' || inventoryItemId === '') {
      return NextResponse.json(
        { success: false, error: 'Inventory Item ID is required' },
        { status: 400 }
      )
    }

    // Initialiser les repositories et le use case
    const shopRepository = new MongoShopRepository()
    const inventoryRepository = new MongoInventoryRepository()

    const equipItemUseCase = new EquipItemUseCase(
      inventoryRepository,
      shopRepository
    )

    // Équiper l'item
    const result = await equipItemUseCase.execute({
      monsterId,
      inventoryItemId
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Item equipped successfully'
    })
  } catch (error) {
    console.error('Error equipping item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to equip item'
      },
      { status: 500 }
    )
  }
}
