'use client'

import { memo, useMemo, useState, useEffect } from 'react'
import { PixelMonster } from '@/components/monsters'
import { PixelBackground } from '@/components/shop'
import type { MonsterState, MonsterTraits } from '@/shared/types/monster'
import type { BackgroundType } from '@/shared/types/shop'

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
  /** Items équipés (optionnel) */
  equippedItems?: {
    hat?: string | null
    glasses?: string | null
    shoes?: string | null
  }
  /** ID de la créature (pour charger le fond d'écran) */
  creatureId?: string
  /** Clé de rafraîchissement pour forcer le rechargement du fond */
  refreshKey?: number
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
  state,
  equippedItems,
  creatureId,
  refreshKey
}: CreatureAvatarProps): React.ReactNode {
  const [equippedBackground, setEquippedBackground] = useState<BackgroundType | null>(null)

  /**
   * Charger le fond d'écran équipé depuis l'inventaire
   */
  useEffect(() => {
    if (creatureId == null) return

    const fetchBackground = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/inventory/${creatureId}`)
        const data = await response.json()

        if (data.success) {
          // Trouver le fond d'écran équipé
          const bgItem = data.data.find((item: any) =>
            item.category === 'background' && item.isEquipped === true
          )

          if (bgItem?.backgroundType != null) {
            setEquippedBackground(bgItem.backgroundType)
          } else {
            setEquippedBackground(null)
          }
        }
      } catch (error) {
        console.error('Error fetching background:', error)
      }
    }

    void fetchBackground()
  }, [creatureId, refreshKey])
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
      {/* Fond d'écran pixel art (si équipé) */}
      {equippedBackground != null && (
        <div className='absolute inset-0 z-0 opacity-60'>
          <PixelBackground backgroundType={equippedBackground} className='w-full h-full' />
        </div>
      )}

      {/* Créature animée */}
      <div className='relative z-10 transform transition-transform hover:scale-105 duration-300'>
        <PixelMonster traits={traits} state={state} equippedItems={equippedItems} />
      </div>

      {/* Badge d'état émotionnel */}
      <div className='absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 shadow-lg ring-1 ring-white/70 backdrop-blur-sm'>
        <span aria-hidden='true' className='text-lg'>
          {STATE_EMOJIS[state]}
        </span>
        <span>{STATE_LABELS[state]}</span>
      </div>
    </div>
  )
})

export default CreatureAvatar
