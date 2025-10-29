/**
 * Use Case: PurchaseItem - Application Layer
 *
 * Responsabilités (SRP):
 * - Orchestrer l'achat d'un item
 * - Valider les règles métier (wallet, disponibilité, duplication)
 * - Coordonner les repositories
 *
 * Principe DIP:
 * - Dépend des abstractions (interfaces repositories)
 * - Pas de dépendance concrète à l'infrastructure
 *
 * Principe OCP:
 * - Extensible via injection de dépendances
 */

import type { IShopRepository, IInventoryRepository } from '@/domain/repositories/IShopRepository'
import type { IWalletRepository } from '@/domain/repositories/IWalletRepository'
import { InventoryItem } from '@/domain/entities/InventoryItem'

/**
 * DTO pour l'input du use case
 */
export interface PurchaseItemInput {
  userId: string
  monsterId: string // ID de la créature qui recevra l'item
  itemId: string
}

/**
 * DTO pour l'output du use case
 */
export interface PurchaseItemOutput {
  success: boolean
  inventoryItemId?: string
  remainingBalance?: number
  error?: string
}

/**
 * Erreurs métier spécifiques
 */
export class ItemNotFoundError extends Error {
  constructor (itemId: string) {
    super(`Item with id ${itemId} not found`)
    this.name = 'ItemNotFoundError'
  }
}

export class ItemNotAvailableError extends Error {
  constructor (itemName: string) {
    super(`Item ${itemName} is not available for purchase`)
    this.name = 'ItemNotAvailableError'
  }
}

export class InsufficientFundsError extends Error {
  constructor (required: number, available: number) {
    super(`Insufficient funds. Required: ${required} TC, Available: ${available} TC`)
    this.name = 'InsufficientFundsError'
  }
}

export class ItemAlreadyOwnedError extends Error {
  constructor (itemName: string) {
    super(`You already own ${itemName}`)
    this.name = 'ItemAlreadyOwnedError'
  }
}

export class WalletNotFoundError extends Error {
  constructor (userId: string) {
    super(`Wallet not found for user ${userId}`)
    this.name = 'WalletNotFoundError'
  }
}

/**
 * Use Case: Acheter un item de la boutique
 */
export class PurchaseItemUseCase {
  constructor (
    private readonly shopRepository: IShopRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly walletRepository: IWalletRepository
  ) {}

  /**
   * Exécuter l'achat d'un item
   */
  async execute (input: PurchaseItemInput): Promise<PurchaseItemOutput> {
    try {
      // 1. Récupérer l'item de la boutique
      const shopItem = await this.shopRepository.findItemById(input.itemId)
      if (shopItem === null) {
        throw new ItemNotFoundError(input.itemId)
      }

      // 2. Vérifier que l'item est disponible
      if (!shopItem.canBePurchased()) {
        throw new ItemNotAvailableError(shopItem.name)
      }

      // 3. Vérifier que la créature ne possède pas déjà cet item
      const alreadyOwns = await this.inventoryRepository.hasItem(
        input.monsterId,
        input.itemId
      )
      if (alreadyOwns) {
        throw new ItemAlreadyOwnedError(shopItem.name)
      }

      // 4. Récupérer le wallet du joueur
      const wallet = await this.walletRepository.findByOwnerId(input.userId)
      if (wallet === null) {
        throw new WalletNotFoundError(input.userId)
      }

      // 5. Vérifier que le joueur a assez de coins
      if (wallet.balance < shopItem.price) {
        throw new InsufficientFundsError(shopItem.price, wallet.balance)
      }

      // 6. Débiter le wallet
      wallet.spendCoins(shopItem.price)
      await this.walletRepository.update(wallet)

      // 7. Créer l'item dans l'inventaire de la créature
      const inventoryItem = InventoryItem.create(
        this.generateInventoryItemId(),
        shopItem.id,
        input.monsterId,
        input.userId
      )
      await this.inventoryRepository.addItem(inventoryItem)

      // 8. Retourner le succès
      return {
        success: true,
        inventoryItemId: inventoryItem.id,
        remainingBalance: wallet.balance
      }
    } catch (error) {
      // Gestion des erreurs
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

  /**
   * Générer un ID unique pour l'item d'inventaire
   * NOTE: Dans une vraie implémentation, utiliser UUID ou MongoDB ObjectId
   */
  private generateInventoryItemId (): string {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
