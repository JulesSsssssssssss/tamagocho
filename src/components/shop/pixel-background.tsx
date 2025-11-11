'use client'

import Image from 'next/image'
import { memo } from 'react'
import type { BackgroundType } from '@/shared/types/shop'

/**
 * Props du composant PixelBackground
 */
export interface PixelBackgroundProps {
  backgroundType: BackgroundType
  className?: string
}

/**
 * Mapping des types de fond vers les URLs des SVG
 */
const BACKGROUND_URLS: Record<BackgroundType, string> = {
  day: '/backgrounds/background-day.svg',
  garden: '/backgrounds/background-garden.svg',
  night: '/backgrounds/background-night.svg'
}

/**
 * Composant PixelBackground - Affichage des fonds d'écran pixel art
 *
 * Responsabilités (SRP):
 * - Afficher un fond d'écran pixel art
 * - Style rétro gaming cohérent avec PixelItem et PixelMonster
 *
 * Optimisation (Performance):
 * - Mémoïsé avec React.memo (composant purement présentationnel)
 * - Ne re-render que si backgroundType ou className changent
 */
export const PixelBackground = memo(function PixelBackground ({
  backgroundType,
  className = ''
}: PixelBackgroundProps): React.ReactNode {
  const imageUrl = BACKGROUND_URLS[backgroundType]

  // Vérification de sécurité : ne pas rendre si l'URL est invalide
  if (!imageUrl || imageUrl === '') {
    console.error('PixelBackground: Invalid backgroundType or empty URL', backgroundType)
    return null
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <Image
        src={imageUrl}
        alt={`Fond ${backgroundType}`}
        width={480}
        height={720}
        className='w-full h-full object-cover'
        style={{ imageRendering: 'pixelated' }}
        unoptimized
      />
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.backgroundType === nextProps.backgroundType &&
  prevProps.className === nextProps.className
)

export default PixelBackground
