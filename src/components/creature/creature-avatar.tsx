import { memo, useMemo } from 'react'
import { PixelMonster } from '@/components/monsters'
import type { MonsterState, MonsterTraits } from '@/shared/types/monster'

/**
 * Labels traduits pour chaque état émotionnel
 */
const STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

/**
 * Emojis représentant chaque état émotionnel
 */
const STATE_EMOJIS: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

/**
 * Props du composant CreatureAvatar
 */
interface CreatureAvatarProps {
  /** Traits visuels de la créature (format JSON string) */
  traitsJson: string
  /** État émotionnel actuel */
  state: MonsterState
}

/**
 * Avatar animé de la créature
 *
 * Responsabilités (SRP) :
 * - Affichage du PixelMonster avec les bons traits
 * - Parsing sécurisé du JSON des traits
 * - Badge d'état émotionnel
 *
 * Optimisation :
 * - Composant mémoïsé
 * - Parsing JSON mémoïsé avec useMemo
 *
 * @param {CreatureAvatarProps} props - Props du composant
 * @returns {React.ReactNode} Avatar de la créature
 *
 * @example
 * ```tsx
 * <CreatureAvatar traitsJson={creature.traits} state={creature.state} />
 * ```
 */
const CreatureAvatar = memo(function CreatureAvatar ({
  traitsJson,
  state
}: CreatureAvatarProps): React.ReactNode {
  /**
   * Parse les traits depuis JSON string
   * Mémoïsé pour éviter le re-parsing à chaque render
   */
  const traits = useMemo<MonsterTraits>(() => {
    try {
      return JSON.parse(traitsJson) as MonsterTraits
    } catch (error) {
      console.error('Failed to parse creature traits:', error)
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
  }, [traitsJson])

  return (
    <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50/30 p-12 md:p-16'>
      {/* Créature animée */}
      <div className='transform transition-transform hover:scale-105 duration-300'>
        <PixelMonster traits={traits} state={state} />
      </div>

      {/* Badge d'état émotionnel */}
      <div className='absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 shadow-lg ring-1 ring-white/70 backdrop-blur-sm'>
        <span aria-hidden='true' className='text-lg'>
          {STATE_EMOJIS[state]}
        </span>
        <span>{STATE_LABELS[state]}</span>
      </div>
    </div>
  )
})

export default CreatureAvatar
