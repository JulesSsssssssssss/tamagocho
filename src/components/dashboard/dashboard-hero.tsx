'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import PixelCoin from './pixel-coin'

/**
 * Props du composant DashboardHero
 */
interface DashboardHeroProps {
  /** Email de l'utilisateur */
  userEmail: string
  /** Nombre de pièces du joueur */
  coins: number
}

/**
 * Hero section du Dashboard avec affichage des pièces en pixel art
 *
 * Responsabilités (SRP) :
 * - Affichage de la bannière d'accueil
 * - Présentation des pièces en style pixel art
 * - Message de bienvenue personnalisé
 *
 * Design :
 * - Fond dégradé gaming
 * - Effets de particules
 * - Affichage des pièces en haut à droite
 *
 * @param {DashboardHeroProps} props - Props du composant
 * @returns {React.ReactNode} Hero section
 */
const DashboardHero = memo(function DashboardHero ({
  userEmail,
  coins
}: DashboardHeroProps): React.ReactNode {
  const router = useRouter()

  const handleWalletClick = (): void => {
    router.push('/wallet')
  }

  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm p-8 md:p-12 mb-8 border-4 border-moccaccino-500 shadow-[0_0_30px_rgba(247,83,60,0.3)]'>
      {/* Effet de grille rétro */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40' />

      {/* Particules animées - couleurs du thème */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-moccaccino-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-lochinvar-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-fuchsia-blue-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-moccaccino-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      {/* Effet de pixels dans les coins - dégradé thème */}
      <div className='absolute top-2 left-2 w-4 h-4 bg-moccaccino-500 rounded-sm' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-2 right-2 w-4 h-4 bg-lochinvar-500 rounded-sm' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-2 left-2 w-4 h-4 bg-fuchsia-blue-500 rounded-sm' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-2 right-2 w-4 h-4 bg-moccaccino-500 rounded-sm' style={{ imageRendering: 'pixelated' }} />

      {/* Affichage des pièces et boutique en haut à droite (pixel art) */}
      <div className='absolute top-6 right-6 z-10 flex flex-col gap-3'>
        {/* Bouton Wallet - CLIQUABLE */}
        <button
          onClick={handleWalletClick}
          className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-moccaccino-500/50 shadow-[0_0_20px_rgba(247,83,60,0.2)] flex items-center gap-3 transform hover:scale-110 transition-all duration-200 active:scale-95 cursor-pointer hover:border-moccaccino-400 hover:shadow-[0_0_30px_rgba(247,83,60,0.4)] group'
          aria-label='Ouvrir mon portefeuille'
        >
          <PixelCoin size={40} />
          <div className='flex flex-col'>
            <span className='text-xs text-moccaccino-400/70 font-bold uppercase tracking-wider group-hover:text-moccaccino-300 transition-colors' style={{ fontFamily: 'monospace' }}>
              Coins
            </span>
            <span className='text-2xl font-bold text-moccaccino-400 group-hover:text-moccaccino-300 transition-colors' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
              {coins.toLocaleString()}
            </span>
          </div>
          {/* Indicateur visuel de clic */}
          <span className='text-sm opacity-0 group-hover:opacity-100 transition-opacity'>👉</span>
        </button>

        {/* Bouton Boutique - NOUVEAU */}
        <button
          onClick={() => { router.push('/shop') }}
          className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-3 transform hover:scale-110 transition-all duration-200 active:scale-95 cursor-pointer hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] group'
          aria-label='Ouvrir la boutique'
        >
          <span className='text-4xl' style={{ imageRendering: 'pixelated' }}>🛍️</span>
          <div className='flex flex-col'>
            <span className='text-xs text-purple-400/70 font-bold uppercase tracking-wider group-hover:text-purple-300 transition-colors' style={{ fontFamily: 'monospace' }}>
              Shop
            </span>
            <span className='text-xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
              Boutique
            </span>
          </div>
          {/* Indicateur visuel de clic */}
          <span className='text-sm opacity-0 group-hover:opacity-100 transition-opacity'>🛒</span>
        </button>

        {/* Bouton Galerie */}
        <button
          onClick={() => { router.push('/gallery') }}
          className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center gap-3 transform hover:scale-110 transition-all duration-200 active:scale-95 cursor-pointer hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] group'
          aria-label='Ouvrir la galerie communautaire'
        >
          <span className='text-4xl' style={{ imageRendering: 'pixelated' }}>🌍</span>
          <div className='flex flex-col'>
            <span className='text-xs text-yellow-400/70 font-bold uppercase tracking-wider group-hover:text-yellow-300 transition-colors' style={{ fontFamily: 'monospace' }}>
              Gallery
            </span>
            <span className='text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
              Galerie
            </span>
          </div>
          {/* Indicateur visuel de clic */}
          <span className='text-sm opacity-0 group-hover:opacity-100 transition-opacity'>👁️</span>
        </button>

        {/* Bouton Quêtes - NOUVEAU */}
        <button
          onClick={() => { router.push('/quests') }}
          className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center gap-3 transform hover:scale-110 transition-all duration-200 active:scale-95 cursor-pointer hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] group'
          aria-label='Ouvrir les quêtes quotidiennes'
        >
          <span className='text-4xl' style={{ imageRendering: 'pixelated' }}>🎯</span>
          <div className='flex flex-col'>
            <span className='text-xs text-green-400/70 font-bold uppercase tracking-wider group-hover:text-green-300 transition-colors' style={{ fontFamily: 'monospace' }}>
              Daily
            </span>
            <span className='text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
              Quêtes
            </span>
          </div>
          {/* Indicateur visuel de clic */}
          <span className='text-sm opacity-0 group-hover:opacity-100 transition-opacity'>✨</span>
        </button>
      </div>

      {/* Contenu principal */}
      <div className='relative z-10 max-w-4xl'>
        {/* Titre principal */}
        <div className='mb-4'>
          <h1
            className='text-5xl md:text-6xl font-black text-white mb-2 tracking-tight'
            style={{
              textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              fontFamily: 'monospace',
              imageRendering: 'pixelated'
            }}
          >
            🎮 TAMAGOTCHO 🎮
          </h1>
          <div className='h-2 w-48 bg-yellow-400/60 rounded-sm mx-auto' style={{ imageRendering: 'pixelated' }} />
        </div>

        {/* Message de bienvenue */}
        <div className='bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 max-w-2xl'>
          <p className='text-white text-lg md:text-xl font-bold mb-2' style={{ fontFamily: 'monospace' }}>
            👋 Bienvenue, <span className='font-black text-yellow-400'>{userEmail}</span>
          </p>
          <p className='text-white/80 text-sm md:text-base font-bold' style={{ fontFamily: 'monospace' }}>
            Prends soin de tes créatures, gagne des pièces et deviens le meilleur dresseur ! 🎮
          </p>
        </div>

        {/* Stats visuelles (optionnel) */}
        <div className='mt-6 flex flex-wrap gap-4'>
          <div className='bg-slate-950/60 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-yellow-500/30 flex items-center gap-2'>
            <span className='text-2xl'>🎯</span>
            <div>
              <p className='text-xs text-yellow-400 uppercase font-bold' style={{ fontFamily: 'monospace' }}>
                Mission
              </p>
              <p className='text-sm text-white font-bold'>Élève tes créatures</p>
            </div>
          </div>

          <div className='bg-slate-950/60 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-yellow-500/30 flex items-center gap-2'>
            <span className='text-2xl'>⭐</span>
            <div>
              <p className='text-xs text-yellow-400 uppercase font-bold' style={{ fontFamily: 'monospace' }}>
                Objectif
              </p>
              <p className='text-sm text-white font-bold'>Monter de niveau</p>
            </div>
          </div>
        </div>
      </div>

      {/* Décorations en bas (pixelisées) */}
      <div className='absolute bottom-0 right-0 w-64 h-64 opacity-10'>
        <svg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg' style={{ imageRendering: 'pixelated' }}>
          {/* Monstre pixel art simple */}
          <rect x='20' y='16' width='24' height='32' fill='#facc15' />
          <rect x='16' y='20' width='32' height='24' fill='#facc15' />
          {/* Yeux */}
          <rect x='24' y='24' width='4' height='4' fill='black' />
          <rect x='36' y='24' width='4' height='4' fill='black' />
          {/* Bouche */}
          <rect x='28' y='36' width='8' height='2' fill='black' />
        </svg>
      </div>
    </div>
  )
})

export default DashboardHero
