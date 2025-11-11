'use client'

import { memo } from 'react'
import PixelCoin from './dashboard/pixel-coin'

/**
 * Props du composant CoinsDisplay
 */
interface CoinsDisplayProps {
  /** Nombre de pièces à afficher */
  coins: number
  /** Taille du composant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Composant d'affichage des pièces du joueur
 *
 * @param {CoinsDisplayProps} props - Props du composant
 * @returns {React.ReactNode} Affichage des pièces
 */
const CoinsDisplay = memo(function CoinsDisplay ({
  coins,
  size = 'md'
}: CoinsDisplayProps): React.ReactNode {
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3'
  }

  const iconSize = {
    sm: 20,
    md: 24,
    lg: 32
  }

  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold rounded-full shadow-lg border-2 border-yellow-600 ${sizeClasses[size]}`}>
      <PixelCoin size={iconSize[size]} />
      <span className='tabular-nums'>{coins.toLocaleString()}</span>
    </div>
  )
})

export default CoinsDisplay
