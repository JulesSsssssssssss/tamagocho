/**
 * Barrel export pour les use cases de la boutique
 */

export { GetShopItemsUseCase } from './GetShopItems'
export { GetPlayerInventoryUseCase } from './GetPlayerInventory'
export { EquipItemUseCase, UnequipItemUseCase } from './EquipItem'
export { RemoveItemFromInventoryUseCase } from './RemoveItem'
export { GetAllOwnerItemsUseCase } from './GetAllOwnerItems'
export { EquipBackgroundUseCase } from './EquipBackground'
export { RemoveBackgroundUseCase } from './RemoveBackground'

// Export des types
export type { GetShopItemsFilter, ShopItemDTO } from './GetShopItems'
export type { InventoryItemDTO } from './GetPlayerInventory'
export type { EquipItemInput, EquipItemOutput } from './EquipItem'
export type { RemoveItemInput, RemoveItemOutput } from './RemoveItem'
export type { EquipBackgroundInput, EquipBackgroundOutput } from './EquipBackground'
export type { RemoveBackgroundInput, RemoveBackgroundOutput } from './RemoveBackground'

// Export des erreurs métier
export {
  InventoryItemNotFoundError
} from './EquipItem'

export {
  ItemNotFoundInInventoryError,
  ItemBelongsToAnotherMonsterError
} from './RemoveItem'

export {
  BackgroundNotFoundError,
  NotABackgroundError
} from './EquipBackground'
