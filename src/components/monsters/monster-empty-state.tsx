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
      className={`w-full rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 p-12 text-center shadow-xl ring-1 ring-white/10 backdrop-blur ${className}`}
    >
      <div className='mb-6 text-7xl' aria-hidden='true'>
        🥚
      </div>
      <h2 className='text-2xl font-bold text-white mb-3'>
        Pas encore de compagnon
      </h2>
      <p className='text-base text-slate-400 max-w-md mx-auto'>
        Clique sur « ✨ Créer un monstre » pour adopter ton premier Tamagotcho et commencer l'aventure.
      </p>
    </div>
  )
})

export default MonsterEmptyState
