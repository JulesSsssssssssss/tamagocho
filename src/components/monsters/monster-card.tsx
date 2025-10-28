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
        className='group relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-white to-lochinvar-50/70 p-6 shadow-[0_20px_54px_rgba(15,23,42,0.14)] ring-1 ring-white/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.18)] hover:ring-2 hover:ring-moccaccino-200 backdrop-blur cursor-pointer'
      >
      {/* Effets de fond décoratifs */}
      <div
        className='pointer-events-none absolute -right-20 top-16 h-48 w-48 rounded-full bg-fuchsia-blue-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-80'
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute -left-24 -bottom-20 h-44 w-44 rounded-full bg-moccaccino-100/40 blur-3xl transition-opacity duration-500 group-hover:opacity-80'
        aria-hidden='true'
      />

      {/* Avatar du monstre avec badge d'état */}
      <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/70 p-4 ring-1 ring-white/70'>
        <PixelMonster traits={traits} state={state} />
        
        {/* Badge d'état émotionnel */}
        <span className='absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-inner ring-1 ring-inset ring-white/70'>
          <span aria-hidden='true'>{STATE_EMOJIS[state]}</span>
          {STATE_LABELS[state]}
        </span>
      </div>

      {/* Informations et traits du monstre */}
      <div className='relative flex flex-1 flex-col gap-4'>
        {/* En-tête : Nom et niveau */}
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold text-slate-900 sm:text-xl'>
              {name}
            </h3>
            <p className='text-xs text-slate-500'>
              Niveau {level}
            </p>
          </div>
          
          {/* Badge de niveau */}
          <span className='inline-flex items-center gap-1 rounded-full bg-moccaccino-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-moccaccino-600 shadow-inner'>
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
