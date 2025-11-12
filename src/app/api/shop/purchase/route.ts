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
import Player from '@/db/models/player.model'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { InventoryItem } from '@/domain/entities/InventoryItem'
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
    const { monsterId, itemId, price: clientPrice } = body

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

        // Extraire la catégorie de l'ID de test
        const parts = itemId.split('_')
        const category = parts[1] as ItemCategory

        // Utiliser le prix envoyé par le client (provenant de TEST_SHOP_ITEMS)
        // pour éviter les incohérences de calcul
        let price: number

        if (typeof clientPrice === 'number' && clientPrice > 0) {
          price = clientPrice
        } else {
          // Fallback : recalculer le prix si non fourni
          const rarity = parts[2] as ItemRarity
          const basePrices: Record<ItemCategory, number> = {
            hat: 50,
            glasses: 75,
            shoes: 100,
            background: 150
          }
          const rarityMultipliers: Record<ItemRarity, number> = {
            common: 1,
            rare: 2.5,
            epic: 5,
            legendary: 10
          }
          price = Math.round(basePrices[category] * rarityMultipliers[rarity])
        }

        // Récupérer le Player (source de vérité pour les coins)
        await connectToDatabase()
        let player = await Player.findOne({ userId: session.user.id }).exec()

        if (player === null) {
          // Créer le player s'il n'existe pas
          player = new Player({
            userId: session.user.id,
            coins: 100, // Bonus initial
            totalMonstersCreated: 0
          })
          await player.save()
        }

        // IMPORTANT: Vérifier si l'item existe déjà AVANT de débiter
        const inventoryRepository = new MongoInventoryRepository()
        const hasItem = await inventoryRepository.hasItem(monsterId, itemId)

        if (hasItem) {
          // L'item existe déjà, retourner une erreur SANS débiter
          const itemName = parts.slice(3).join(' ') || 'cet item'
          return NextResponse.json(
            {
              success: false,
              error: `Ce monstre possède déjà ${itemName}. Allez dans votre inventaire pour l'équiper.`,
              code: 'ALREADY_OWNED'
            },
            { status: 400 }
          )
        }

        // Vérifier le solde
        if (player.coins < price) {
          return NextResponse.json(
            { success: false, error: `Solde insuffisant. Prix: ${price} TC, Solde: ${player.coins} TC` },
            { status: 400 }
          )
        }

        // Débiter les coins UNIQUEMENT si l'item n'existe pas déjà
        player.coins -= price
        await player.save()

        // Créer l'item dans l'inventaire
        const newItem = new InventoryItem({
          id: '', // Sera généré par MongoDB
          itemId,
          monsterId,
          ownerId: session.user.id,
          purchasedAt: new Date(),
          isEquipped: true // Équipé directement à l'achat
        })
        await inventoryRepository.addItem(newItem)
        console.log(`✅ Item ajouté à l'inventaire: ${itemId} pour monster ${monsterId}`)

        // Équiper l'item au monstre
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
            remainingBalance: player.coins
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

    // Mode production : gérer l'achat avec Player.coins
    try {
      await connectToDatabase()

      // Récupérer l'item pour connaître son prix
      const shopRepository = new MongoShopRepository()
      const item = await shopRepository.findItemById(itemId)

      if (item === null) {
        return NextResponse.json(
          { success: false, error: 'Item not found' },
          { status: 404 }
        )
      }

      if (!item.isAvailable) {
        return NextResponse.json(
          { success: false, error: 'Item not available' },
          { status: 400 }
        )
      }

      const price = typeof clientPrice === 'number' && clientPrice > 0 ? clientPrice : item.price

      // Vérifier que la créature appartient à l'utilisateur
      const monster = await Monster.findById(monsterId).exec()
      if (monster === null || monster.ownerId.toString() !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Monster not found or unauthorized' },
          { status: 403 }
        )
      }

      // Vérifier si la créature possède déjà cet item
      const inventoryRepository = new MongoInventoryRepository()
      const hasItem = await inventoryRepository.hasItem(monsterId, itemId)
      if (hasItem) {
        return NextResponse.json(
          {
            success: false,
            error: `Ce monstre possède déjà ${item.name}. Allez dans votre inventaire pour l'équiper.`,
            code: 'ALREADY_OWNED'
          },
          { status: 400 }
        )
      }

      // Récupérer le Player (source de vérité pour les coins)
      let player = await Player.findOne({ userId: session.user.id }).exec()

      if (player === null) {
        // Créer le player s'il n'existe pas
        player = new Player({
          userId: session.user.id,
          coins: 100, // Bonus initial
          totalMonstersCreated: 0
        })
        await player.save()
      }

      // Vérifier le solde
      if (player.coins < price) {
        return NextResponse.json(
          { success: false, error: `Solde insuffisant. Prix: ${price} TC, Solde: ${player.coins} TC` },
          { status: 400 }
        )
      }

      // Débiter les coins
      player.coins -= price
      await player.save()

      // Ajouter l'item à l'inventaire
      const inventoryItem = InventoryItem.create(
        `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        itemId,
        monsterId,
        session.user.id
      )
      await inventoryRepository.addItem(inventoryItem)

      // Équiper l'item au monstre
      const category: ItemCategory = item.category
      const updateField = `equippedItems.${category}`

      await Monster.findByIdAndUpdate(
        monsterId,
        {
          [updateField]: itemId
        }
      )

      console.log(`✅ [PRODUCTION] Item ${itemId} (${category}) acheté pour ${price} TC et équipé au monstre ${monsterId}`)

      return NextResponse.json({
        success: true,
        data: {
          inventoryItemId: inventoryItem.id,
          remainingBalance: player.coins
        },
        message: 'Item purchased and equipped successfully'
      })
    } catch (error) {
      console.error('Error in production mode purchase:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to purchase item' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error purchasing item (outer):', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to purchase item'
      },
      { status: 500 }
    )
  }
}
