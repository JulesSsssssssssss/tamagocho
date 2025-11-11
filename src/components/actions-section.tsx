import { memo } from 'react'
import type { ActionCardProps } from '@/shared/types/components'

/**
 * Retourne les classes CSS pour le thème pixel art des actions
 * Simplifié avec glow effects cohérents
 */
function getActionColorClasses (colorTheme: ActionCardProps['colorTheme']): {
  glowColor: string
  iconGradient: string
  textColor: string
} {
  const colorMaps: Record<ActionCardProps['colorTheme'], {
    glowColor: string
    iconGradient: string
    textColor: string
  }> = {
    moccaccino: {
      glowColor: 'rgba(234, 179, 8, 0.4)',
      iconGradient: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-400'
    },
    lochinvar: {
      glowColor: 'rgba(37, 99, 235, 0.4)',
      iconGradient: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400'
    },
    'fuchsia-blue': {
      glowColor: 'rgba(168, 85, 247, 0.4)',
      iconGradient: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-400'
    }
  }

  return colorMaps[colorTheme]
}

/**
 * ActionCard - Carte d'action avec style pixel art gaming
 *
 * Design System:
 * - Bordures: border-4 border-yellow-500 avec glow
 * - Background: gradient slate-800/purple-900 avec backdrop-blur
 * - Pixel corners: 2x2px yellow-400
 * - Icon: text-4xl avec gradient background et border-4
 * - Effets: hover:scale-105, shadow glow, imageRendering: 'pixelated'
 * - Typographie: font-mono pour le titre
 *
 * Responsabilités (SRP):
 * - Affichage d'une carte d'action
 * - Gestion du hover avec animations
 *
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 *
 * @param {ActionCardProps} props - Icon, title, description, colorTheme
 * @returns {React.ReactNode} Carte action pixel art
 */
export const ActionCard = memo(function ActionCard ({ icon, title, description, colorTheme }: ActionCardProps): React.ReactNode {
  const colors = getActionColorClasses(colorTheme)

  return (
    <article
      className='relative flex flex-col items-center gap-4 text-center rounded-xl border-4 border-yellow-500/50 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-sm p-8 transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:-translate-y-2 group'
      style={{
        imageRendering: 'pixelated',
        boxShadow: `0 0 20px ${colors.glowColor}`
      }}
    >
      {/* Pixel corners */}
      <div className='absolute top-0 left-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-0 right-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 left-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 right-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

      {/* Glow effect on hover */}
      <div
        className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
        style={{
          boxShadow: `0 0 30px ${colors.glowColor}, inset 0 0 20px ${colors.glowColor}`
        }}
      />

      {/* Icon avec gradient et border */}
      <div
        className={`relative flex size-20 items-center justify-center rounded-xl border-4 border-yellow-400/60 text-4xl bg-gradient-to-br ${colors.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        style={{
          imageRendering: 'pixelated',
          boxShadow: `0 0 15px ${colors.glowColor}`
        }}
      >
        {icon}
      </div>

      {/* Titre avec font-mono */}
      <h3 className={`text-xl font-bold ${colors.textColor} font-mono tracking-wider uppercase`}>
        {title}
      </h3>

      {/* Description */}
      <p className='text-gray-300 leading-relaxed font-mono text-sm'>
        {description}
      </p>
    </article>
  )
}, (prevProps, nextProps) =>
  prevProps.icon === nextProps.icon &&
  prevProps.title === nextProps.title &&
  prevProps.description === nextProps.description &&
  prevProps.colorTheme === nextProps.colorTheme
)

/**
 * ActionsSection - Section des actions avec thème pixel art
 *
 * Design System:
 * - Gradient: from-slate-900 via-purple-900 to-slate-900
 * - Grille pixel art en background
 * - Particules pixelisées décoratives
 * - Grid responsive 1/2/4 colonnes
 * - Titre avec glow effect et font-mono
 *
 * Responsabilités (SRP):
 * - Affichage des actions disponibles
 * - Composition des ActionCard
 *
 * Optimisation : Mémoïsé avec React.memo (props statiques)
 *
 * @returns {React.ReactNode} Section actions pixel art
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
    <section
      id='actions'
      className='relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 overflow-hidden'
    >
      {/* Grille pixel-art en arrière-plan */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30'
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Particules décoratives pixel-art */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-10 left-20 w-3 h-3 bg-yellow-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute bottom-10 right-20 w-4 h-4 bg-purple-400/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-400/30 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1s' }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header avec style pixel art */}
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2
            className='text-3xl md:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight'
            style={{
              textShadow: '0 0 30px rgba(234, 179, 8, 0.5), 0 0 60px rgba(234, 179, 8, 0.3)',
              imageRendering: 'pixelated'
            }}
          >
            QUE POUVEZ-VOUS FAIRE ? 🎮
          </h2>
          <p className='text-lg text-gray-300 font-mono'>
            Interagissez avec votre créature de <span className='text-yellow-400 font-bold'>multiples façons</span> pour créer un <span className='text-purple-400 font-bold'>lien unique</span>
          </p>
        </div>

        {/* Grid des actions */}
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
