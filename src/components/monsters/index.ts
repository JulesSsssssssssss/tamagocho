/**
 * Index des composants Monsters
 *
 * Pattern Barrel Export :
 * - Centralise les exports des composants liés aux monstres
 * - Simplifie les imports dans le reste de l'application
 * - Facilite la maintenance et le refactoring
 *
 * @example
 * ```tsx
 * import { MonstersList, MonsterCard, PixelMonster } from '@/components/monsters'
 * ```
 */

export { MonstersList, type MonstersListProps } from './monsters-list'
export { default as MonsterCard } from './monster-card'
export { default as MonsterEmptyState } from './monster-empty-state'
export { default as MonsterTraitsDisplay } from './monster-traits-display'
export { default as PixelMonster } from './pixel-monster'
export type { PixelMonsterProps } from './pixel-monster'
export { MonstersAutoUpdater } from './auto-updater'
