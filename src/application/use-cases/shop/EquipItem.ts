/**
 * Use Case: EquipItem - Application Layer
 *
 * Responsabilités (SRP):
 * - Équiper/déséquiper des items de l'inventaire
 * - Gérer la règle métier: un seul item par catégorie équipé
 *
 * Principe DIP:
 * - Dépend de l'abstraction IInventoryRepository
 */

import type { IInventoryRepository, IShopRepository } from '@/domain/repositories/IShopRepository'

/**
 * DTO pour l'input
 */
export interface EquipItemInput {
  monsterId: string
  inventoryItemId: string
}

/**
 * DTO pour l'output
 */
export interface EquipItemOutput {
  success: boolean
  error?: string
}

/**
 * Erreurs métier
 */
export class InventoryItemNotFoundError extends Error {
  constructor (itemId: string) {
    super(`Inventory item ${itemId} not found`)
    this.name = 'InventoryItemNotFoundError'
  }
}

/**
 * Use Case: Équiper un item
 */
export class EquipItemUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository,
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Équiper un item
   * Déséquipe automatiquement les autres items de la même catégorie
   */
  async execute (input: EquipItemInput): Promise<EquipItemOutput> {
    try {
      // Récupérer tous les items de l'inventaire de la créature
      const inventoryItems = await this.inventoryRepository.findByMonsterId(input.monsterId)

      // Trouver l'item à équiper
      const itemToEquip = inventoryItems.find(item => item.id === input.inventoryItemId)
      if (itemToEquip === undefined) {
        throw new InventoryItemNotFoundError(input.inventoryItemId)
      }

      // Récupérer les détails de l'item depuis la boutique
      const shopItem = await this.shopRepository.findItemById(itemToEquip.itemId)
      if (shopItem === null) {
        throw new Error('Shop item not found')
      }

      // Déséquiper tous les items de la même catégorie
      const itemsInSameCategory = inventoryItems.filter(item =>
        item.id !== input.inventoryItemId
      )

      for (const item of itemsInSameCategory) {
        const otherShopItem = await this.shopRepository.findItemById(item.itemId)
        if (otherShopItem !== null && otherShopItem.category === shopItem.category && item.isEquipped) {
          item.unequip()
          await this.inventoryRepository.updateItem(item)
        }
      }

      // Équiper l'item
      itemToEquip.equip()
      await this.inventoryRepository.updateItem(itemToEquip)

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

/**
 * Use Case: Déséquiper un item
 */
export class UnequipItemUseCase {
  constructor (
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  /**
   * Déséquiper un item
   */
  async execute (input: EquipItemInput): Promise<EquipItemOutput> {
    try {
      // Récupérer tous les items de l'inventaire de la créature
      const inventoryItems = await this.inventoryRepository.findByMonsterId(input.monsterId)

      // Trouver l'item à déséquiper
      const itemToUnequip = inventoryItems.find(item => item.id === input.inventoryItemId)
      if (itemToUnequip === undefined) {
        throw new InventoryItemNotFoundError(input.inventoryItemId)
      }

      // Déséquiper l'item
      itemToUnequip.unequip()
      await this.inventoryRepository.updateItem(itemToUnequip)

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
