/**
 * API Route: POST /api/shop/purchase
 *
 * Acheter un item de la boutique pour une créature
 *
 * Body:
 * {
 *   monsterId: string  // ID de la créature qui recevra l'item
 *   itemId: string     // ID de l'item à acheter
 * }
 *
 * Nécessite une session utilisateur authentifiée
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { MongoWalletRepository } from '@/infrastructure/repositories/MongoWalletRepository'
import { PurchaseItemUseCase } from '@/application/use-cases/shop'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Vérifier l'authentification
    const session = await getServerSession()
    if (session?.user?.id === undefined) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parser le body
    const body = await request.json()
    const { monsterId, itemId } = body

    if (typeof monsterId !== 'string' || monsterId === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    if (typeof itemId !== 'string' || itemId === '') {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Initialiser les repositories et le use case
    const shopRepository = new MongoShopRepository()
    const inventoryRepository = new MongoInventoryRepository()
    const walletRepository = new MongoWalletRepository()

    const purchaseItemUseCase = new PurchaseItemUseCase(
      shopRepository,
      inventoryRepository,
      walletRepository
    )

    // Exécuter l'achat
    const result = await purchaseItemUseCase.execute({
      userId: session.user.id,
      monsterId,
      itemId
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Succès
    return NextResponse.json({
      success: true,
      data: {
        inventoryItemId: result.inventoryItemId,
        remainingBalance: result.remainingBalance
      },
      message: 'Item purchased successfully'
    })
  } catch (error) {
    console.error('Error purchasing item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to purchase item'
      },
      { status: 500 }
    )
  }
}
