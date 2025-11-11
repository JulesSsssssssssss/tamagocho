import { memo } from 'react'

/**
 * Composant de pièce en pixel art
 *
 * Affiche une pièce dorée style rétro gaming avec un effet pixel art
 *
 * @param {object} props - Props du composant
 * @param {number} props.size - Taille de la pièce (défaut: 32)
 * @returns {React.ReactNode} Pièce en pixel art
 */
const PixelCoin = memo(function PixelCoin ({
  size = 32
}: {
  size?: number
}): React.ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      style={{ imageRendering: 'pixelated' }}
      className='inline-block'
    >
      {/* Ombre */}
      <rect x='2' y='14' width='12' height='1' fill='#1e293b' opacity='0.2' />

      {/* Contour externe noir */}
      <rect x='4' y='2' width='8' height='12' fill='#78350f' />
      <rect x='3' y='4' width='10' height='8' fill='#78350f' />
      <rect x='2' y='6' width='12' height='4' fill='#78350f' />

      {/* Base dorée */}
      <rect x='5' y='3' width='6' height='10' fill='#fbbf24' />
      <rect x='4' y='5' width='8' height='6' fill='#fbbf24' />
      <rect x='3' y='6' width='10' height='4' fill='#fbbf24' />

      {/* Highlights jaune clair */}
      <rect x='5' y='3' width='4' height='2' fill='#fef08a' />
      <rect x='4' y='5' width='6' height='2' fill='#fef08a' />
      <rect x='3' y='6' width='8' height='2' fill='#fef08a' />

      {/* Reflets blancs */}
      <rect x='5' y='3' width='2' height='1' fill='#ffffff' />
      <rect x='4' y='5' width='3' height='1' fill='#ffffff' opacity='0.8' />
      <rect x='3' y='6' width='4' height='1' fill='#ffffff' opacity='0.6' />

      {/* Ombres foncées (bas de la pièce) */}
      <rect x='5' y='11' width='6' height='2' fill='#d97706' />
      <rect x='4' y='9' width='8' height='2' fill='#f59e0b' />
      <rect x='3' y='8' width='10' height='2' fill='#fbbf24' />

      {/* Symbole $ au centre (optionnel) */}
      <rect x='7' y='6' width='2' height='1' fill='#78350f' />
      <rect x='6' y='7' width='1' height='1' fill='#78350f' />
      <rect x='9' y='7' width='1' height='1' fill='#78350f' />
      <rect x='7' y='8' width='2' height='1' fill='#78350f' />
      <rect x='7' y='5' width='2' height='4' fill='#78350f' />
    </svg>
  )
})

export default PixelCoin
