/**
 * Use Case: GetAllOwnerItems - Application Layer
 *
 * Responsabilités (SRP):
 * - Récupérer tous les items possédés par un joueur (toutes créatures confondues)
 * - Enrichir les données avec les détails des items depuis la boutique
 *
 * Principe DIP:
 * - Dépend des abstractions IInventoryRepository et IShopRepository
 */

import type { IInventoryRepository, IShopRepository } from '@/domain/repositories/IShopRepository'
import type { InventoryItemDTO } from './GetPlayerInventory'

/**
 * Use Case: Récupérer tous les items d'un joueur (toutes créatures)
 */
export class GetAllOwnerItemsUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository,
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Récupérer tous les items possédés par un joueur avec détails enrichis
   */
  async execute (ownerId: string): Promise<InventoryItemDTO[]> {
    // Récupérer tous les items de l'inventaire du joueur
    const inventoryItems = await this.inventoryRepository.findByOwnerId(ownerId)

    // Enrichir chaque item avec les détails du shop
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
          ownerId: invItem.ownerId,
          name: shopItem.name,
          description: shopItem.description,
          category: shopItem.category,
          rarity: shopItem.rarity,
          imageUrl: shopItem.imageUrl,
          isEquipped: invItem.isEquipped,
          purchasedAt: invItem.purchasedAt
        }
      })
    )

    return enrichedItems
  }
}
