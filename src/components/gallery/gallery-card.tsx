/**
 * GalleryCard - Carte d'affichage d'un monstre public
 *
 * Responsabilités (SRP):
 * - Afficher les informations d'un monstre public (nom, niveau, état, créateur, date)
 * - Afficher l'aperçu visuel du monstre avec PixelMonster
 * - Design pixel-art cohérent avec l'application
 * - Read-only (pas d'interactions)
 *
 * Props: PublicMonster (id, name, level, state, traits, creatorName, createdAt)
 * État: Aucun (composant stateless)
 * Performance: React.memo pour éviter les re-renders inutiles
 */

import { memo, useMemo } from 'react'
import { PixelMonster } from '@/components/monsters'
import type { PublicMonster } from '@/shared/types/gallery'
import type { MonsterState, MonsterTraits } from '@/shared/types/monster'

interface GalleryCardProps {
  monster: PublicMonster
}

/**
 * Mapping des états émotionnels vers des emojis
 */
const EMOTIONAL_STATE_EMOJI: Record<MonsterState, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  hungry: '🍽️',
  sleepy: '😴'
}

/**
 * Formater une date relative (ex: "Il y a 2 jours")
 */
function formatRelativeDate (date: string): string {
  const now = new Date()
  const createdDate = new Date(date)
  const diffMs = now.getTime() - createdDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}

/**
 * Badge de niveau avec style pixel-art
 */
const LevelBadge = memo(function LevelBadge ({ level }: { level: number }): React.ReactNode {
  return (
    <div className='px-3 py-1 bg-gradient-to-r from-fuchsia-blue-600 to-fuchsia-blue-500 text-white text-xs font-bold rounded-md shadow-[0_0_10px_rgba(143,114,224,0.5)] border-2 border-fuchsia-blue-400 font-mono tracking-wider' style={{ imageRendering: 'pixelated' }}>
      LVL {level}
    </div>
  )
})

/**
 * Badge d'état émotionnel avec emoji
 */
const StateBadge = memo(function StateBadge ({ state }: { state: string }): React.ReactNode {
  const emoji = EMOTIONAL_STATE_EMOJI[state as keyof typeof EMOTIONAL_STATE_EMOJI] ?? '😐'

  return (
    <div className='px-3 py-1 bg-gradient-to-r from-lochinvar-600 to-lochinvar-500 text-white text-xs font-bold rounded-md shadow-[0_0_10px_rgba(70,144,134,0.5)] border-2 border-lochinvar-400 flex items-center gap-1 font-mono tracking-wider uppercase' style={{ imageRendering: 'pixelated' }}>
      <span>{emoji}</span>
      <span>{state}</span>
    </div>
  )
})

/**
 * Composant GalleryCard - Optimisé avec React.memo
 */
export const GalleryCard = memo(function GalleryCard ({ monster }: GalleryCardProps): React.ReactNode {
  const createdAtDate = typeof monster.createdAt === 'string'
    ? new Date(monster.createdAt)
    : monster.createdAt
  const relativeDate = formatRelativeDate(createdAtDate.toISOString())

  /**
   * Parse les traits depuis JSON string avec fallback
   */
  const traits = useMemo<MonsterTraits>(() => {
    try {
      return JSON.parse(monster.traits) as MonsterTraits
    } catch (error) {
      console.error('Failed to parse monster traits:', error)
      // Fallback vers des traits par défaut
      return {
        bodyColor: '#FFB5E8',
        accentColor: '#FF9CEE',
        eyeColor: '#2C2C2C',
        antennaColor: '#FFE66D',
        bobbleColor: '#FFE66D',
        cheekColor: '#FFB5D5',
        bodyStyle: 'round',
        eyeStyle: 'big',
        antennaStyle: 'single',
        accessory: 'none'
      }
    }
  }, [monster.traits])

  return (
    <div className='group relative p-4 bg-slate-900/90 backdrop-blur-sm rounded-xl border-4 border-slate-700/50 hover:border-yellow-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:-translate-y-1'>
      {/* Grille pixel art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 rounded-xl pointer-events-none' />
      {/* Effet de lueur au survol */}
      <div className='absolute inset-0 bg-gradient-to-t from-yellow-500/0 group-hover:from-yellow-500/10 via-transparent to-transparent transition-all duration-300 rounded-xl pointer-events-none' />

      {/* Pixels dans les coins (visibles au survol) */}
      <div className='absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-1 right-1 w-2 h-2 bg-yellow-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ imageRendering: 'pixelated' }} />

      {/* Contenu */}
      <div className='relative z-10 space-y-3'>
        {/* Header: Nom */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold text-yellow-400 truncate font-mono tracking-wider' style={{ textShadow: '0 0 15px rgba(234, 179, 8, 0.8)' }}>
            {monster.name.toUpperCase()}
          </h3>
          <span className='text-2xl'>🐾</span>
        </div>

        {/* Aperçu visuel du monstre avec canvas pixel art */}
        <div className='relative flex items-center justify-center bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700/50 group-hover:border-yellow-500/30 transition-all duration-300'>
          {/* Grille de fond pour le canvas */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:0.5rem_0.5rem] rounded-xl opacity-60' />

          {/* Monstre pixel art avec items équipés */}
          <div className='relative z-10 transform scale-75 hover:scale-90 transition-transform duration-300'>
            <PixelMonster
              traits={traits}
              state={monster.state}
              equippedItems={monster.equippedItems}
            />
          </div>
        </div>        {/* Badges: Niveau + État */}
        <div className='flex items-center gap-2 flex-wrap'>
          <LevelBadge level={monster.level} />
          <StateBadge state={monster.state} />
        </div>

        {/* Aperçu textuel des traits */}
        <div className='flex flex-wrap gap-1'>
          <span className='px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md border border-slate-600 font-mono uppercase tracking-wide' style={{ imageRendering: 'pixelated' }}>
            {traits.bodyStyle ?? 'round'}
          </span>
          <span className='px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md border border-slate-600 font-mono uppercase tracking-wide' style={{ imageRendering: 'pixelated' }}>
            {traits.eyeStyle ?? 'big'}
          </span>
          <span className='px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md border border-slate-600 font-mono uppercase tracking-wide' style={{ imageRendering: 'pixelated' }}>
            {traits.antennaStyle ?? 'single'}
          </span>
        </div>

        {/* Footer: Créateur + Date */}
        <div className='pt-3 border-t-2 border-slate-600/50 flex items-center justify-between text-xs text-gray-400 font-mono'>
          <div className='flex items-center gap-1'>
            <span>👤</span>
            <span className='font-medium truncate max-w-[120px]'>{monster.creatorName}</span>
          </div>
          <div className='flex items-center gap-1'>
            <span>📅</span>
            <span>{relativeDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
})
