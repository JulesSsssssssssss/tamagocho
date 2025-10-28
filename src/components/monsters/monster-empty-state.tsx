import { memo } from 'react'

/**
 * Props du composant MonsterEmptyState
 */
interface MonsterEmptyStateProps {
  /** Classe CSS additionnelle optionnelle */
  className?: string
}

/**
 * Composant d'état vide pour la liste de monstres
 * 
 * Responsabilités (SRP) :
 * - Affichage du message lorsqu'aucun monstre n'existe
 * - Incitation à créer le premier monstre
 * 
 * Optimisation (OCP) :
 * - Composant pur mémoïsé avec React.memo
 * - Pas de props dynamiques, stable
 * 
 * @param {MonsterEmptyStateProps} props - Props du composant
 * @returns {React.ReactNode} État vide
 * 
 * @example
 * ```tsx
 * {monsters.length === 0 && <MonsterEmptyState />}
 * ```
 */
const MonsterEmptyState = memo(function MonsterEmptyState ({
  className = ''
}: MonsterEmptyStateProps): React.ReactNode {
  return (
    <div
      className={`mt-10 w-full max-w-2xl rounded-3xl bg-gradient-to-br from-white via-lochinvar-50 to-fuchsia-blue-50 p-8 text-center shadow-lg ring-1 ring-white/80 ${className}`}
    >
      <div className='mb-4 text-6xl' aria-hidden='true'>
        🥚
      </div>
      <h2 className='text-xl font-semibold text-slate-900 mb-2'>
        Pas encore de compagnon
      </h2>
      <p className='text-sm text-slate-600'>
        Clique sur « Créer une créature » pour adopter ton premier Tamagotcho.
      </p>
    </div>
  )
})

export default MonsterEmptyState
