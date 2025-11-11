/**
 * Use Case: EquipBackground - Application Layer
 *
 * Responsabilités (SRP):
 * - Équiper un fond d'écran à une créature
 * - Gérer la règle métier: un seul fond d'écran équipé par créature
 *
 * Principe DIP:
 * - Dépend de l'abstraction IInventoryRepository et IMonsterRepository
 */

import type { IInventoryRepository, IShopRepository } from '@/domain/repositories/IShopRepository'

/**
 * DTO pour l'input
 */
export interface EquipBackgroundInput {
  monsterId: string
  inventoryItemId: string
}

/**
 * DTO pour l'output
 */
export interface EquipBackgroundOutput {
  success: boolean
  error?: string
  backgroundType?: string
}

/**
 * Erreurs métier
 */
export class BackgroundNotFoundError extends Error {
  constructor (itemId: string) {
    super(`Background item ${itemId} not found`)
    this.name = 'BackgroundNotFoundError'
  }
}

export class NotABackgroundError extends Error {
  constructor () {
    super('Item is not a background')
    this.name = 'NotABackgroundError'
  }
}

/**
 * Use Case: Équiper un fond d'écran
 */
export class EquipBackgroundUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository,
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Équiper un fond d'écran
   * Remplace automatiquement le fond précédent
   */
  async execute (input: EquipBackgroundInput): Promise<EquipBackgroundOutput> {
    try {
      // Récupérer l'item de l'inventaire
      const inventoryItems = await this.inventoryRepository.findByMonsterId(input.monsterId)
      const backgroundItem = inventoryItems.find(item => item.id === input.inventoryItemId)

      if (backgroundItem === undefined) {
        throw new BackgroundNotFoundError(input.inventoryItemId)
      }

      // Vérifier que c'est bien un fond d'écran
      const shopItem = await this.shopRepository.findItemById(backgroundItem.itemId)
      if (shopItem === null) {
        throw new Error('Shop item not found')
      }

      if (shopItem.category !== 'background') {
        throw new NotABackgroundError()
      }

      // Équiper le fond (marquer comme équipé dans l'inventaire)
      backgroundItem.equip()
      await this.inventoryRepository.updateItem(backgroundItem)

      // Déséquiper les autres fonds de cette créature
      const otherBackgrounds = inventoryItems.filter(item =>
        item.id !== input.inventoryItemId
      )

      for (const item of otherBackgrounds) {
        const otherShopItem = await this.shopRepository.findItemById(item.itemId)
        if (otherShopItem !== null && otherShopItem.category === 'background' && item.isEquipped) {
          item.unequip()
          await this.inventoryRepository.updateItem(item)
        }
      }

      return {
        success: true,
        backgroundType: shopItem.backgroundType
      }
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
