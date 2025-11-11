/**
 * Configuration de la Boutique
 *
 * Centralise toutes les constantes liées au système de boutique :
 * - Prix des items selon la rareté
 * - Labels et traductions
 * - Couleurs et styles
 *
 * @module config/shop
 */

import type { ItemCategory, ItemRarity } from '@/shared/types/shop'
import { BACKGROUND_TYPE_LABELS, BACKGROUND_TYPE_DESCRIPTIONS } from './backgrounds.config'

/**
 * Multiplicateurs de prix selon la rareté
 */
export const RARITY_PRICE_MULTIPLIER: Record<ItemRarity, number> = {
  common: 1,
  rare: 2.5,
  epic: 5,
  legendary: 10
} as const

/**
 * Prix de base par catégorie (en Koins)
 */
export const BASE_PRICES: Record<ItemCategory, number> = {
  hat: 50,
  glasses: 75,
  shoes: 100,
  background: 150
} as const

/**
 * Calcule le prix d'un item selon sa catégorie et sa rareté
 *
 * Formule : Prix de base × Multiplicateur de rareté
 * Exemple : Chapeau Epic → 50 × 5 = 250 Koins
 *
 * @param category - Catégorie de l'item
 * @param rarity - Rareté de l'item
 * @returns Prix calculé en Koins
 */
export function calculateItemPrice (category: ItemCategory, rarity: ItemRarity): number {
  const basePrice = BASE_PRICES[category]
  const multiplier = RARITY_PRICE_MULTIPLIER[rarity]
  return Math.floor(basePrice * multiplier)
}

/**
 * Labels français pour les catégories
 */
export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  hat: 'Chapeau',
  glasses: 'Lunettes',
  shoes: 'Chaussures',
  background: 'Fond d\'écran'
} as const

/**
 * Labels français pour les raretés
 */
export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
} as const

/**
 * Couleurs Tailwind pour les raretés (bordures, badges)
 */
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: 'border-gray-400 text-gray-400',
  rare: 'border-blue-400 text-blue-400',
  epic: 'border-purple-500 text-purple-500',
  legendary: 'border-yellow-500 text-yellow-500'
} as const

/**
 * Couleurs de fond pour les cartes d'items
 */
export const RARITY_BG_COLORS: Record<ItemRarity, string> = {
  common: 'bg-gray-900/40',
  rare: 'bg-blue-900/40',
  epic: 'bg-purple-900/40',
  legendary: 'bg-yellow-900/40'
} as const

// BACKGROUND_TYPE_LABELS et BACKGROUND_TYPE_DESCRIPTIONS sont définis dans backgrounds.config.ts
// pour éviter les conflits d'export lors de la ré-exportation dans config/index.ts

/**
 * Configuration des limites de l'inventaire
 */
export const INVENTORY_LIMITS = {
  /** Nombre maximum d'items par catégorie */
  MAX_ITEMS_PER_CATEGORY: 50,

  /** Nombre maximum d'items total */
  MAX_TOTAL_ITEMS: 200
} as const

/**
 * Configuration du système d'équipement
 */
export const EQUIPMENT_CONFIG = {
  /** Nombre de slots d'équipement par monstre */
  SLOTS_PER_MONSTER: 3, // chapeau, lunettes, chaussures

  /** Peut-on avoir plusieurs fois le même item ? */
  ALLOW_DUPLICATE_ITEMS: true,

  /** Peut-on équiper un item sur plusieurs monstres ? */
  ALLOW_SHARED_ITEMS: false
} as const

/**
 * Export groupé
 */
export const SHOP_CONFIG = {
  pricing: {
    rarityMultipliers: RARITY_PRICE_MULTIPLIER,
    basePrices: BASE_PRICES
  },
  labels: {
    categories: CATEGORY_LABELS,
    rarities: RARITY_LABELS,
    backgrounds: BACKGROUND_TYPE_LABELS,
    backgroundDescriptions: BACKGROUND_TYPE_DESCRIPTIONS
  },
  colors: {
    rarities: RARITY_COLORS,
    backgrounds: RARITY_BG_COLORS
  },
  inventory: INVENTORY_LIMITS,
  equipment: EQUIPMENT_CONFIG
} as const
