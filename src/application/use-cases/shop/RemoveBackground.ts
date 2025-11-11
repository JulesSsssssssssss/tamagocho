/**
 * Use Case: RemoveBackground - Application Layer
 *
 * Responsabilités (SRP):
 * - Retirer le fond d'écran équipé d'une créature
 *
 * Principe DIP:
 * - Dépend de l'abstraction IInventoryRepository
 */

import type { IInventoryRepository, IShopRepository } from '@/domain/repositories/IShopRepository'

/**
 * DTO pour l'input
 */
export interface RemoveBackgroundInput {
  monsterId: string
  inventoryItemId: string
}

/**
 * DTO pour l'output
 */
export interface RemoveBackgroundOutput {
  success: boolean
  error?: string
}

/**
 * Use Case: Retirer un fond d'écran
 */
export class RemoveBackgroundUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository,
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Retirer le fond d'écran équipé
   */
  async execute (input: RemoveBackgroundInput): Promise<RemoveBackgroundOutput> {
    try {
      // Récupérer l'item de l'inventaire
      const inventoryItems = await this.inventoryRepository.findByMonsterId(input.monsterId)
      const backgroundItem = inventoryItems.find(item => item.id === input.inventoryItemId)

      if (backgroundItem === undefined) {
        throw new Error('Background item not found')
      }

      // Vérifier que c'est bien un fond d'écran
      const shopItem = await this.shopRepository.findItemById(backgroundItem.itemId)
      if (shopItem === null) {
        throw new Error('Shop item not found')
      }

      if (shopItem.category !== 'background') {
        throw new Error('Item is not a background')
      }

      // Déséquiper le fond
      backgroundItem.unequip()
      await this.inventoryRepository.updateItem(backgroundItem)

      return { success: true }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }
}
