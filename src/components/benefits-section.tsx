import { memo } from 'react'
import type { BenefitCardProps } from '@/shared/types/components'

function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  background: string
  border: string
  iconBackground: string
  darkBackground: string
  darkBorder: string
} {
  const colorMaps: Record<BenefitCardProps['colorTheme'], {
    background: string
    border: string
    iconBackground: string
    darkBackground: string
    darkBorder: string
  }> = {
    moccaccino: {
      background: 'bg-yellow-500/10',
      border: 'border-yellow-500',
      iconBackground: 'bg-yellow-500',
      darkBackground: 'dark:bg-yellow-500/10',
      darkBorder: 'dark:border-yellow-600'
    },
    lochinvar: {
      background: 'bg-blue-500/10',
      border: 'border-blue-500',
      iconBackground: 'bg-blue-600',
      darkBackground: 'dark:bg-blue-500/10',
      darkBorder: 'dark:border-blue-600'
    },
    'fuchsia-blue': {
      background: 'bg-purple-500/10',
      border: 'border-purple-500',
      iconBackground: 'bg-purple-600',
      darkBackground: 'dark:bg-purple-500/10',
      darkBorder: 'dark:border-purple-600'
    }
  }

  return colorMaps[colorTheme]
}

/**
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 */
export const BenefitCard = memo(function BenefitCard ({ icon, title, description, colorTheme }: BenefitCardProps): React.ReactNode {
  const colors = getColorClasses(colorTheme)

  return (
    <article className={`flex flex-col items-center text-center gap-4 rounded-xl border-4 ${colors.border} ${colors.darkBorder} ${colors.background} ${colors.darkBackground} backdrop-blur-sm p-8 shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-1`} style={{ imageRendering: 'pixelated' }}>
      <div className={`flex size-16 items-center justify-center rounded-xl border-3 border-white/30 text-2xl text-white ${colors.iconBackground} shadow-md`} style={{ imageRendering: 'pixelated' }}>
        {icon}
      </div>
      <h3 className='text-xl font-semibold text-white'>{title}</h3>
      <p className='text-gray-300'>{description}</p>
    </article>
  )
}, (prevProps, nextProps) =>
  prevProps.icon === nextProps.icon &&
  prevProps.title === nextProps.title &&
  prevProps.description === nextProps.description &&
  prevProps.colorTheme === nextProps.colorTheme
)

/**
 * Optimisation : Mémoïsé avec React.memo (props statiques)
 */
const BenefitsSection = memo(function BenefitsSection (): React.ReactNode {
  const benefits: BenefitCardProps[] = [
    {
      icon: '💖',
      title: 'Créatures attachantes',
      description: 'Des monstres adorables avec des personnalités uniques qui évoluent selon vos soins.',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎮',
      title: 'Gameplay engageant',
      description: 'Nourrissez, jouez et entraînez votre créature pour débloquer de nouvelles capacités.',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🌟',
      title: 'Évolution continue',
      description: 'Regardez votre monstre grandir et se transformer à travers différentes phases de vie.',
      colorTheme: 'fuchsia-blue'
    }
  ]

  return (
    <section id='benefits' className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 transition-colors duration-300 overflow-hidden'>
      {/* Effet de grille pixel-art */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-white' style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}>
            Pourquoi choisir Tamagocho ? 🎯
          </h2>
          <p className='text-lg text-gray-300'>
            Une expérience de jeu unique qui combine nostalgie et innovation moderne.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default BenefitsSection
