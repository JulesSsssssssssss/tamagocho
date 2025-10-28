'use client'

import { memo } from 'react'

/**
 * Props du composant CreatureStats
 */
interface CreatureStatsProps {
  /** Niveau de faim (0-100) */
  hunger: number
  /** Niveau d'énergie (0-100) */
  energy: number
  /** Niveau de bonheur (0-100) */
  happiness: number
}

/**
 * Composant d'affichage des statistiques d'un monstre
 * 
 * Responsabilités (SRP) :
 * - Affichage des 3 barres de progression (hunger, energy, happiness)
 * - Calcul des couleurs en fonction des valeurs
 * - Animations de progression
 * 
 * Optimisation :
 * - Composant mémoïsé avec React.memo
 * - Ne re-render que si les stats changent
 * 
 * @param {CreatureStatsProps} props - Props du composant
 * @returns {React.ReactNode} Barres de statistiques
 * 
 * @example
 * ```tsx
 * <CreatureStats hunger={75} energy={50} happiness={90} />
 * ```
 */
const CreatureStats = memo(function CreatureStats ({
  hunger,
  energy,
  happiness
}: CreatureStatsProps): React.ReactNode {
  /**
   * Retourne la couleur de la barre en fonction de la valeur
   */
  const getColorClass = (value: number): string => {
    if (value >= 70) return 'bg-lochinvar-500'
    if (value >= 40) return 'bg-fuchsia-blue-400'
    return 'bg-moccaccino-500'
  }

  /**
   * Retourne l'emoji approprié pour chaque stat
   */
  const getEmoji = (stat: 'hunger' | 'energy' | 'happiness'): string => {
    switch (stat) {
      case 'hunger': return hunger >= 70 ? '🍖' : hunger >= 40 ? '🥗' : '😋'
      case 'energy': return energy >= 70 ? '⚡' : energy >= 40 ? '💫' : '😴'
      case 'happiness': return happiness >= 70 ? '😄' : happiness >= 40 ? '😊' : '😢'
    }
  }

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg ring-1 ring-white/80 space-y-5'>
      <h3 className='text-lg font-semibold text-slate-900 mb-4'>
        📊 Statistiques
      </h3>

      {/* Faim */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium text-slate-700 flex items-center gap-2'>
            <span aria-hidden='true'>{getEmoji('hunger')}</span>
            Faim
          </span>
          <span className='text-slate-600 font-semibold'>{hunger}%</span>
        </div>
        <div className='h-3 bg-slate-100 rounded-full overflow-hidden ring-1 ring-inset ring-slate-200/50'>
          <div
            className={`h-full ${getColorClass(hunger)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${hunger}%` }}
            role='progressbar'
            aria-valuenow={hunger}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Niveau de faim'
          />
        </div>
      </div>

      {/* Énergie */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium text-slate-700 flex items-center gap-2'>
            <span aria-hidden='true'>{getEmoji('energy')}</span>
            Énergie
          </span>
          <span className='text-slate-600 font-semibold'>{energy}%</span>
        </div>
        <div className='h-3 bg-slate-100 rounded-full overflow-hidden ring-1 ring-inset ring-slate-200/50'>
          <div
            className={`h-full ${getColorClass(energy)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${energy}%` }}
            role='progressbar'
            aria-valuenow={energy}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Niveau d'énergie"
          />
        </div>
      </div>

      {/* Bonheur */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium text-slate-700 flex items-center gap-2'>
            <span aria-hidden='true'>{getEmoji('happiness')}</span>
            Bonheur
          </span>
          <span className='text-slate-600 font-semibold'>{happiness}%</span>
        </div>
        <div className='h-3 bg-slate-100 rounded-full overflow-hidden ring-1 ring-inset ring-slate-200/50'>
          <div
            className={`h-full ${getColorClass(happiness)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${happiness}%` }}
            role='progressbar'
            aria-valuenow={happiness}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Niveau de bonheur'
          />
        </div>
      </div>
    </div>
  )
})

export default CreatureStats
