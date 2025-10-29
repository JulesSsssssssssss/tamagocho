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
import { auth } from '@/lib/auth'
import { connectToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { MongoWalletRepository } from '@/infrastructure/repositories/MongoWalletRepository'
import { PurchaseItemUseCase } from '@/application/use-cases/shop'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

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

    // En mode développement avec items de test, gérer différemment
    const isTestItem = itemId.startsWith('test_')

    if (isTestItem) {
      // Mode test : simuler l'achat mais débiter le vrai wallet
      try {
        await connectToDatabase()

        // Extraire la catégorie et la rareté de l'ID de test
        const parts = itemId.split('_')
        const category = parts[1] as ItemCategory
        const rarity = parts[2] as ItemRarity

        // Calculer le prix selon la rareté
        const basePrices: Record<ItemCategory, number> = {
          hat: 50,
          glasses: 75,
          shoes: 100
        }
        const rarityMultipliers: Record<ItemRarity, number> = {
          common: 1,
          rare: 2.5,
          epic: 5,
          legendary: 10
        }
        const price = basePrices[category] * rarityMultipliers[rarity]

        // Débiter le wallet
        const walletRepository = new MongoWalletRepository()
        let wallet = await walletRepository.findByOwnerId(session.user.id)

        if (wallet === null) {
          // Créer le wallet s'il n'existe pas
          wallet = await walletRepository.create(session.user.id)
        }

        // Vérifier le solde
        if (wallet.balance < price) {
          return NextResponse.json(
            { success: false, error: `Solde insuffisant. Prix: ${price} TC, Solde: ${wallet.balance} TC` },
            { status: 400 }
          )
        }

        // Débiter
        wallet.spendCoins(price)
        await walletRepository.update(wallet)

        // Équiper directement l'item au monstre
        const updateField = `equippedItems.${category}`

        await Monster.findByIdAndUpdate(
          monsterId,
          {
            [updateField]: itemId
          }
        )

        console.log(`✅ [TEST MODE] Item ${itemId} (${category}) acheté pour ${price} TC et équipé au monstre ${monsterId}`)

        return NextResponse.json({
          success: true,
          data: {
            inventoryItemId: `test_inv_${Date.now()}`,
            remainingBalance: wallet.balance
          },
          message: 'Item purchased and equipped successfully (test mode)'
        })
      } catch (error) {
        console.error('Error in test mode purchase:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to purchase item in test mode' },
          { status: 500 }
        )
      }
    }

    // Mode production : utiliser le use case normal

    // Mode production : utiliser le use case normal
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

    // Équiper l'item automatiquement au monstre
    try {
      await connectToDatabase()

      // Récupérer l'item depuis la DB pour connaître sa catégorie
      const item = await shopRepository.findItemById(itemId)
      if (item !== null) {
        const category: ItemCategory = item.category
        const updateField = `equippedItems.${category}`

        await Monster.findByIdAndUpdate(
          monsterId,
          {
            [updateField]: itemId
          }
        )

        console.log(`✅ Item ${itemId} (${category}) équipé au monstre ${monsterId}`)
      }
    } catch (error) {
      console.error('Error equipping item to monster:', error)
      // On ne fait pas échouer la requête, l'item a été acheté
    }

    // Succès
    return NextResponse.json({
      success: true,
      data: {
        inventoryItemId: result.inventoryItemId,
        remainingBalance: result.remainingBalance
      },
      message: 'Item purchased and equipped successfully'
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
