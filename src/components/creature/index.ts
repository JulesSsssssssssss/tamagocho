/**
 * Index des composants Creature
 *
 * Pattern Barrel Export :
 * - Centralise les exports des composants liés aux créatures
 * - Simplifie les imports dans le reste de l'application
 * - Facilite la maintenance et le refactoring
 *
 * @example
 * ```tsx
 * import {
 *   CreatureContent,
 *   CreatureDetail,
 *   CreatureLoadingState,
 *   CreatureStats,
 *   CreatureActions
 * } from '@/components/creature'
 * ```
 */

export { default as CreatureContent } from './creature-content'
export { default as CreatureDetail } from './creature-detail'
export { default as CreatureHeader } from './creature-header'
export { default as CreatureAvatar } from './creature-avatar'
export { default as CreatureInfo } from './creature-info'
export { default as CreatureStats } from './creature-stats'
export { default as CreatureActions } from './creature-actions'
export { default as CreatureLoadingState } from './creature-loading-state'
export { default as CreatureErrorState } from './creature-error-state'
export { default as CreatureNotFoundState } from './creature-not-found-state'
export { default as CreatureEquippedItems } from './creature-equipped-items'
export { default as CreatureInventoryManager } from './creature-inventory-manager'
