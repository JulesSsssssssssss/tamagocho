/**
 * Types et constantes pour le système de boutique
 *
 * Shared Layer - Utilisé par Domain, Application et Infrastructure
 */

/**
 * Catégories d'items disponibles dans la boutique
 */
export type ItemCategory = 'hat' | 'glasses' | 'shoes'

/**
 * Niveaux de rareté des items
 */
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'

/**
 * Interface pour les propriétés d'un item
 */
export interface IShopItemProps {
  id: string
  name: string
  description: string
  category: ItemCategory
  rarity: ItemRarity
  price: number
  imageUrl?: string
  isAvailable: boolean
  createdAt: Date
}

/**
 * Interface pour un item dans l'inventaire
 * Rattaché à une créature spécifique (monsterId)
 */
export interface IInventoryItemProps {
  id: string
  itemId: string
  monsterId: string // ID de la créature qui possède l'item
  ownerId: string // ID du joueur (pour requêtes)
  purchasedAt: Date
  isEquipped: boolean
}

/**
 * Constantes de prix selon la rareté
 */
export const RARITY_PRICE_MULTIPLIER: Record<ItemRarity, number> = {
  common: 1,
  rare: 2.5,
  epic: 5,
  legendary: 10
}

/**
 * Prix de base par catégorie (en TC)
 */
export const BASE_PRICES: Record<ItemCategory, number> = {
  hat: 50,
  glasses: 75,
  shoes: 100
}

/**
 * Labels français pour les catégories
 */
export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  hat: 'Chapeau',
  glasses: 'Lunettes',
  shoes: 'Chaussures'
}

/**
 * Labels français pour les raretés
 */
export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire'
}

/**
 * Couleurs associées aux raretés (pour le UI)
 */
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#9CA3AF', // gray-400
  rare: '#3B82F6', // blue-500
  epic: '#8B5CF6', // purple-500
  legendary: '#F59E0B' // amber-500
}
