/**
 * API Route: POST /api/monster/toggle-item
 *
 * Équiper ou déséquiper un item directement sur un monstre
 * IMPORTANT: Cette route gère à la fois monster.equippedItems ET inventoryitems
 *
 * Body:
 * {
 *   monsterId: string
 *   category: 'hat' | 'glasses' | 'shoes'
 *   itemId: string | null  // null pour déséquiper, sinon l'ID de l'item à équiper
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
    const { monsterId, category, itemId } = body

    // Validation
    if (typeof monsterId !== 'string' || monsterId === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    if (typeof category !== 'string' || !['hat', 'glasses', 'shoes'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Valid category is required (hat, glasses, shoes)' },
        { status: 400 }
      )
    }

    if (itemId !== null && typeof itemId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'itemId must be a string or null' },
        { status: 400 }
      )
    }

    // Connexion MongoDB
    await connectMongooseToDatabase()

    // Récupérer le monstre pour avoir l'ownerId
    const monster = await MonsterModel.findById(monsterId)
    if (!monster) {
      return NextResponse.json(
        { success: false, error: 'Monster not found' },
        { status: 404 }
      )
    }

    const inventoryRepo = new MongoInventoryRepository()

    if (itemId !== null) {
      // ÉQUIPER: Mettre à jour l'inventaire
      const inventoryItems = await inventoryRepo.findByMonsterId(monsterId)
      const itemToEquip = inventoryItems.find(item => item.itemId === itemId)

      if (itemToEquip !== undefined) {
        // L'item existe déjà dans l'inventaire, on le marque comme équipé
        itemToEquip.equip()
        await inventoryRepo.updateItem(itemToEquip)
      } else {
        // L'item n'existe pas dans l'inventaire, on le crée (cas items de test)
        const newItem = new InventoryItem({
          id: '', // Sera généré par MongoDB
          itemId,
          monsterId,
          ownerId: monster.ownerId.toString(),
          purchasedAt: new Date(),
          isEquipped: true
        })
        await inventoryRepo.addItem(newItem)
      }

      // Déséquiper les autres items de la même catégorie dans l'inventaire
      const itemsInCategory = inventoryItems.filter(item => item.itemId !== itemId && item.isEquipped)
      for (const item of itemsInCategory) {
        // Vérifier si c'est la même catégorie (basé sur l'itemId)
        if (item.itemId.includes(`_${category}_`)) {
          item.unequip()
          await inventoryRepo.updateItem(item)
        }
      }
    } else {
      // DÉSÉQUIPER: Mettre à jour l'inventaire
      const inventoryItems = await inventoryRepo.findByMonsterId(monsterId)
      console.log(`🔍 Recherche item équipé dans catégorie ${category}`)
      console.log('Items inventaire:', inventoryItems.map(i => ({ id: i.itemId, equipped: i.isEquipped })))
      
      const equippedItemInCategory = inventoryItems.find(item => 
        item.isEquipped && item.itemId.includes(`_${category}_`)
      )

      if (equippedItemInCategory !== undefined) {
        console.log(`✅ Item trouvé à déséquiper: ${equippedItemInCategory.itemId}`)
        equippedItemInCategory.unequip()
        await inventoryRepo.updateItem(equippedItemInCategory)
        console.log(`✅ Item déséquipé dans l'inventaire`)
      } else {
        console.log(`⚠️ Aucun item équipé trouvé dans la catégorie ${category}`)
      }
    }

    // Mettre à jour monster.equippedItems
    const updateField = `equippedItems.${category}`
    const updatedMonster = await MonsterModel.findByIdAndUpdate(
      monsterId,
      { $set: { [updateField]: itemId } },
      { new: true }
    )

    const action = itemId === null ? 'déséquipé' : 'équipé'
    console.log(`✅ Item ${action}: ${category} = ${itemId ?? 'null'} sur monster ${monsterId}`)

    return NextResponse.json({
      success: true,
      message: `${category} ${action} successfully`,
      monster: {
        id: updatedMonster!._id,
        equippedItems: updatedMonster!.equippedItems
      }
    })
  } catch (error) {
    console.error('Error toggling item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle item'
      },
      { status: 500 }
    )
  }
}
