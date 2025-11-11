import { memo } from 'react'
import Button from '../button'
import { calculateMonsterPrice } from '@/shared/types/coins'
import PixelCoin from './pixel-coin'

/**
 * Props pour le composant DashboardActions
 */
interface DashboardActionsProps {
  /** Callback pour ouvrir le modal de création */
  onCreateMonster: () => void
  /** Callback pour déconnexion */
  onLogout: () => Promise<void>
  /** Indique si une action est en cours (désactive les boutons) */
  isDisabled?: boolean
  /** Nombre total de monstres créés par le joueur */
  totalMonstersCreated: number
  /** Nombre de pièces du joueur */
  playerCoins: number
}

/**
 * Composant Actions du Dashboard
 *
 * Responsabilités (SRP) :
 * - Affichage des actions principales (création et déconnexion)
 * - Affichage du prix du prochain monstre
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
 *   totalMonstersCreated={3}
 *   playerCoins={150}
 * />
 * ```
 */
const DashboardActions = memo(function DashboardActions ({
  onCreateMonster,
  onLogout,
  isDisabled = false,
  totalMonstersCreated,
  playerCoins
}: DashboardActionsProps): React.ReactNode {
  const nextMonsterPrice = calculateMonsterPrice(totalMonstersCreated)
  const canAfford = playerCoins >= nextMonsterPrice
  const isFree = nextMonsterPrice === 0

  /**
   * Wrapper pour gérer l'appel asynchrone de déconnexion
   */
  const handleLogout = (): void => {
    void onLogout()
  }

  return (
    <div className='flex flex-col sm:flex-row gap-4 items-center justify-center mb-8'>
      <div className='flex flex-col items-center gap-2'>
        <Button
          disabled={isDisabled || !canAfford}
          onClick={onCreateMonster}
          variant='default'
          size='lg'
          className='flex items-center gap-2'
        >
          <span>✨ Créer une créature</span>
          {isFree
            ? (
              <span className='text-green-600 font-bold'>(Gratuit)</span>
              )
            : (
              <span className='inline-flex items-center gap-1'>
                (<span>{nextMonsterPrice}</span>
                <PixelCoin size={20} />)
              </span>
              )}
        </Button>
        {!canAfford && !isFree && (
          <p className='text-sm text-red-500 flex items-center gap-1'>
            Vous avez besoin de {nextMonsterPrice - playerCoins}
            <PixelCoin size={16} />
            supplémentaires
          </p>
        )}
      </div>
      <Button
        onClick={handleLogout}
        variant='ghost'
        size='lg'
      >
        Se déconnecter
      </Button>
    </div>
  )
})

export default DashboardActions
