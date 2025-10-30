/**
 * API Route: POST /api/admin/seed-shop
 *
 * Initialise la boutique avec les items de base
 * ⚠️ À utiliser uniquement lors du premier déploiement
 */

import { NextResponse } from 'next/server'
import { ShopItem } from '@/domain/entities/ShopItem'
import { MongoShopRepository } from '@/infrastructure/repositories/MongoShopRepository'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

/**
 * Items de base pour la boutique
 */
const INITIAL_SHOP_ITEMS = [
  // Chapeaux
  {
    name: 'Casquette Basique',
    description: 'Une simple casquette pour protéger du soleil',
    category: 'hat' as ItemCategory,
    rarity: 'common' as ItemRarity,
    imageUrl: '/items/hats/basic-cap.png'
  },
  {
    name: 'Chapeau de Magicien',
    description: 'Un chapeau pointu magique avec des étoiles',
    category: 'hat' as ItemCategory,
    rarity: 'rare' as ItemRarity,
    imageUrl: '/items/hats/wizard-hat.png'
  },
  {
    name: 'Couronne Royale',
    description: 'Une couronne digne d\'un roi',
    category: 'hat' as ItemCategory,
    rarity: 'epic' as ItemRarity,
    imageUrl: '/items/hats/royal-crown.png'
  },
  {
    name: 'Auréole Céleste',
    description: 'Une auréole lumineuse légendaire',
    category: 'hat' as ItemCategory,
    rarity: 'legendary' as ItemRarity,
    imageUrl: '/items/hats/halo.png'
  },

  // Lunettes
  {
    name: 'Lunettes de Soleil',
    description: 'Des lunettes de soleil classiques',
    category: 'glasses' as ItemCategory,
    rarity: 'common' as ItemRarity,
    imageUrl: '/items/glasses/sunglasses.png'
  },
  {
    name: 'Lunettes Steampunk',
    description: 'Des lunettes de style steampunk',
    category: 'glasses' as ItemCategory,
    rarity: 'rare' as ItemRarity,
    imageUrl: '/items/glasses/steampunk.png'
  },
  {
    name: 'Lunettes Laser',
    description: 'Des lunettes futuristes avec laser',
    category: 'glasses' as ItemCategory,
    rarity: 'epic' as ItemRarity,
    imageUrl: '/items/glasses/laser.png'
  },
  {
    name: 'Œil de Dragon',
    description: 'Des lunettes légendaires avec un œil de dragon',
    category: 'glasses' as ItemCategory,
    rarity: 'legendary' as ItemRarity,
    imageUrl: '/items/glasses/dragon-eye.png'
  },

  // Chaussures
  {
    name: 'Baskets Simples',
    description: 'Des baskets confortables',
    category: 'shoes' as ItemCategory,
    rarity: 'common' as ItemRarity,
    imageUrl: '/items/shoes/sneakers.png'
  },
  {
    name: 'Bottes de Cuir',
    description: 'Des bottes en cuir solides',
    category: 'shoes' as ItemCategory,
    rarity: 'rare' as ItemRarity,
    imageUrl: '/items/shoes/leather-boots.png'
  },
  {
    name: 'Chaussures Volantes',
    description: 'Des chaussures qui permettent de voler',
    category: 'shoes' as ItemCategory,
    rarity: 'epic' as ItemRarity,
    imageUrl: '/items/shoes/flying-shoes.png'
  },
  {
    name: 'Bottes Divines',
    description: 'Des bottes légendaires forgées par les dieux',
    category: 'shoes' as ItemCategory,
    rarity: 'legendary' as ItemRarity,
    imageUrl: '/items/shoes/divine-boots.png'
  }
]

export async function POST (): Promise<NextResponse> {
  try {
    const shopRepository = new MongoShopRepository()

    // Vérifier si des items existent déjà
    const existingItems = await shopRepository.findAllAvailableItems()
    if (existingItems.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Shop already contains items. Use DELETE first if you want to reset.',
        existingCount: existingItems.length
      }, { status: 400 })
    }

    // Créer les items
    const createdItems = []
    for (const itemData of INITIAL_SHOP_ITEMS) {
      const itemId = crypto.randomUUID()
      const item = ShopItem.create(
        itemId,
        itemData.name,
        itemData.description,
        itemData.category,
        itemData.rarity,
        itemData.imageUrl
      )

      await shopRepository.createItem(item)
      createdItems.push({
        id: item.id,
        name: item.name,
        category: item.category,
        rarity: item.rarity,
        price: item.price
      })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdItems.length} items`,
      count: createdItems.length,
      items: createdItems
    })
  } catch (error) {
    console.error('Error seeding shop items:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed shop items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Route pour supprimer tous les items (admin uniquement)
export async function DELETE (): Promise<NextResponse> {
  try {
    const shopRepository = new MongoShopRepository()

    // Récupérer tous les items disponibles et les supprimer
    const items = await shopRepository.findAllAvailableItems()
    
    for (const item of items) {
      await shopRepository.deleteItem(item.id)
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${items.length} items`,
      deletedCount: items.length
    })
  } catch (error) {
    console.error('Error deleting shop items:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete shop items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
