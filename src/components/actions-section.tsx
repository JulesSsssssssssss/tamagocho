import { memo } from 'react'
import type { ActionCardProps } from '@/shared/types/components'

function getActionColorClasses (colorTheme: ActionCardProps['colorTheme']): string {
  const colorMaps: Record<ActionCardProps['colorTheme'], string> = {
    moccaccino: 'bg-yellow-500/10 dark:bg-yellow-500/10 text-yellow-400 dark:text-yellow-300 border-yellow-500 dark:border-yellow-600',
    lochinvar: 'bg-blue-500/10 dark:bg-blue-500/10 text-blue-400 dark:text-blue-300 border-blue-500 dark:border-blue-600',
    'fuchsia-blue': 'bg-purple-500/10 dark:bg-purple-500/10 text-purple-400 dark:text-purple-300 border-purple-500 dark:border-purple-600'
  }

  return colorMaps[colorTheme]
}

/**
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 */
export const ActionCard = memo(function ActionCard ({ icon, title, description, colorTheme }: ActionCardProps): React.ReactNode {
  const colorClass = getActionColorClasses(colorTheme)

  return (
    <article className={`flex flex-col items-center gap-4 text-center rounded-xl border-4 bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:-translate-y-1 ${colorClass}`} style={{ imageRendering: 'pixelated' }}>
      <div className={`flex size-20 items-center justify-center rounded-xl border-3 text-3xl ${colorClass}`} style={{ imageRendering: 'pixelated' }}>
        {icon}
      </div>
      <h3 className='text-lg font-semibold text-white'>{title}</h3>
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
const ActionsSection = memo(function ActionsSection (): React.ReactNode {
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
    <section id='actions' className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 transition-colors duration-300 overflow-hidden'>
      {/* Effet de grille pixel-art */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50' />

      {/* Particules décoratives */}
      <div className='absolute top-10 left-20 w-3 h-3 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-10 right-20 w-4 h-4 bg-blue-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-white' style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}>
            Que pouvez-vous faire ? 🎮
          </h2>
          <p className='text-lg text-gray-300'>
            Interagissez avec votre créature de multiples façons pour créer un lien unique.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default ActionsSection
