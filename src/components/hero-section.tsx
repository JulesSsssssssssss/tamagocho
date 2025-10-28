'use client'

import Button from '@/components/button'
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
    <section id='hero' className='bg-gradient-to-br from-moccaccino-50 via-lochinvar-50 to-fuchsia-blue-50 pt-28 pb-24 lg:pt-32 lg:pb-32'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
        <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-lochinvar-700 shadow-sm shadow-lochinvar-100'>
          <span className='text-base'>✨</span>
          <span>Nouveau : progression multi-créatures</span>
        </div>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 leading-tight'>
          Adoptez votre <span className='text-moccaccino-600'>petit monstre</span>{' '}
          et vivez une aventure <span className='text-fuchsia-blue-600'>magique</span>
        </h1>
        <p className='mx-auto max-w-3xl text-lg md:text-xl text-gray-600'>
          Découvrez l'univers Tamagocho : nourrissez, jouez et faites évoluer votre compagnon virtuel grâce à des activités quotidiennes, des mini-jeux et une communauté bienveillante.
        </p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Button size='lg' className='px-8 py-6 text-base font-semibold shadow-lg shadow-moccaccino-100' onClick={() => router.push('/sign-in')}>
            Commencer l'aventure 🚀
          </Button>
          <Button size='lg' variant='outline' className='px-8 py-6 text-base font-semibold' onClick={handleDiscoverClick}>
            Découvrir le jeu
          </Button>
        </div>
      </div>
    </section>
  )
}
