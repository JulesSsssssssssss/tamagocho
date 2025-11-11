import { memo } from 'react'
import type { MonsterCardProps } from '@/shared/types/components'

/**
 * MonsterCard - Carte de monstre avec style pixel art gaming
 *
 * Design System:
 * - Bordures: border-4 border-yellow-500 avec glow
 * - Background: gradient slate-800/purple-900 avec backdrop-blur
 * - Pixel corners: 2x2px yellow-400
 * - Emoji: text-6xl avec hover:scale-110
 * - Effets: hover:scale-105, shadow glow, imageRendering: 'pixelated'
 * - Typographie: font-mono pour le nom
 *
 * Responsabilités (SRP):
 * - Affichage d'une carte de monstre
 * - Gestion du hover avec animations
 *
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 *
 * @param {MonsterCardProps} props - Emoji, name, personality
 * @returns {React.ReactNode} Carte monstre pixel art
 */
export const MonsterCard = memo(function MonsterCard ({ emoji, name, personality }: MonsterCardProps): React.ReactNode {
  return (
    <article
      className='relative flex flex-col items-center gap-4 rounded-xl border-4 border-yellow-500/50 bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:scale-105 hover:border-yellow-500 hover:-translate-y-2 group'
      style={{
        imageRendering: 'pixelated',
        boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)'
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
          boxShadow: '0 0 30px rgba(234, 179, 8, 0.5), inset 0 0 20px rgba(234, 179, 8, 0.3)'
        }}
      />

      {/* Emoji avec animation hover */}
      <span className='relative text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]'>
        {emoji}
      </span>

      {/* Infos monstre */}
      <div className='relative space-y-1'>
        <h3 className='text-xl font-bold text-yellow-400 font-mono tracking-wider uppercase'>
          {name}
        </h3>
        <p className='text-gray-300 font-mono text-sm'>
          {personality}
        </p>
      </div>
    </article>
  )
}, (prevProps, nextProps) =>
  prevProps.emoji === nextProps.emoji &&
  prevProps.name === nextProps.name &&
  prevProps.personality === nextProps.personality
)

/**
 * MonstersSection - Section des monstres avec thème pixel art
 *
 * Design System:
 * - Gradient: from-slate-800 via-purple-900 to-slate-800
 * - Grille pixel art en background
 * - Particules pixelisées décoratives avec animations
 * - Grid responsive 1/2/4 colonnes
 * - Titre avec glow effect et font-mono
 *
 * Responsabilités (SRP):
 * - Affichage des monstres disponibles
 * - Composition des MonsterCard
 *
 * Optimisation : Mémoïsé avec React.memo (props statiques)
 *
 * @returns {React.ReactNode} Section monstres pixel art
 */
const MonstersSection = memo(function MonstersSection (): React.ReactNode {
  const monsters: MonsterCardProps[] = [
    {
      emoji: '🐱',
      name: 'Miaou',
      personality: 'Joueuse et affectueuse'
    },
    {
      emoji: '🐶',
      name: 'Woufy',
      personality: 'Loyal et énergique'
    },
    {
      emoji: '🐰',
      name: 'Lapinou',
      personality: 'Doux et curieux'
    },
    {
      emoji: '🐼',
      name: 'Pandou',
      personality: 'Calme et sage'
    }
  ]

  return (
    <section
      id='monsters'
      className='relative bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 py-20 overflow-hidden'
    >
      {/* Grille pixel-art en arrière-plan */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30'
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Particules décoratives pixel-art */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-20 right-10 w-4 h-4 bg-yellow-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute bottom-20 left-10 w-3 h-3 bg-purple-400/30 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400/20 rounded-sm animate-pulse'
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
            RENCONTREZ VOS FUTURS COMPAGNONS 🐾
          </h2>
          <p className='text-lg text-gray-300 font-mono'>
            Chaque créature possède sa propre <span className='text-yellow-400 font-bold'>personnalité</span> et des <span className='text-purple-400 font-bold'>besoins spécifiques</span>
          </p>
        </div>

        {/* Grid des monstres */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {monsters.map((monster) => (
            <MonsterCard key={monster.name} {...monster} />
          ))}
        </div>
      </div>
    </section>
  )
})

export default MonstersSection
