import { memo } from 'react'
import type { MonsterCardProps } from '@/shared/types/components'

/**
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 */
export const MonsterCard = memo(function MonsterCard ({ emoji, name, personality }: MonsterCardProps): React.ReactNode {
  return (
    <article className='flex flex-col items-center gap-4 rounded-xl border-4 border-yellow-500 dark:border-yellow-600 bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 text-center shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:border-yellow-400 hover:-translate-y-1' style={{ imageRendering: 'pixelated' }}>
      <span className='text-5xl hover:scale-110 transition-transform duration-300'>{emoji}</span>
      <div>
        <h3 className='text-lg font-semibold text-white'>{name}</h3>
        <p className='text-gray-300'>{personality}</p>
      </div>
    </article>
  )
}, (prevProps, nextProps) =>
  prevProps.emoji === nextProps.emoji &&
  prevProps.name === nextProps.name &&
  prevProps.personality === nextProps.personality
)

/**
 * Optimisation : Mémoïsé avec React.memo (props statiques)
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
    <section id='monsters' className='relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 transition-colors duration-300 overflow-hidden'>
      {/* Effet de grille pixel-art */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50' />

      {/* Particules décoratives */}
      <div className='absolute top-20 right-10 w-4 h-4 bg-blue-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-20 left-10 w-3 h-3 bg-purple-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-white' style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}>
            Rencontrez vos futurs compagnons 🐾
          </h2>
          <p className='text-lg text-gray-300'>
            Chaque créature possède sa propre personnalité et des besoins spécifiques.
          </p>
        </div>

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
