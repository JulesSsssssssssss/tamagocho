import type { MonsterCardProps } from '@/shared/types/components'

export function MonsterCard ({ emoji, name, personality }: MonsterCardProps): React.ReactNode {
  return (
    <article className='flex flex-col items-center gap-4 rounded-xl border-4 border-yellow-500 dark:border-yellow-600 bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 text-center shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:border-yellow-400'>
      <span className='text-5xl hover:scale-110 transition-transform duration-300'>{emoji}</span>
      <div>
        <h3 className='text-lg font-semibold text-white'>{name}</h3>
        <p className='text-gray-300'>{personality}</p>
      </div>
    </article>
  )
}

export default function MonstersSection (): React.ReactNode {
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
    <section id='monsters' className='bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 dark:from-blue-950 dark:via-slate-950 dark:to-blue-950 py-20 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-white'>
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
}
