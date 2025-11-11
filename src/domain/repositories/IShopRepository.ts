/**
 * Interface du Repository Shop - Domain Layer
 *
 * Responsabilités (SRP):
 * - Définir le contrat pour l'accès aux données de la boutique
 * - Abstraction indépendante de l'implémentation
 *
 * Principe DIP (Dependency Inversion):
 * - Le Domain définit l'interface
 * - L'Infrastructure implémente
 */

import type { ShopItem } from '../entities/ShopItem'
import type { InventoryItem } from '../entities/InventoryItem'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

/**
 * Repository pour la gestion des items de la boutique
 */
export interface IShopRepository {
  /**
   * Récupérer tous les items disponibles dans la boutique
   */
  findAllAvailableItems: () => Promise<ShopItem[]>

  /**
   * Récupérer un item par son ID
   */
  findItemById: (itemId: string) => Promise<ShopItem | null>

  /**
   * Récupérer les items par catégorie
   */
  findItemsByCategory: (category: ItemCategory) => Promise<ShopItem[]>

  /**
   * Récupérer les items par rareté
   */
  findItemsByRarity: (rarity: ItemRarity) => Promise<ShopItem[]>

  /**
   * Créer un nouvel item dans la boutique
   */
  createItem: (item: ShopItem) => Promise<void>

  /**
   * Mettre à jour un item
   */
  updateItem: (item: ShopItem) => Promise<void>

  /**
   * Supprimer un item
   */
  deleteItem: (itemId: string) => Promise<void>
}

/**
 * Repository pour la gestion de l'inventaire des créatures
 */
export interface IInventoryRepository {
  /**
   * Récupérer l'inventaire complet d'une créature
   */
  findByMonsterId: (monsterId: string) => Promise<InventoryItem[]>

  /**
   * Récupérer tous les items d'un joueur (toutes ses créatures)
   */
  findByOwnerId: (ownerId: string) => Promise<InventoryItem[]>

  /**
   * Ajouter un item à l'inventaire d'une créature
   */
  addItem: (item: InventoryItem) => Promise<void>

  /**
   * Retirer un item de l'inventaire
   */
  removeItem: (itemId: string) => Promise<void>

  /**
   * Mettre à jour un item de l'inventaire (ex: équiper/déséquiper)
   */
  updateItem: (item: InventoryItem) => Promise<void>

  /**
   * Vérifier si une créature possède déjà un item spécifique
   */
  hasItem: (monsterId: string, shopItemId: string) => Promise<boolean>

  /**
   * Récupérer les items équipés d'une créature
   */
  findEquippedItems: (monsterId: string) => Promise<InventoryItem[]>
}
