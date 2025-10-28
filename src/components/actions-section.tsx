import type { ActionCardProps } from '@/shared/types/components'

function getActionColorClasses (colorTheme: ActionCardProps['colorTheme']): string {
  const colorMaps: Record<ActionCardProps['colorTheme'], string> = {
    moccaccino: 'bg-moccaccino-100 text-moccaccino-700',
    lochinvar: 'bg-lochinvar-100 text-lochinvar-700',
    'fuchsia-blue': 'bg-fuchsia-blue-100 text-fuchsia-blue-700'
  }

  return colorMaps[colorTheme]
}

export function ActionCard ({ icon, title, description, colorTheme }: ActionCardProps): React.ReactNode {
  const colorClass = getActionColorClasses(colorTheme)

  return (
    <article className='flex flex-col items-center gap-4 text-center rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md'>
      <div className={`flex size-20 items-center justify-center rounded-full text-3xl ${colorClass}`}>
        {icon}
      </div>
      <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </article>
  )
}

export default function ActionsSection (): React.ReactNode {
  const actions: ActionCardProps[] = [
    {
      icon: '🍎',
      title: 'Nourrir',
      description: 'Offrez des repas délicieux pour maintenir votre créature en pleine forme.',
      colorTheme: 'moccaccino'
    },
    {
      icon: '🎾',
      title: 'Jouer',
      description: 'Amusez-vous avec des mini-jeux pour renforcer votre relation.',
      colorTheme: 'lochinvar'
    },
    {
      icon: '🛁',
      title: 'Laver',
      description: 'Gardez votre compagnon propre et heureux avec des soins réguliers.',
      colorTheme: 'fuchsia-blue'
    },
    {
      icon: '💤',
      title: 'Dormir',
      description: "Veillez sur le sommeil de votre créature pour qu'elle récupère.",
      colorTheme: 'moccaccino'
    }
  ]

  return (
    <section id='actions' className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Que pouvez-vous faire ?</h2>
          <p className='text-lg text-gray-600'>Interagissez avec votre créature de multiples façons pour créer un lien unique.</p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </section>
  )
}
