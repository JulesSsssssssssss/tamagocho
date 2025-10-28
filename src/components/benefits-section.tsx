import type { BenefitCardProps } from '@/shared/types/components'

function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  background: string
  border: string
  iconBackground: string
} {
  const colorMaps: Record<BenefitCardProps['colorTheme'], {
    background: string
    border: string
    iconBackground: string
  }> = {
    moccaccino: {
      background: 'bg-moccaccino-50',
      border: 'border-moccaccino-100',
      iconBackground: 'bg-moccaccino-500'
    },
    lochinvar: {
      background: 'bg-lochinvar-50',
      border: 'border-lochinvar-100',
      iconBackground: 'bg-lochinvar-500'
    },
    'fuchsia-blue': {
      background: 'bg-fuchsia-blue-50',
      border: 'border-fuchsia-blue-100',
      iconBackground: 'bg-fuchsia-blue-500'
    }
  }

  return colorMaps[colorTheme]
}

export function BenefitCard ({ icon, title, description, colorTheme }: BenefitCardProps): React.ReactNode {
  const colors = getColorClasses(colorTheme)

  return (
    <article className={`flex flex-col items-center text-center gap-4 rounded-3xl border ${colors.border} ${colors.background} p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md`}>
      <div className={`flex size-16 items-center justify-center rounded-full text-2xl text-white ${colors.iconBackground}`}>
        {icon}
      </div>
      <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </article>
  )
}

export default function BenefitsSection (): React.ReactNode {
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
    <section id='benefits' className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Pourquoi choisir Tamagocho ?</h2>
          <p className='text-lg text-gray-600'>Une expérience de jeu unique qui combine nostalgie et innovation moderne.</p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
