'use client'

import { useEffect, useRef, memo } from 'react'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'

/**
 * Props du composant PixelItem
 */
export interface PixelItemProps {
  category: ItemCategory
  rarity: ItemRarity
  animated?: boolean
}

/**
 * Composant PixelItem - Affichage pixel art des items
 *
 * Responsabilités (SRP):
 * - Dessiner les items en pixel art (chapeau, lunettes, chaussures)
 * - Animer les items selon leur rareté
 * - Style rétro gaming cohérent avec PixelMonster
 *
 * Optimisation (Performance):
 * - Mémoïsé avec React.memo (composant purement présentationnel)
 * - Ne re-render que si category, rarity ou animated changent
 */
export const PixelItem = memo(function PixelItem ({
  category,
  rarity,
  animated = true
}: PixelItemProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    canvas.width = 120
    canvas.height = 120

    let animationId: number | undefined

    const animate = (): void => {
      if (animated) {
        frameRef.current += 1
      }
      drawItem(ctx, category, rarity, frameRef.current)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [category, rarity, animated])

  return (
    <canvas
      ref={canvasRef}
      className='mx-auto h-full w-full'
      style={{ imageRendering: 'pixelated' }}
    />
  )
}, (prevProps, nextProps) =>
  prevProps.category === nextProps.category &&
  prevProps.rarity === nextProps.rarity &&
  prevProps.animated === nextProps.animated
)

export default PixelItem

/**
 * Dessine l'item sur le canvas
 */
function drawItem (
  ctx: CanvasRenderingContext2D,
  category: ItemCategory,
  rarity: ItemRarity,
  frame: number
): void {
  const pixelSize = 4

  ctx.clearRect(0, 0, 120, 120)

  // Couleurs selon la rareté
  const colors = getRarityColors(rarity)

  // Animation de flottement selon la rareté
  const floatIntensity = getFloatIntensity(rarity)
  const bounce = Math.sin(frame * 0.05) * floatIntensity

  // Effet de brillance pour les raretés élevées
  if (rarity === 'epic' || rarity === 'legendary') {
    drawSparkles(ctx, frame, rarity, pixelSize)
  }

  // Dessiner l'item selon la catégorie
  const itemY = 40 + bounce

  switch (category) {
    case 'hat':
      drawHat(ctx, colors, itemY, pixelSize)
      break
    case 'glasses':
      drawGlasses(ctx, colors, itemY, pixelSize)
      break
    case 'shoes':
      drawShoes(ctx, colors, itemY, pixelSize)
      break
  }
}

/**
 * Dessine un chapeau en pixel art
 */
function drawHat (
  ctx: CanvasRenderingContext2D,
  colors: RarityColors,
  y: number,
  ps: number
): void {
  // Bord du chapeau
  ctx.fillStyle = colors.primary
  ctx.fillRect(30, y + 30, ps * 15, ps * 2) // Bord large

  // Base du chapeau
  ctx.fillRect(36, y + 20, ps * 12, ps * 2)

  // Haut du chapeau
  ctx.fillRect(42, y + 10, ps * 9, ps * 2)
  ctx.fillRect(45, y + 5, ps * 6, ps * 2)
  ctx.fillRect(48, y, ps * 3, ps * 2)

  // Accent (ruban ou décoration)
  ctx.fillStyle = colors.accent
  ctx.fillRect(42, y + 28, ps * 9, ps * 2)

  // Détails brillants
  ctx.fillStyle = colors.highlight
  ctx.fillRect(51, y + 8, ps * 2, ps)
}

/**
 * Dessine des lunettes en pixel art
 */
function drawGlasses (
  ctx: CanvasRenderingContext2D,
  colors: RarityColors,
  y: number,
  ps: number
): void {
  // Verre gauche
  ctx.fillStyle = colors.primary
  ctx.fillRect(30, y + 15, ps * 8, ps * 8)

  // Verre droit
  ctx.fillRect(54, y + 15, ps * 8, ps * 8)

  // Pont entre les verres
  ctx.fillRect(38, y + 18, ps * 4, ps * 2)

  // Branches
  ctx.fillRect(24, y + 18, ps * 2, ps * 2) // Gauche début
  ctx.fillRect(20, y + 20, ps * 2, ps * 2)

  ctx.fillRect(62, y + 18, ps * 2, ps * 2) // Droite début
  ctx.fillRect(64, y + 20, ps * 2, ps * 2)

  // Reflets sur les verres (effet transparent)
  ctx.fillStyle = colors.highlight
  ctx.fillRect(33, y + 17, ps * 3, ps * 2)
  ctx.fillRect(57, y + 17, ps * 3, ps * 2)

  // Contours pour effet 3D
  ctx.fillStyle = colors.accent
  ctx.fillRect(30, y + 23, ps * 8, ps)
  ctx.fillRect(54, y + 23, ps * 8, ps)
}

/**
 * Dessine des chaussures en pixel art
 */
function drawShoes (
  ctx: CanvasRenderingContext2D,
  colors: RarityColors,
  y: number,
  ps: number
): void {
  // Chaussure gauche
  ctx.fillStyle = colors.primary

  // Semelle
  ctx.fillRect(27, y + 28, ps * 9, ps * 2)

  // Corps de la chaussure
  ctx.fillRect(30, y + 20, ps * 8, ps * 2)
  ctx.fillRect(33, y + 16, ps * 6, ps * 2)
  ctx.fillRect(36, y + 12, ps * 4, ps * 2)

  // Avant de la chaussure
  ctx.fillRect(36, y + 26, ps * 5, ps * 2)
  ctx.fillRect(39, y + 24, ps * 4, ps * 2)
  ctx.fillRect(39, y + 22, ps * 3, ps * 2)

  // Chaussure droite
  ctx.fillRect(54, y + 28, ps * 9, ps * 2)

  ctx.fillRect(54, y + 20, ps * 8, ps * 2)
  ctx.fillRect(54, y + 16, ps * 6, ps * 2)
  ctx.fillRect(54, y + 12, ps * 4, ps * 2)

  ctx.fillRect(54, y + 26, ps * 5, ps * 2)
  ctx.fillRect(54, y + 24, ps * 4, ps * 2)
  ctx.fillRect(54, y + 22, ps * 3, ps * 2)

  // Lacets/détails
  ctx.fillStyle = colors.accent
  ctx.fillRect(36, y + 14, ps, ps)
  ctx.fillRect(39, y + 16, ps, ps)
  ctx.fillRect(36, y + 18, ps, ps)

  ctx.fillRect(57, y + 14, ps, ps)
  ctx.fillRect(57, y + 16, ps, ps)
  ctx.fillRect(57, y + 18, ps, ps)

  // Brillance sur les semelles
  ctx.fillStyle = colors.highlight
  ctx.fillRect(30, y + 28, ps * 2, ps)
  ctx.fillRect(57, y + 28, ps * 2, ps)
}

/**
 * Dessine des étincelles autour de l'item pour les raretés élevées
 */
function drawSparkles (
  ctx: CanvasRenderingContext2D,
  frame: number,
  rarity: ItemRarity,
  ps: number
): void {
  const sparkleColor = rarity === 'legendary' ? '#FFD700' : '#A855F7'
  ctx.fillStyle = sparkleColor

  const numSparkles = rarity === 'legendary' ? 6 : 4

  for (let i = 0; i < numSparkles; i++) {
    const angle = (frame * 0.05 + i * (Math.PI * 2 / numSparkles))
    const radius = 40 + Math.sin(frame * 0.1) * 5
    const x = 60 + Math.cos(angle) * radius
    const y = 60 + Math.sin(angle) * radius

    // Étincelle en croix
    ctx.fillRect(x - ps / 2, y - ps / 2, ps, ps)
    ctx.fillRect(x - ps * 1.5, y - ps / 2, ps / 2, ps / 2)
    ctx.fillRect(x + ps, y - ps / 2, ps / 2, ps / 2)
    ctx.fillRect(x - ps / 2, y - ps * 1.5, ps / 2, ps / 2)
    ctx.fillRect(x - ps / 2, y + ps, ps / 2, ps / 2)
  }
}

/**
 * Type pour les couleurs de rareté
 */
interface RarityColors {
  primary: string
  accent: string
  highlight: string
}

/**
 * Retourne les couleurs selon la rareté
 */
function getRarityColors (rarity: ItemRarity): RarityColors {
  switch (rarity) {
    case 'common':
      return {
        primary: '#9CA3AF', // gray-400
        accent: '#6B7280', // gray-500
        highlight: '#D1D5DB' // gray-300
      }
    case 'rare':
      return {
        primary: '#3B82F6', // blue-500
        accent: '#1D4ED8', // blue-700
        highlight: '#93C5FD' // blue-300
      }
    case 'epic':
      return {
        primary: '#8B5CF6', // purple-500
        accent: '#6D28D9', // purple-700
        highlight: '#C4B5FD' // purple-300
      }
    case 'legendary':
      return {
        primary: '#F59E0B', // amber-500
        accent: '#D97706', // amber-600
        highlight: '#FCD34D' // amber-300
      }
  }
}

/**
 * Retourne l'intensité du flottement selon la rareté
 */
function getFloatIntensity (rarity: ItemRarity): number {
  switch (rarity) {
    case 'common':
      return 2
    case 'rare':
      return 4
    case 'epic':
      return 6
    case 'legendary':
      return 8
  }
}
