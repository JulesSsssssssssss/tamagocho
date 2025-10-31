import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import BenefitsSection from '@/components/benefits-section'
import MonstersSection from '@/components/monsters-section'
import ActionsSection from '@/components/actions-section'
import NewsletterSection from '@/components/newsletter-section'

export default function Home (): React.ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 font-sans text-gray-100 transition-colors duration-300'>
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
