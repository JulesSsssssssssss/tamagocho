'use client'

import PixelButton from '@/components/ui/pixel-button'
import { useRouter } from 'next/navigation'

/**
 * HeroSection - Section héro avec thème pixel art gaming
 *
 * Design System:
 * - Gradient: from-slate-900 via-purple-900 to-slate-900
 * - Bordures: border-4 border-yellow-500 avec glow effects
 * - Typographie: font-mono pour le badge, text-shadow glow sur titre
 * - Particules: Carrés pixelisés animés avec imageRendering: 'pixelated'
 * - Effets: backdrop-blur, shadow-[0_0_30px_rgba(234,179,8,0.5)]
 *
 * Responsabilités (SRP):
 * - Affichage de la section héro d'accueil
 * - Navigation vers sign-in et scroll smooth vers monsters
 * - Présentation visuelle avec thème rétro gaming cohérent
 *
 * @returns {React.ReactNode} Section héro pixel art
 */
export default function HeroSection (): React.ReactNode {
  const router = useRouter()

  const handleDiscoverClick = (): void => {
    const element = document.getElementById('monsters')
    if (element != null) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id='hero'
      className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-24 lg:pt-32 lg:pb-32'
    >
      {/* Grille pixel-art en arrière-plan */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30'
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Particules décoratives pixel-art */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-32 left-1/4 w-4 h-4 bg-yellow-400/40 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute top-48 right-1/4 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1s' }}
        />
        <div
          className='absolute top-2/3 right-1/3 w-3 h-3 bg-yellow-400/35 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }}
        />
        <div
          className='absolute bottom-1/4 right-1/4 w-4 h-4 bg-purple-500/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '2s' }}
        />
      </div>

      {/* Bordure décorative pixel en haut avec glow */}
      <div
        className='absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent'
        style={{
          boxShadow: '0 0 15px rgba(234, 179, 8, 0.6)',
          imageRendering: 'pixelated'
        }}
      />

      {/* Pixel corners décoratifs */}
      <div className='absolute top-2 left-2 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-2 right-2 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
        {/* Badge "Nouveau" avec style pixel art */}
        <div
          className='inline-flex items-center gap-2 rounded-xl bg-slate-800/80 backdrop-blur-sm px-5 py-2.5 border-4 border-yellow-500/40 hover:border-yellow-500/60 hover:scale-105 transition-all duration-300'
          style={{ imageRendering: 'pixelated' }}
        >
          <span className='text-base'>✨</span>
          <span className='font-mono text-sm font-bold tracking-wider text-yellow-400'>
            NOUVEAU : PROGRESSION MULTI-CRÉATURES
          </span>
        </div>

        {/* Titre principal avec glow effect */}
        <h1
          className='text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight font-mono tracking-tight'
          style={{
            textShadow: '0 0 30px rgba(234, 179, 8, 0.5), 0 0 60px rgba(234, 179, 8, 0.3)',
            imageRendering: 'pixelated'
          }}
        >
          ADOPTEZ VOTRE{' '}
          <span className='text-yellow-400 inline-block animate-pulse'>
            PETIT MONSTRE
          </span>
          <br />
          ET VIVEZ UNE AVENTURE{' '}
          <span className='text-purple-400'>MAGIQUE</span> 🎮
        </h1>

        {/* Description avec style rétro */}
        <p className='mx-auto max-w-3xl text-lg md:text-xl text-gray-300 font-mono leading-relaxed'>
          Découvrez l'univers <span className='text-yellow-400 font-bold'>Tamagocho</span> : nourrissez, jouez et faites évoluer votre compagnon virtuel grâce à des activités quotidiennes, des quêtes épiques et une communauté bienveillante. 🌟
        </p>

        {/* Boutons d'action avec PixelButton */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
          <PixelButton
            size='xl'
            variant='primary'
            icon='🚀'
            onClick={() => router.push('/sign-in')}
          >
            COMMENCER L'AVENTURE
          </PixelButton>
          <PixelButton
            size='xl'
            variant='ghost'
            icon='🎯'
            onClick={handleDiscoverClick}
          >
            DÉCOUVRIR LE JEU
          </PixelButton>
        </div>

        {/* Stats pixel art (optionnel mais cool) */}
        <div className='pt-8 flex flex-wrap items-center justify-center gap-8 font-mono text-sm'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>👥</span>
            <span className='text-gray-400'>+500 joueurs actifs</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>🎮</span>
            <span className='text-gray-400'>+1000 créatures adoptées</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>⭐</span>
            <span className='text-gray-400'>4.8/5 satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  )
}
