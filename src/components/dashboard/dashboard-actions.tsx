import { memo } from 'react'
import Button from '../button'

/**
 * Props pour le composant DashboardActions
 */
interface DashboardActionsProps {
  /** Callback pour ouvrir le modal de création */
  onCreateMonster: () => void
  /** Callback pour déconnexion */
  onLogout: () => void
  /** Indique si une action est en cours (désactive les boutons) */
  isDisabled?: boolean
}

/**
 * Composant Actions du Dashboard
 * 
 * Responsabilités (SRP) :
 * - Affichage des actions principales (création et déconnexion)
 * - Gestion de l'état désactivé pendant les transitions
 * 
 * Optimisation (OCP) :
 * - Composant pur mémoïsé
 * - Callbacks stables passés en props
 * 
 * @param {DashboardActionsProps} props - Props du composant
 * @returns {React.ReactNode} Boutons d'action du dashboard
 * 
 * @example
 * ```tsx
 * <DashboardActions
 *   onCreateMonster={handleCreate}
 *   onLogout={handleLogout}
 *   isDisabled={isPending}
 * />
 * ```
 */
const DashboardActions = memo(function DashboardActions ({
  onCreateMonster,
  onLogout,
  isDisabled = false
}: DashboardActionsProps): React.ReactNode {
  return (
    <div className='flex flex-col sm:flex-row gap-4 items-center justify-center mb-8'>
      <Button
        disabled={isDisabled}
        onClick={onCreateMonster}
        variant='default'
        size='lg'
      >
        ✨ Créer une créature
      </Button>
      <Button
        onClick={onLogout}
        variant='outline'
        size='lg'
      >
        Se déconnecter
      </Button>
    </div>
  )
})

export default DashboardActions
