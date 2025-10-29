/**
 * API Route: POST /api/inventory/unequip
 *
 * Déséquiper un item d'une créature
 *
 * Body:
 * {
 *   monsterId: string
 *   inventoryItemId: string
 * }
 */

import { NextResponse } from 'next/server'
import { MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { UnequipItemUseCase } from '@/application/use-cases/shop'

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

    // Initialiser le repository et le use case
    const inventoryRepository = new MongoInventoryRepository()

    const unequipItemUseCase = new UnequipItemUseCase(inventoryRepository)

    // Déséquiper l'item
    const result = await unequipItemUseCase.execute({
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
      message: 'Item unequipped successfully'
    })
  } catch (error) {
    console.error('Error unequipping item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unequip item'
      },
      { status: 500 }
    )
  }
}
