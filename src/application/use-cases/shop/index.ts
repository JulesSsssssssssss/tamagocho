/**
 * Barrel export pour les use cases de la boutique
 */

export { PurchaseItemUseCase } from './PurchaseItem'
export { GetShopItemsUseCase } from './GetShopItems'
export { GetPlayerInventoryUseCase } from './GetPlayerInventory'
export { EquipItemUseCase, UnequipItemUseCase } from './EquipItem'

// Export des types
export type { PurchaseItemInput, PurchaseItemOutput } from './PurchaseItem'
export type { GetShopItemsFilter, ShopItemDTO } from './GetShopItems'
export type { InventoryItemDTO } from './GetPlayerInventory'
export type { EquipItemInput, EquipItemOutput } from './EquipItem'

// Export des erreurs métier
export {
  ItemNotFoundError,
  ItemNotAvailableError,
  InsufficientFundsError,
  ItemAlreadyOwnedError,
  WalletNotFoundError
} from './PurchaseItem'

export {
  InventoryItemNotFoundError
} from './EquipItem'
