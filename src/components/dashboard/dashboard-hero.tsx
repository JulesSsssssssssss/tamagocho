import { memo } from 'react'
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
  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-blue-600 via-moccaccino-500 to-lochinvar-600 p-8 md:p-12 shadow-2xl mb-8'>
      {/* Effet de grille rétro */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30' />

      {/* Particules animées */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-white/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-white/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      {/* Affichage des pièces en haut à droite (pixel art) */}
      <div className='absolute top-6 right-6 z-10'>
        <div className='bg-slate-900/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-slate-700 shadow-xl flex items-center gap-3 transform hover:scale-105 transition-transform duration-200'>
          <PixelCoin size={40} />
          <div className='flex flex-col'>
            <span className='text-xs text-slate-400 font-bold uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
              Coins
            </span>
            <span className='text-2xl font-bold text-yellow-400' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
              {coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className='relative z-10 max-w-4xl'>
        {/* Titre principal */}
        <div className='mb-4'>
          <h1
            className='text-5xl md:text-6xl font-black text-white mb-2 tracking-tight'
            style={{
              textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            TAMAGOTCHO
          </h1>
          <div className='h-2 w-32 bg-white/40 rounded-full' style={{ imageRendering: 'pixelated' }} />
        </div>

        {/* Message de bienvenue */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20 max-w-2xl'>
          <p className='text-white/90 text-lg md:text-xl font-medium mb-2'>
            👋 Bienvenue, <span className='font-bold text-yellow-300'>{userEmail}</span>
          </p>
          <p className='text-white/70 text-sm md:text-base'>
            Prends soin de tes créatures, gagne des pièces et deviens le meilleur dresseur ! 🎮
          </p>
        </div>

        {/* Stats visuelles (optionnel) */}
        <div className='mt-6 flex flex-wrap gap-4'>
          <div className='bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2'>
            <span className='text-2xl'>🎯</span>
            <div>
              <p className='text-xs text-white/60 uppercase font-bold' style={{ fontFamily: 'monospace' }}>
                Mission
              </p>
              <p className='text-sm text-white font-bold'>Élève tes créatures</p>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 flex items-center gap-2'>
            <span className='text-2xl'>⭐</span>
            <div>
              <p className='text-xs text-white/60 uppercase font-bold' style={{ fontFamily: 'monospace' }}>
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
          <rect x='20' y='16' width='24' height='32' fill='white' />
          <rect x='16' y='20' width='32' height='24' fill='white' />
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
