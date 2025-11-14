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
    <div className='flex flex-col gap-3 sm:gap-4 items-stretch sm:items-center justify-center mb-6 sm:mb-8 px-2'>
      <div className='flex flex-col items-center gap-2 w-full'>
        <Button
          disabled={isDisabled || !canAfford}
          onClick={onCreateMonster}
          variant='default'
          size='lg'
          className='flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4'
        >
          <span className='whitespace-nowrap'>✨ Créer une créature</span>
          {isFree
            ? (
              <span className='text-green-600 font-bold text-xs sm:text-sm'>(Gratuit)</span>
              )
            : (
              <span className='inline-flex items-center gap-1 text-xs sm:text-sm'>
                (<span>{nextMonsterPrice}</span>
                <span className='sm:hidden'><PixelCoin size={16} /></span>
                <span className='hidden sm:block'><PixelCoin size={20} /></span>)
              </span>
              )}
        </Button>
        {!canAfford && !isFree && (
          <p className='text-xs sm:text-sm text-red-500 flex items-center gap-1 text-center'>
            Vous avez besoin de {nextMonsterPrice - playerCoins}
            <span className='sm:hidden'><PixelCoin size={14} /></span>
            <span className='hidden sm:block'><PixelCoin size={16} /></span>
            supplémentaires
          </p>
        )}
      </div>
      <Button
        onClick={handleLogout}
        variant='ghost'
        size='lg'
        className='w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4'
      >
        Se déconnecter
      </Button>
    </div>
  )
})

export default DashboardActions
