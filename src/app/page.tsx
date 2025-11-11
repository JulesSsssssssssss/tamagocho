import dynamic from 'next/dynamic'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BenefitsSection from '@/components/benefits-section'
import MonstersSection from '@/components/monsters-section'
import ActionsSection from '@/components/actions-section'
import NewsletterSection from '@/components/newsletter-section'

/**
 * Footer en lazy loading car en bas de page
 */
const Footer = dynamic(async () => await import('@/components/footer'))

// Force dynamic rendering (checks auth session in Header)
export const dynamicParams = true
export const revalidate = 0

/**
 * Home - Page d'accueil avec thème pixel art gaming
 *
 * Design System:
 * - Gradient global: from-slate-900 via-purple-900 to-slate-900
 * - Grille pixel art fixe en overlay
 * - Pixel corners décoratifs
 * - Bordure supérieure avec glow effect
 * - Particules pixelisées animées
 *
 * Architecture (Clean Architecture):
 * - Presentation Layer: Page composée de sections
 * - Composition: Header + HeroSection + BenefitsSection + MonstersSection + ActionsSection + NewsletterSection + Footer
 *
 * Responsabilités (SRP):
 * - Composition de la page d'accueil
 * - Structure visuelle globale
 *
 * Performance:
 * - Sections principales en imports directs pour meilleur FCP
 * - Footer en lazy loading (below-the-fold)
 * - Sections optimisées avec React.memo
 *
 * @returns {React.ReactNode} Page d'accueil pixel art
 */
export default function Home (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans text-gray-100 overflow-hidden'>
      {/* Grille pixel-art fixe en overlay global */}
      <div
        className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none z-0'
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Particules pixel-art décoratives globales */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none z-5'>
        <div
          className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute top-20 right-20 w-4 h-4 bg-purple-400/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/15 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }}
        />
        <div
          className='absolute bottom-1/4 right-1/4 w-3 h-3 bg-yellow-400/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '2s' }}
        />
        <div
          className='absolute top-2/3 left-1/3 w-2 h-2 bg-purple-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '2.5s' }}
        />
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
