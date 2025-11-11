/**
 * Use Case: GetPlayerInventory - Application Layer
 *
 * Responsabilités (SRP):
 * - Récupérer l'inventaire d'une créature avec les détails des items
 * - Enrichir les données avec les informations de la boutique
 *
 * Principe DIP:
 * - Dépend des abstractions des repositories
 */

import type { IInventoryRepository, IShopRepository } from '@/domain/repositories/IShopRepository'
import type { ItemCategory, BackgroundType } from '@/shared/types/shop'

/**
 * DTO pour un item d'inventaire enrichi
 */
export interface InventoryItemDTO {
  id: string
  itemId: string
  monsterId: string
  name: string
  description: string
  category: ItemCategory
  rarity: string
  imageUrl?: string
  backgroundType?: BackgroundType // Pour les fonds d'écran
  isEquipped: boolean
  purchasedAt: Date
}

/**
 * Use Case: Récupérer l'inventaire d'une créature
 */
export class GetPlayerInventoryUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository,
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Récupérer l'inventaire complet d'une créature avec détails des items
   */
  async execute (monsterId: string): Promise<InventoryItemDTO[]> {
    // Récupérer les items d'inventaire de la créature
    const inventoryItems = await this.inventoryRepository.findByMonsterId(monsterId)

    // Enrichir avec les données de la boutique
    const enrichedItems = await Promise.all(
      inventoryItems.map(async (invItem) => {
        const shopItem = await this.shopRepository.findItemById(invItem.itemId)

        if (shopItem === null) {
          throw new Error(`Shop item ${invItem.itemId} not found`)
        }

        return {
          id: invItem.id,
          itemId: invItem.itemId,
          monsterId: invItem.monsterId,
          name: shopItem.name,
          description: shopItem.description,
          category: shopItem.category,
          rarity: shopItem.rarity,
          imageUrl: shopItem.imageUrl,
          backgroundType: shopItem.backgroundType, // Inclure le type de fond
          isEquipped: invItem.isEquipped,
          purchasedAt: invItem.purchasedAt
        }
      })
    )

    return enrichedItems
  }

  /**
   * Récupérer uniquement les items équipés d'une créature
   */
  async getEquippedItems (monsterId: string): Promise<InventoryItemDTO[]> {
    const allItems = await this.execute(monsterId)
    return allItems.filter(item => item.isEquipped)
  }

  /**
   * Récupérer les items par catégorie pour une créature
   */
  async getItemsByCategory (monsterId: string, category: ItemCategory): Promise<InventoryItemDTO[]> {
    const allItems = await this.execute(monsterId)
    return allItems.filter(item => item.category === category)
  }

  /**
   * Récupérer tous les inventaires d'un joueur (toutes ses créatures)
   */
  async getAllPlayerItems (userId: string): Promise<InventoryItemDTO[]> {
    // Récupérer tous les items du joueur
    const inventoryItems = await this.inventoryRepository.findByOwnerId(userId)

    // Enrichir avec les données de la boutique
    const enrichedItems = await Promise.all(
      inventoryItems.map(async (invItem) => {
        const shopItem = await this.shopRepository.findItemById(invItem.itemId)

        if (shopItem === null) {
          throw new Error(`Shop item ${invItem.itemId} not found`)
        }

        return {
          id: invItem.id,
          itemId: invItem.itemId,
          monsterId: invItem.monsterId,
          name: shopItem.name,
          description: shopItem.description,
          category: shopItem.category,
          rarity: shopItem.rarity,
          imageUrl: shopItem.imageUrl,
          backgroundType: shopItem.backgroundType, // Inclure le type de fond
          isEquipped: invItem.isEquipped,
          purchasedAt: invItem.purchasedAt
        }
      })
    )

    return enrichedItems
  }
}
