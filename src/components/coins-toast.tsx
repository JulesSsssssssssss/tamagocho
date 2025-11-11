/**
 * Composant de notification pour les coins gagnés
 * Style pixel art gaming pour afficher les récompenses
 */

import PixelCoin from '@/components/dashboard/pixel-coin'

interface CoinsToastProps {
  coinsEarned: number
  newBalance?: number
}

/**
 * Affiche une notification stylisée pour les coins gagnés
 *
 * @param {CoinsToastProps} props - Props du composant
 * @returns {React.ReactNode} Toast personnalisé
 *
 * @example
 * ```tsx
 * <CoinsToast coinsEarned={10} newBalance={150} />
 * ```
 */
export function CoinsToast ({ coinsEarned, newBalance }: CoinsToastProps): React.ReactNode {
  return (
    <div className='relative flex items-center gap-4 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 pointer-events-none' style={{ imageRendering: 'pixelated' }} />

      {/* Animation de pièce avec effet pixel */}
      <div className='relative animate-bounce z-10'>
        <PixelCoin size={48} />
        {/* Effet de brillance */}
        <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-sm opacity-75 animate-pulse' style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Contenu texte - Style rétro gaming */}
      <div className='flex flex-col gap-2 z-10'>
        <p className='text-yellow-400 font-black text-xl font-mono tracking-wider' style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          +{coinsEarned} TAMACOINS
        </p>
        {newBalance !== undefined && (
          <p className='text-emerald-400 text-sm font-mono font-bold tracking-wide' style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>
            ✨ Solde : {newBalance.toLocaleString()} TC
          </p>
        )}
      </div>

      {/* Particules décoratives pixel art */}
      <div className='absolute top-2 right-2 w-2 h-2 bg-yellow-400/50 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.2s' }} />
      <div className='absolute bottom-3 right-4 w-2 h-2 bg-yellow-300/40 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
    </div>
  )
}

export default CoinsToast
