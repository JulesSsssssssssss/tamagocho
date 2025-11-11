'use client'

import PixelButton from '@/components/ui/pixel-button'
import { useRouter } from 'next/navigation'

export default function HeroSection (): React.ReactNode {
  const router = useRouter()

  const handleDiscoverClick = (): void => {
    const element = document.getElementById('monsters')
    if (element != null) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id='hero' className='relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-24 lg:pt-32 lg:pb-32 transition-colors duration-300'>
      {/* Effet pixel-art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40' />

      {/* Particules décoratives pixel-art */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-32 left-1/4 w-4 h-4 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-48 right-1/4 w-3 h-3 bg-blue-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-2/3 right-1/3 w-3 h-3 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      {/* Bordure décorative en haut */}
      <div className='absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-500 via-blue-500 to-yellow-500' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
        <div className='inline-flex items-center gap-2 rounded-xl bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-yellow-400 dark:text-yellow-300 shadow-lg border-3 border-yellow-500/30 dark:border-yellow-600/30 hover:scale-105 transition-transform duration-300' style={{ imageRendering: 'pixelated' }}>
          <span className='text-base'>✨</span>
          <span>Nouveau : progression multi-créatures</span>
        </div>

        <h1 className='text-4xl md:text-6xl font-bold text-white leading-tight' style={{ textShadow: '0 0 30px rgba(234, 179, 8, 0.3)' }}>
          Adoptez votre <span className='text-yellow-400 dark:text-yellow-300'>petit monstre</span>{' '}
          et vivez une aventure <span className='text-blue-400 dark:text-blue-300'>magique</span> 🎮
        </h1>

        <p className='mx-auto max-w-3xl text-lg md:text-xl text-gray-300 dark:text-gray-400'>
          Découvrez l'univers Tamagocho : nourrissez, jouez et faites évoluer votre compagnon virtuel grâce à des activités quotidiennes, des mini-jeux et une communauté bienveillante. 🌟
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <PixelButton
            size='lg'
            variant='primary'
            icon='🚀'
            onClick={() => router.push('/sign-in')}
          >
            Commencer l'aventure
          </PixelButton>
          <PixelButton
            size='lg'
            variant='secondary'
            icon='🎯'
            onClick={handleDiscoverClick}
          >
            Découvrir le jeu
          </PixelButton>
        </div>
      </div>
    </section>
  )
}
