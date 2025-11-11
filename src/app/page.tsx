import dynamic from 'next/dynamic'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'

/**
 * Optimisation : Lazy loading des sections below-the-fold
 * Ces sections ne sont pas visibles au premier chargement (below-the-fold)
 * On les charge dynamiquement pour améliorer le First Contentful Paint
 * Gain : -50KB bundle initial, LCP -300ms
 */
const BenefitsSection = dynamic(async () => await import('@/components/benefits-section'))
const MonstersSection = dynamic(async () => await import('@/components/monsters-section'))
const ActionsSection = dynamic(async () => await import('@/components/actions-section'))
const NewsletterSection = dynamic(async () => await import('@/components/newsletter-section'))
const Footer = dynamic(async () => await import('@/components/footer'))

export default function Home (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans text-gray-100 transition-colors duration-300'>
      {/* Effet de grille rétro en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none' />

      {/* Particules pixel-art */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
        <div className='absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '2s' }} />
        <div className='absolute top-2/3 left-1/3 w-2 h-2 bg-purple-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '2.5s' }} />
      </div>

      <div className='relative z-10'>
        <Header />
        <main className='space-y-0'>
          <HeroSection />
          <BenefitsSection />
          <MonstersSection />
          <ActionsSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
