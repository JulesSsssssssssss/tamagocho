/**
 * API Route: POST /api/shop/seed
 *
 * Créer des items de test pour la boutique
 */

import { NextResponse } from 'next/server'
import { MongoShopRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { ShopItem } from '@/domain/entities/ShopItem'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

const TEST_ITEMS = [
  // Chapeaux
  {
    name: 'Casquette Basique',
    description: 'Une simple casquette pour protéger du soleil',
    category: 'hat' as ItemCategory,
    rarity: 'common' as ItemRarity
  },
  {
    name: 'Chapeau de Magicien',
    description: 'Un chapeau pointu magique avec des étoiles',
    category: 'hat' as ItemCategory,
    rarity: 'rare' as ItemRarity
  },
  {
    name: 'Couronne Royale',
    description: 'Une couronne digne d\'un roi',
    category: 'hat' as ItemCategory,
    rarity: 'epic' as ItemRarity
  },
  {
    name: 'Auréole Céleste',
    description: 'Une auréole lumineuse légendaire',
    category: 'hat' as ItemCategory,
    rarity: 'legendary' as ItemRarity
  },

  // Lunettes
  {
    name: 'Lunettes de Soleil',
    description: 'Des lunettes de soleil classiques',
    category: 'glasses' as ItemCategory,
    rarity: 'common' as ItemRarity
  },
  {
    name: 'Monocle Élégant',
    description: 'Un monocle pour un style raffiné',
    category: 'glasses' as ItemCategory,
    rarity: 'rare' as ItemRarity
  },
  {
    name: 'Lunettes Cyber',
    description: 'Des lunettes futuristes high-tech',
    category: 'glasses' as ItemCategory,
    rarity: 'epic' as ItemRarity
  },
  {
    name: 'Vision Laser',
    description: 'Des lunettes avec vision laser intégrée',
    category: 'glasses' as ItemCategory,
    rarity: 'legendary' as ItemRarity
  },

  // Chaussures
  {
    name: 'Baskets Confortables',
    description: 'Des baskets parfaites pour courir',
    category: 'shoes' as ItemCategory,
    rarity: 'common' as ItemRarity
  },
  {
    name: 'Bottes de Cowboy',
    description: 'Des bottes western stylées',
    category: 'shoes' as ItemCategory,
    rarity: 'rare' as ItemRarity
  },
  {
    name: 'Chaussures Fusée',
    description: 'Des chaussures avec propulseurs intégrés',
    category: 'shoes' as ItemCategory,
    rarity: 'epic' as ItemRarity
  },
  {
    name: 'Bottes Ailées',
    description: 'Les bottes d\'Hermès lui-même',
    category: 'shoes' as ItemCategory,
    rarity: 'legendary' as ItemRarity
  }
]

export async function POST (): Promise<NextResponse> {
  try {
    const shopRepository = new MongoShopRepository()
    const createdItems = []

    for (const itemData of TEST_ITEMS) {
      try {
        const item = ShopItem.create(
          `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemData.name,
          itemData.description,
          itemData.category,
          itemData.rarity
        )

        await shopRepository.createItem(item)
        createdItems.push(item.name)
      } catch (error) {
        console.log(`Item ${itemData.name} might already exist, skipping...`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdItems.length} items`,
      items: createdItems
    })
  } catch (error) {
    console.error('Error seeding shop items:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed shop items'
      },
      { status: 500 }
    )
  }
}
