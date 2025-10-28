import { memo } from 'react'
import Link from 'next/link'
import { PixelMonster } from '@/components/monsters'
import MonsterTraitsDisplay from './monster-traits-display'
import type { MonsterListItem, MonsterState } from '@/shared/types/monster'

/**
 * Labels traduits pour chaque état de monstre
 */
const STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

/**
 * Emojis représentant chaque état de monstre
 */
const STATE_EMOJIS: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

/**
 * Props du composant MonsterCard
 */
interface MonsterCardProps {
  /** Données du monstre à afficher */
  monster: MonsterListItem
}

/**
 * Carte d'affichage d'un monstre individuel
 *
 * Responsabilités (SRP) :
 * - Affichage complet d'un monstre (avatar, infos, traits)
 * - Présentation visuelle avec effets hover
 * - Badge d'état émotionnel et niveau
 * - Navigation vers la page de détails du monstre
 *
 * Composition (OCP) :
 * - Utilise PixelMonster pour le rendu visuel
 * - Utilise MonsterTraitsDisplay pour les traits
 * - Chaque sous-composant a sa propre responsabilité
 *
 * Optimisation :
 * - Composant mémoïsé avec React.memo
 * - Ne re-render que si le monstre change
 *
 * @param {MonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte du monstre
 *
 * @example
 * ```tsx
 * {monsters.map(monster => (
 *   <MonsterCard key={monster.id} monster={monster} />
 * ))}
 * ```
 */
const MonsterCard = memo(function MonsterCard ({
  monster
}: MonsterCardProps): React.ReactNode {
  const { id, name, level, traits, state } = monster

  return (
    <Link
      href={`/creature/${id}`}
      className='block'
    >
      <article
        className='group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-800 to-slate-900/90 p-4 shadow-xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:ring-2 hover:ring-moccaccino-500/50 backdrop-blur cursor-pointer'
      >
        {/* Effets de fond décoratifs */}
        <div
          className='pointer-events-none absolute -right-12 top-8 h-32 w-32 rounded-full bg-fuchsia-blue-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-moccaccino-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80'
          aria-hidden='true'
        />

        {/* Avatar du monstre avec badge d'état */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/50 p-3 ring-1 ring-white/10'>
          <div className='scale-90'>
            <PixelMonster traits={traits} state={state} />
          </div>

          {/* Badge d'état émotionnel */}
          <span className='absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 shadow-lg ring-1 ring-inset ring-white/20'>
            <span aria-hidden='true'>{STATE_EMOJIS[state]}</span>
            {STATE_LABELS[state]}
          </span>
        </div>

        {/* Informations et traits du monstre */}
        <div className='relative flex flex-1 flex-col gap-3'>
          {/* En-tête : Nom et niveau */}
          <div className='flex items-start justify-between gap-2'>
            <div className='space-y-0.5'>
              <h3 className='text-base font-bold text-white sm:text-lg'>
                {name}
              </h3>
              <p className='text-xs text-slate-400'>
                Niveau {level}
              </p>
            </div>

            {/* Badge de niveau */}
            <span className='inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-moccaccino-500/20 to-moccaccino-600/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-moccaccino-300 ring-1 ring-moccaccino-500/30'>
              <span aria-hidden='true'>⭐</span>
              {level}
            </span>
          </div>

          {/* Affichage des traits */}
          <MonsterTraitsDisplay traits={traits} />
        </div>
      </article>
    </Link>
  )
})

export default MonsterCard
