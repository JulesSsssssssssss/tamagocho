'use client'

import { memo } from 'react'

/**
 * Props du composant CreatureXpBar
 */
interface CreatureXpBarProps {
  /** Niveau actuel du monstre */
  level: number
  /** XP actuel du monstre */
  xp: number
  /** XP requis pour le prochain niveau */
  xpToNextLevel: number
}

/**
 * Composant de barre de progression d'XP
 *
 * Responsabilités (SRP) :
 * - Afficher le niveau actuel
 * - Afficher une barre de progression visuelle de l'XP
 * - Afficher les valeurs numériques (XP actuel / XP requis)
 *
 * Architecture (OCP) :
 * - Styles personnalisables via Tailwind
 * - Calcul de progression réactif
 *
 * @param {CreatureXpBarProps} props - Props du composant
 * @returns {React.ReactNode} Barre de progression d'XP
 *
 * @example
 * ```tsx
 * <CreatureXpBar level={3} xp={150} xpToNextLevel={300} />
 * // Affiche: "Niveau 3" avec une barre à 50%
 * ```
 */
const CreatureXpBar = memo(function CreatureXpBar ({
  level,
  xp,
  xpToNextLevel
}: CreatureXpBarProps): React.ReactNode {
  // Calcul du pourcentage de progression
  const progressPercentage = Math.min((xp / xpToNextLevel) * 100, 100)

  return (
    <div className='p-4 md:p-6'>
      {/* Titre avec niveau */}
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-base md:text-lg font-bold text-slate-900 flex items-center gap-2'>
          <span className='text-xl md:text-2xl'>⭐</span>
          Niveau {level}
        </h3>
        <span className='text-xs md:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300'>
          {xp} / {xpToNextLevel} XP
        </span>
      </div>

      {/* Barre de progression */}
      <div className='w-full bg-slate-200 rounded-full h-5 md:h-6 overflow-hidden border border-slate-300 shadow-inner'>
        <div
          className='h-full bg-gradient-to-r from-fuchsia-blue-500 via-lochinvar-500 to-moccaccino-500 transition-all duration-500 ease-out relative shadow-lg'
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Effet de brillance animé */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse' />

          {/* Ligne de surbrillance */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-white/30' />
        </div>
      </div>

      {/* Message de motivation */}
      <p className='mt-3 text-xs text-center font-medium'>
        {progressPercentage === 100
          ? <span className='text-moccaccino-600'>🎉 Prêt à monter de niveau !</span>
          : <span className='text-slate-600'>Encore {xpToNextLevel - xp} XP pour le niveau {level + 1}</span>}
      </p>
    </div>
  )
})

export default CreatureXpBar
