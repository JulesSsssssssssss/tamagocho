import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import BenefitsSection from '@/components/benefits-section'
import MonstersSection from '@/components/monsters-section'
import ActionsSection from '@/components/actions-section'
import NewsletterSection from '@/components/newsletter-section'

export default function Home (): React.ReactNode {
  return (
    <div className='min-h-screen bg-white font-sans text-gray-900'>
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
  )
}
