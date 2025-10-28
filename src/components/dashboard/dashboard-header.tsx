import { memo } from 'react'
import CoinsDisplay from '../coins-display'

/**
 * Props pour le composant DashboardHeader
 */
interface DashboardHeaderProps {
  /** Email de l'utilisateur connecté */
  userEmail: string
  /** Nombre de pièces du joueur */
  coins: number
}

/**
 * Composant Header du Dashboard
 *
 * Responsabilités (SRP) :
 * - Affichage du message de bienvenue personnalisé
 * - Présentation de l'identité de l'utilisateur
 *
 * Optimisation (OCP) :
 * - Composant pur mémoïsé avec React.memo
 * - Ne se re-render que si userEmail change
 *
 * @param {DashboardHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête du dashboard
 *
 * @example
 * ```tsx
 * <DashboardHeader userEmail="user@example.com" coins={100} />
 * ```
 */
const DashboardHeader = memo(function DashboardHeader ({
  userEmail,
  coins
}: DashboardHeaderProps): React.ReactNode {
  return (
    <header className='text-center mb-8 relative'>
      {/* Affichage des pièces en haut à droite */}
      <div className='absolute top-0 right-0'>
        <CoinsDisplay coins={coins} size='lg' />
      </div>

      <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-moccaccino-600 to-lochinvar-600 bg-clip-text text-transparent'>
        Bienvenue {userEmail}
      </h1>
      <p className='text-lg text-slate-600'>
        Gérez vos créatures et suivez votre progression
      </p>
    </header>
  )
})

export default DashboardHeader
