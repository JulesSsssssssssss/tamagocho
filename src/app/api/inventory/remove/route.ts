/**
 * API Route: POST /api/inventory/remove
 *
 * Retirer un item de l'inventaire d'une créature
 *
 * Body:
 * {
 *   monsterId: string
 *   inventoryItemId: string
 * }
 */

import { NextResponse } from 'next/server'
import { MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { RemoveItemFromInventoryUseCase } from '@/application/use-cases/shop/RemoveItem'

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

    const removeItemUseCase = new RemoveItemFromInventoryUseCase(inventoryRepository)

    // Retirer l'item
    const result = await removeItemUseCase.execute({
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
      message: 'Item removed from inventory successfully'
    })
  } catch (error) {
    console.error('Error removing item from inventory:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove item from inventory'
      },
      { status: 500 }
    )
  }
}
