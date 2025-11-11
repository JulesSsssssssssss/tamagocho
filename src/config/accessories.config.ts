/**
 * Configuration des Accessoires (Items Équipables)
 *
 * Centralise tous les accessoires disponibles dans la boutique.
 * Catégories : Chapeaux, Lunettes, Chaussures
 *
 * @module config/accessories
 */

import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

/**
 * Interface pour la définition d'un accessoire
 */
export interface AccessoryDefinition {
  /** Identifiant unique (généré côté serveur) */
  name: string
  /** Description de l'accessoire */
  description: string
  /** Catégorie d'accessoire */
  category: ItemCategory
  /** Rareté (détermine le prix) */
  rarity: ItemRarity
  /** Chemin vers l'image pixel art */
  imageUrl: string
}

/**
 * Catalogue des Chapeaux
 */
export const HATS_CATALOG: AccessoryDefinition[] = [
  {
    name: 'Casquette Basique',
    description: 'Une simple casquette pour protéger du soleil',
    category: 'hat',
    rarity: 'common',
    imageUrl: '/items/hats/basic-cap.png'
  },
  {
    name: 'Chapeau de Magicien',
    description: 'Un chapeau pointu magique avec des étoiles',
    category: 'hat',
    rarity: 'rare',
    imageUrl: '/items/hats/wizard-hat.png'
  },
  {
    name: 'Couronne Royale',
    description: 'Une couronne digne d\'un roi',
    category: 'hat',
    rarity: 'epic',
    imageUrl: '/items/hats/royal-crown.png'
  },
  {
    name: 'Auréole Céleste',
    description: 'Une auréole lumineuse légendaire',
    category: 'hat',
    rarity: 'legendary',
    imageUrl: '/items/hats/halo.png'
  }
]

/**
 * Catalogue des Lunettes
 */
export const GLASSES_CATALOG: AccessoryDefinition[] = [
  {
    name: 'Lunettes de Soleil',
    description: 'Des lunettes de soleil classiques',
    category: 'glasses',
    rarity: 'common',
    imageUrl: '/items/glasses/sunglasses.png'
  },
  {
    name: 'Monocle Élégant',
    description: 'Un monocle pour un style raffiné',
    category: 'glasses',
    rarity: 'rare',
    imageUrl: '/items/glasses/monocle.png'
  },
  {
    name: 'Lunettes Cyber',
    description: 'Des lunettes futuristes high-tech',
    category: 'glasses',
    rarity: 'epic',
    imageUrl: '/items/glasses/cyber-glasses.png'
  },
  {
    name: 'Vision Laser',
    description: 'Des lunettes avec vision laser intégrée',
    category: 'glasses',
    rarity: 'legendary',
    imageUrl: '/items/glasses/laser-vision.png'
  }
]

/**
 * Catalogue des Chaussures
 */
export const SHOES_CATALOG: AccessoryDefinition[] = [
  {
    name: 'Baskets Confortables',
    description: 'Des baskets parfaites pour courir',
    category: 'shoes',
    rarity: 'common',
    imageUrl: '/items/shoes/sneakers.png'
  },
  {
    name: 'Bottes de Cowboy',
    description: 'Des bottes western stylées',
    category: 'shoes',
    rarity: 'rare',
    imageUrl: '/items/shoes/cowboy-boots.png'
  },
  {
    name: 'Chaussures Fusée',
    description: 'Des chaussures avec propulseurs intégrés',
    category: 'shoes',
    rarity: 'epic',
    imageUrl: '/items/shoes/rocket-shoes.png'
  },
  {
    name: 'Bottes Ailées',
    description: 'Les bottes d\'Hermès lui-même',
    category: 'shoes',
    rarity: 'legendary',
    imageUrl: '/items/shoes/winged-boots.png'
  }
]

/**
 * Catalogue complet de tous les accessoires
 * Combinaison de tous les types d'accessoires
 */
export const ACCESSORIES_CATALOG: AccessoryDefinition[] = [
  ...HATS_CATALOG,
  ...GLASSES_CATALOG,
  ...SHOES_CATALOG
]

/**
 * Helper : Récupérer tous les accessoires d'une catégorie
 */
export function getAccessoriesByCategory (category: ItemCategory): AccessoryDefinition[] {
  return ACCESSORIES_CATALOG.filter(item => item.category === category)
}

/**
 * Helper : Récupérer tous les accessoires d'une rareté
 */
export function getAccessoriesByRarity (rarity: ItemRarity): AccessoryDefinition[] {
  return ACCESSORIES_CATALOG.filter(item => item.rarity === rarity)
}

/**
 * Helper : Compter les accessoires par catégorie
 */
export function countAccessoriesByCategory (): Record<ItemCategory, number> {
  return {
    hat: HATS_CATALOG.length,
    glasses: GLASSES_CATALOG.length,
    shoes: SHOES_CATALOG.length,
    background: 0 // Les backgrounds ont leur propre config
  }
}

/**
 * Export groupé
 */
export const ACCESSORIES_CONFIG = {
  hats: HATS_CATALOG,
  glasses: GLASSES_CATALOG,
  shoes: SHOES_CATALOG,
  all: ACCESSORIES_CATALOG
} as const
