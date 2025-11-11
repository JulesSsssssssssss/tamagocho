'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
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
 * Couleurs de fond pour chaque état
 */
const STATE_COLORS: Record<MonsterState, string> = {
  happy: 'from-green-600/80 via-green-500/80 to-emerald-600/80',
  sad: 'from-blue-600/80 via-indigo-500/80 to-blue-700/80',
  angry: 'from-red-600/80 via-orange-500/80 to-red-700/80',
  hungry: 'from-amber-600/80 via-yellow-500/80 to-orange-600/80',
  sleepy: 'from-purple-600/80 via-indigo-500/80 to-purple-700/80'
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
  const router = useRouter()

  const handleClick = (): void => {
    router.push(`/creature/${id}`)
  }

  return (
    <article
      onClick={handleClick}
      className='block cursor-pointer'
    >
      <div
        className='group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900/95 shadow-2xl ring-4 ring-slate-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] hover:ring-moccaccino-500/50 cursor-pointer'
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Grille pixel art en arrière-plan */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />

        {/* Bordure supérieure dégradée selon l'état */}
        <div className={`h-2 bg-gradient-to-r ${STATE_COLORS[state]}`} />

        {/* Particules décoratives */}
        <div className='absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-sm animate-pulse pointer-events-none' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-8 right-8 w-1 h-1 bg-white/15 rounded-sm animate-pulse pointer-events-none' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />

        {/* Container principal */}
        <div className='relative p-4 space-y-4'>
          {/* Header avec nom et niveau */}
          <div className='flex items-start justify-between gap-3'>
            <div className='flex-1'>
              <h3
                className='text-xl font-black text-white mb-1 tracking-tight'
                style={{
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                {name}
              </h3>
              <div className='flex items-center gap-2'>
                <div className='h-1 w-8 bg-gradient-to-r from-moccaccino-500 to-lochinvar-500 rounded-full' style={{ imageRendering: 'pixelated' }} />
                <span className='text-xs text-slate-400 font-bold uppercase' style={{ fontFamily: 'monospace' }}>
                  Niv. {level}
                </span>
              </div>
            </div>

            {/* Badge de niveau style arcade */}
            <div className='bg-slate-950/80 backdrop-blur-sm rounded-lg px-3 py-2 border-2 border-moccaccino-500/30 shadow-lg'>
              <div className='flex flex-col items-center'>
                <span className='text-xs text-moccaccino-400 font-bold uppercase' style={{ fontFamily: 'monospace' }}>
                  LVL
                </span>
                <span className='text-2xl font-black text-moccaccino-300' style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>
                  {level}
                </span>
              </div>
            </div>
          </div>

          {/* Avatar du monstre avec cadre pixel */}
          <div className='relative'>
            <div className='bg-slate-950/60 backdrop-blur-sm rounded-xl p-6 border-4 border-slate-700/50 shadow-inner'>
              {/* Effet de lueur */}
              <div className='absolute inset-0 bg-gradient-to-t from-fuchsia-blue-500/10 via-transparent to-transparent rounded-xl pointer-events-none' />

              <div className='relative flex items-center justify-center'>
                <PixelMonster traits={traits} state={state} />
              </div>

              {/* Badge d'état émotionnel style retro */}
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <div className='bg-slate-950/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border-2 border-slate-600 shadow-xl flex items-center gap-2'>
                  <span className='text-lg'>{STATE_EMOJIS[state]}</span>
                  <span className='text-xs font-bold text-white uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
                    {STATE_LABELS[state]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Traits du monstre */}
          <div className='bg-slate-950/40 backdrop-blur-sm rounded-lg p-3 border-2 border-slate-700/30'>
            <MonsterTraitsDisplay traits={traits} />
          </div>

          {/* Footer avec bouton d'action */}
          <div className='pt-2'>
            <div className='bg-gradient-to-r from-moccaccino-600 via-moccaccino-500 to-lochinvar-600 rounded-lg p-3 shadow-lg border-2 border-moccaccino-400/30 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl'>
              <div className='flex items-center justify-center gap-2'>
                <span className='text-white font-bold text-sm uppercase tracking-wide' style={{ fontFamily: 'monospace', textShadow: '1px 1px 0px rgba(0,0,0,0.3)' }}>
                  Voir Détails
                </span>
                <span className='text-white text-lg'>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})

export default MonsterCard
