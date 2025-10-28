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
    <section className={`w-full space-y-6 ${className}`}>
      {/* En-tête de la section style pixel art */}
      <header className='relative'>
        <div className='bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 rounded-2xl p-6 border-4 border-slate-700 shadow-2xl overflow-hidden'>
          {/* Grille pixel art en arrière-plan */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />

          {/* Particules décoratives */}
          <div className='absolute top-4 right-8 w-3 h-3 bg-moccaccino-400/30 rounded-sm animate-pulse pointer-events-none' style={{ imageRendering: 'pixelated' }} />
          <div className='absolute bottom-6 right-16 w-2 h-2 bg-lochinvar-400/30 rounded-sm animate-pulse pointer-events-none' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />

          <div className='relative space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='w-2 h-8 bg-gradient-to-b from-moccaccino-500 to-lochinvar-500 rounded-full' style={{ imageRendering: 'pixelated' }} />
              <h2
                className='text-3xl md:text-4xl font-black text-white tracking-tight'
                style={{
                  textShadow: '3px 3px 0px rgba(0,0,0,0.4)',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                Ta ménagerie numérique
              </h2>
            </div>

            <p className='text-sm md:text-base text-slate-300 ml-5 font-medium'>
              🎮 Chaque compagnon est généré avec des traits uniques. Prends-en soin pour découvrir toutes leurs humeurs !
            </p>

            {/* Stats visuelles */}
            <div className='flex items-center gap-4 ml-5 pt-2'>
              <div className='bg-slate-950/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border-2 border-moccaccino-500/30 flex items-center gap-2'>
                <span className='text-moccaccino-400 text-lg'>👾</span>
                <span className='text-xs font-bold text-white uppercase' style={{ fontFamily: 'monospace' }}>
                  {monsters.length} Créature{monsters.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grille de cartes de monstres - 3 colonnes sur grands écrans */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
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
