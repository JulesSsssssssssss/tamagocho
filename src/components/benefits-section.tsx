import { memo } from 'react'
import type { BenefitCardProps } from '@/shared/types/components'

/**
 * Retourne les classes CSS pour le thème pixel art
 * Simplifié pour correspondre au thème principal yellow-400/500
 */
function getColorClasses (colorTheme: BenefitCardProps['colorTheme']): {
  glowColor: string
  iconGradient: string
} {
  const colorMaps: Record<BenefitCardProps['colorTheme'], {
    glowColor: string
    iconGradient: string
  }> = {
    moccaccino: {
      glowColor: 'rgba(234, 179, 8, 0.4)',
      iconGradient: 'from-yellow-500 to-yellow-600'
    },
    lochinvar: {
      glowColor: 'rgba(37, 99, 235, 0.4)',
      iconGradient: 'from-blue-500 to-blue-600'
    },
    'fuchsia-blue': {
      glowColor: 'rgba(168, 85, 247, 0.4)',
      iconGradient: 'from-purple-500 to-purple-600'
    }
  }

  return colorMaps[colorTheme]
}

/**
 * BenefitCard - Carte de bénéfice avec style pixel art gaming
 *
 * Design System:
 * - Bordures: border-4 border-yellow-500 avec glow
 * - Background: backdrop-blur-sm avec gradient slate-800/purple-900
 * - Pixel corners: 2x2px yellow-400 en absolute positioning
 * - Effets: hover:scale-105, shadow glow, imageRendering: 'pixelated'
 * - Typographie: font-mono pour titre
 *
 * Responsabilités (SRP):
 * - Affichage d'une carte de bénéfice
 * - Gestion du hover avec animations
 *
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 *
 * @param {BenefitCardProps} props - Icon, title, description, colorTheme
 * @returns {React.ReactNode} Carte pixel art
 */
export const BenefitCard = memo(function BenefitCard ({ icon, title, description, colorTheme }: BenefitCardProps): React.ReactNode {
  const colors = getColorClasses(colorTheme)

  return (
    <article
      className='relative flex flex-col items-center text-center gap-4 rounded-xl border-4 border-yellow-500/50 bg-slate-800/40 backdrop-blur-sm p-8 transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:-translate-y-2 group'
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
        className={`relative flex size-16 items-center justify-center rounded-xl border-4 border-yellow-400/60 text-3xl bg-gradient-to-br ${colors.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        style={{
          imageRendering: 'pixelated',
          boxShadow: `0 0 15px ${colors.glowColor}`
        }}
      >
        {icon}
      </div>

      {/* Titre avec font-mono */}
      <h3 className='text-xl font-bold text-yellow-400 font-mono tracking-wider uppercase'>
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
 * BenefitsSection - Section des bénéfices avec thème pixel art
 *
 * Design System:
 * - Gradient: from-slate-900 via-purple-900 to-slate-900
 * - Grille pixel art en background
 * - Particules pixelisées décoratives
 * - Titre avec glow effect et font-mono
 *
 * Responsabilités (SRP):
 * - Affichage des bénéfices du jeu
 * - Composition des BenefitCard
 *
 * Optimisation : Mémoïsé avec React.memo (props statiques)
 *
 * @returns {React.ReactNode} Section bénéfices pixel art
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
    <section
      id='benefits'
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
          className='absolute top-20 left-10 w-3 h-3 bg-yellow-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute top-40 right-20 w-4 h-4 bg-purple-400/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute bottom-32 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-sm animate-pulse'
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
            POURQUOI CHOISIR TAMAGOCHO ? 🎯
          </h2>
          <p className='text-lg text-gray-300 font-mono'>
            Une expérience de jeu unique qui mêle <span className='text-yellow-400 font-bold'>nostalgie</span> et <span className='text-purple-400 font-bold'>modernité</span>
          </p>
        </div>

        {/* Grid des bénéfices */}
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
