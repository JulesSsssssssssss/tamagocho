/**
 * API Route: POST /api/monster/add-test-item
 *
 * Ajouter un item de test à l'inventaire d'un monstre
 * Utile pour le développement et les tests
 *
 * Body:
 * {
 *   monsterId: string
 *   itemId: string  // ID de l'item de test (ex: "test_hat_epic_1")
 * }
 */

import { NextResponse } from 'next/server'
import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'
import { MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { InventoryItem } from '@/domain/entities/InventoryItem'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { monsterId, itemId } = body

    // Validation
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

    // Connexion MongoDB
    await connectMongooseToDatabase()

    // Récupérer le monstre
    const monster = await MonsterModel.findById(monsterId)
    if (!monster) {
      return NextResponse.json(
        { success: false, error: 'Monster not found' },
        { status: 404 }
      )
    }

    const inventoryRepo = new MongoInventoryRepository()

    // Vérifier si l'item existe déjà
    const hasItem = await inventoryRepo.hasItem(monsterId, itemId)
    if (hasItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in inventory' },
        { status: 400 }
      )
    }

    // Créer l'item dans l'inventaire
    const newItem = new InventoryItem({
      id: '', // Sera généré par MongoDB
      itemId,
      monsterId,
      ownerId: monster.ownerId.toString(),
      purchasedAt: new Date(),
      isEquipped: false
    })

    await inventoryRepo.addItem(newItem)

    console.log(`✅ Item de test ajouté à l'inventaire: ${itemId} pour monster ${monsterId}`)

    return NextResponse.json({
      success: true,
      message: 'Test item added to inventory',
      item: {
        itemId,
        monsterId,
        isEquipped: false
      }
    })
  } catch (error) {
    console.error('Error adding test item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add test item'
      },
      { status: 500 }
    )
  }
}
