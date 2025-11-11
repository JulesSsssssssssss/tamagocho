/**
 * Toast amélioré pour les récompenses de quêtes
 *
 * Affiche une notification visuelle spectaculaire lors du gain de Koins
 * avec animations de confettis et de pièces
 */

'use client'

import React from 'react'

interface QuestRewardToastProps {
  /** Montant de Koins gagnés */
  coinsEarned: number
  /** Nouveau solde total */
  newBalance: number
  /** Titre de la quête complétée */
  questTitle?: string
}

/**
 * Toast de récompense de quête avec animations
 */
export function QuestRewardToast ({
  coinsEarned,
  newBalance,
  questTitle
}: QuestRewardToastProps): React.ReactNode {
  return (
    <div className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8 shadow-2xl border-4 border-yellow-400 w-full max-w-md mx-auto overflow-hidden'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div
        className='absolute inset-0 opacity-30 pointer-events-none'
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)',
          imageRendering: 'pixelated'
        }}
      />

      {/* Effet de brillance animé */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse' />

      {/* Confettis multiples */}
      <div className='absolute top-4 left-[15%] w-3 h-3 bg-yellow-400 animate-bounce' style={{ animationDelay: '0s', animationDuration: '1s' }} />
      <div className='absolute top-4 left-[30%] w-2 h-2 bg-emerald-400 animate-bounce' style={{ animationDelay: '0.2s', animationDuration: '1.2s' }} />
      <div className='absolute top-4 left-[50%] w-3 h-3 bg-blue-400 animate-bounce' style={{ animationDelay: '0.1s', animationDuration: '1.1s' }} />
      <div className='absolute top-4 left-[70%] w-2 h-2 bg-pink-400 animate-bounce' style={{ animationDelay: '0.3s', animationDuration: '1.3s' }} />
      <div className='absolute top-4 left-[85%] w-3 h-3 bg-purple-400 animate-bounce' style={{ animationDelay: '0.15s', animationDuration: '1.15s' }} />

      {/* Contenu principal */}
      <div className='relative z-10 flex flex-col items-center'>
        {/* Icône de succès avec animation */}
        <div className='mb-4 relative'>
          <div className='w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse border-4 border-yellow-300'>
            <span className='text-5xl animate-bounce'>🎉</span>
          </div>
          {/* Effet de glow pulsant */}
          <div className='absolute inset-0 rounded-lg border-4 border-yellow-400 animate-ping' style={{ animationDuration: '1.5s' }} />
        </div>

        {/* Titre */}
        <h3 className='text-center text-white font-black text-2xl font-mono mb-2 tracking-widest uppercase'>
          Quête Terminée !
        </h3>

        {/* Nom de la quête */}
        {questTitle !== undefined && (
          <p className='text-center text-slate-300 text-sm font-mono mb-6 px-4 leading-relaxed'>
            {questTitle}
          </p>
        )}

        {/* Montant gagné - Carte mise en évidence */}
        <div className='bg-gradient-to-br from-slate-950 to-slate-900 rounded-lg p-6 mb-4 border-4 border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.4)] w-full'>
          <div className='flex items-center justify-center gap-4'>
            <span className='text-6xl' style={{ animation: 'bounce 1s infinite' }}>💰</span>
            <div className='text-center'>
              <p className='text-yellow-400 font-black text-4xl font-mono leading-none mb-2' style={{ textShadow: '0 0 30px rgba(250, 204, 21, 0.8), 0 0 10px rgba(250, 204, 21, 0.6)' }}>
                +{coinsEarned}
              </p>
              <p className='text-yellow-300 text-sm font-bold font-mono'>
                TAMACOINS
              </p>
            </div>
          </div>
        </div>

        {/* Nouveau solde */}
        <div className='bg-slate-800/50 rounded-lg px-4 py-2 border-2 border-slate-600/50 mb-4'>
          <p className='text-slate-400 text-xs font-mono text-center'>
            Solde actuel: <span className='text-white font-bold'>{newBalance} TC</span>
          </p>
        </div>

        {/* Message d'encouragement */}
        <div className='flex items-center gap-2'>
          <span className='text-2xl animate-pulse'>✨</span>
          <p className='text-emerald-400 text-base font-black font-mono tracking-wider uppercase'>
            Bien joué !
          </p>
          <span className='text-2xl animate-pulse' style={{ animationDelay: '0.5s' }}>✨</span>
        </div>
      </div>

      {/* Barre de progression animée en bas */}
      <div className='absolute bottom-0 left-0 right-0 h-2 bg-slate-950 overflow-hidden'>
        <div className='h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse' />
      </div>

      {/* Pièces flottantes décoratives */}
      <div className='absolute -top-2 -right-2 text-3xl animate-bounce' style={{ animationDelay: '0.1s' }}>
        💎
      </div>
      <div className='absolute -bottom-2 -left-2 text-2xl animate-bounce' style={{ animationDelay: '0.3s' }}>
        ⭐
      </div>
    </div>
  )
}

export default QuestRewardToast
