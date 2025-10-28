import { memo } from 'react'
import MonsterCard from './monster-card'
import MonsterEmptyState from './monster-empty-state'
import type { MonsterListItem } from '@/shared/types/monster'

/**
 * Props du composant MonstersList
 */
export interface MonstersListProps {
  /** Liste des monstres à afficher */
  monsters: MonsterListItem[]
  /** Classe CSS additionnelle optionnelle */
  className?: string
}

/**
 * Composant de liste de monstres
 * 
 * Responsabilités (SRP) :
 * - Affichage de la grille de monstres
 * - Gestion de l'état vide (délégué à MonsterEmptyState)
 * - Présentation de l'en-tête de section
 * 
 * Composition (OCP) :
 * - Utilise MonsterCard pour chaque monstre
 * - Utilise MonsterEmptyState quand la liste est vide
 * - Extensible sans modification (ajout de filtres, tri, etc.)
 * 
 * Optimisation :
 * - Composant mémoïsé avec React.memo
 * - Chaque MonsterCard est mémoïsée individuellement
 * 
 * @param {MonstersListProps} props - Props du composant
 * @returns {React.ReactNode} Liste de monstres ou état vide
 * 
 * @example
 * ```tsx
 * const monsters = await getMonsters()
 * return <MonstersList monsters={monsters} />
 * ```
 */
export const MonstersList = memo(function MonstersList ({
  monsters,
  className = ''
}: MonstersListProps): React.ReactNode {
  // Affichage de l'état vide si aucun monstre
  if (!Array.isArray(monsters) || monsters.length === 0) {
    return <MonsterEmptyState className={className} />
  }

  return (
    <section className={`mt-12 w-full space-y-8 ${className}`}>
      {/* En-tête de la section */}
      <header className='space-y-2 text-center sm:text-left'>
        <h2 className='text-2xl font-bold text-slate-900'>
          Ta ménagerie numérique
        </h2>
        <p className='text-sm text-slate-600'>
          Chaque compagnon est généré à partir de traits uniques. Chouchoute-les pour découvrir toutes leurs humeurs.
        </p>
      </header>

      {/* Grille de cartes de monstres */}
      <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {monsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
          />
        ))}
      </div>
    </section>
  )
})

export default MonstersList

