/**
 * Script de seed pour peupler la boutique avec des items initiaux
 *
 * Usage: node scripts/seed-shop-items.js
 */

import { connectToDatabase } from '@/db'
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
    name: 'Monocle Élégant',
    description: 'Un monocle pour un style raffiné',
    category: 'glasses' as ItemCategory,
    rarity: 'rare' as ItemRarity,
    imageUrl: '/items/glasses/monocle.png'
  },
  {
    name: 'Lunettes Cyber',
    description: 'Des lunettes futuristes high-tech',
    category: 'glasses' as ItemCategory,
    rarity: 'epic' as ItemRarity,
    imageUrl: '/items/glasses/cyber-glasses.png'
  },
  {
    name: 'Vision Laser',
    description: 'Des lunettes avec vision laser intégrée',
    category: 'glasses' as ItemCategory,
    rarity: 'legendary' as ItemRarity,
    imageUrl: '/items/glasses/laser-vision.png'
  },

  // Chaussures
  {
    name: 'Baskets Confortables',
    description: 'Des baskets parfaites pour courir',
    category: 'shoes' as ItemCategory,
    rarity: 'common' as ItemRarity,
    imageUrl: '/items/shoes/sneakers.png'
  },
  {
    name: 'Bottes de Cowboy',
    description: 'Des bottes western stylées',
    category: 'shoes' as ItemCategory,
    rarity: 'rare' as ItemRarity,
    imageUrl: '/items/shoes/cowboy-boots.png'
  },
  {
    name: 'Chaussures Fusée',
    description: 'Des chaussures avec propulseurs intégrés',
    category: 'shoes' as ItemCategory,
    rarity: 'epic' as ItemRarity,
    imageUrl: '/items/shoes/rocket-shoes.png'
  },
  {
    name: 'Bottes Ailées',
    description: 'Les bottes d\'Hermès lui-même',
    category: 'shoes' as ItemCategory,
    rarity: 'legendary' as ItemRarity,
    imageUrl: '/items/shoes/winged-boots.png'
  }
]

/**
 * Fonction principale de seed
 */
async function seedShopItems (): Promise<void> {
  try {
    console.log('🌱 Starting shop items seeding...')

    await connectToDatabase()
    const shopRepository = new MongoShopRepository()

    let created = 0
    let skipped = 0

    for (const itemData of INITIAL_SHOP_ITEMS) {
      try {
        const item = ShopItem.create(
          `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemData.name,
          itemData.description,
          itemData.category,
          itemData.rarity,
          itemData.imageUrl
        )

        await shopRepository.createItem(item)
        created++
        console.log(`✅ Created: ${itemData.name} (${itemData.rarity})`)
      } catch (error) {
        skipped++
        console.log(`⏭️  Skipped: ${itemData.name} (may already exist)`)
      }
    }

    console.log('\n✨ Seeding completed!')
    console.log(`   Created: ${created} items`)
    console.log(`   Skipped: ${skipped} items`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding shop items:', error)
    process.exit(1)
  }
}

// Exécuter le seed
void seedShopItems()
