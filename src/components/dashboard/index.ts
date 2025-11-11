/**
 * Index des composants Dashboard
 *
 * Pattern Barrel Export :
 * - Centralise les exports des composants Dashboard
 * - Simplifie les imports dans le reste de l'application
 * - Facilite la maintenance et le refactoring
 *
 * @example
 * ```tsx
 * // Au lieu de :
 * import DashboardContent from '@/components/dashboard/dashboard-content'
 * import DashboardHeader from '@/components/dashboard/dashboard-header'
 * import DashboardActions from '@/components/dashboard/dashboard-actions'
 *
 * // Vous pouvez faire :
 * import { DashboardContent, DashboardHeader, DashboardActions } from '@/components/dashboard'
 * ```
 */

export { default as DashboardContent } from './dashboard-content'
export { default as DashboardHeader } from './dashboard-header'
export { default as DashboardActions } from './dashboard-actions'
export { default as CreateMonsterModal } from './create-monster-modal'
export type { CreateMonsterFormValues } from './create-monster-modal'
