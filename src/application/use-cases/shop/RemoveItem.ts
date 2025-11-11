/**
 * Use Case: RemoveItem - Application Layer
 *
 * Responsabilités (SRP):
 * - Retirer un item de l'inventaire d'une créature
 * - Validation de l'existence de l'item avant suppression
 *
 * Principe DIP:
 * - Dépend de l'abstraction IInventoryRepository
 */

import type { IInventoryRepository } from '@/domain/repositories/IShopRepository'

/**
 * DTO pour l'input
 */
export interface RemoveItemInput {
  monsterId: string
  inventoryItemId: string
}

/**
 * DTO pour l'output
 */
export interface RemoveItemOutput {
  success: boolean
  error?: string
}

/**
 * Erreurs métier
 */
export class ItemNotFoundInInventoryError extends Error {
  constructor (itemId: string) {
    super(`Item with ID ${itemId} not found in inventory`)
    this.name = 'ItemNotFoundInInventoryError'
  }
}

export class ItemBelongsToAnotherMonsterError extends Error {
  constructor (itemId: string, expectedMonsterId: string) {
    super(`Item ${itemId} does not belong to monster ${expectedMonsterId}`)
    this.name = 'ItemBelongsToAnotherMonsterError'
  }
}

/**
 * Use Case: Retirer un item de l'inventaire
 */
export class RemoveItemFromInventoryUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  /**
   * Retirer un item de l'inventaire d'une créature
   * Vérifie que l'item appartient bien à la créature
   */
  async execute (input: RemoveItemInput): Promise<RemoveItemOutput> {
    try {
      // Récupérer tous les items de l'inventaire de la créature
      const inventoryItems = await this.inventoryRepository.findByMonsterId(input.monsterId)

      // Trouver l'item à retirer
      const itemToRemove = inventoryItems.find(item => item.id === input.inventoryItemId)

      if (itemToRemove === undefined) {
        throw new ItemNotFoundInInventoryError(input.inventoryItemId)
      }

      // Vérifier que l'item appartient bien à cette créature (sécurité)
      if (itemToRemove.monsterId !== input.monsterId) {
        throw new ItemBelongsToAnotherMonsterError(input.inventoryItemId, input.monsterId)
      }

      // Retirer l'item de l'inventaire (suppression définitive de MongoDB)
      await this.inventoryRepository.removeItem(input.inventoryItemId)

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
        error: 'An unexpected error occurred while removing item'
      }
    }
  }
}
