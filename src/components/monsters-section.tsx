import type { MonsterCardProps } from '@/shared/types/components'

export function MonsterCard ({ emoji, name, personality }: MonsterCardProps): React.ReactNode {
  return (
    <article className='flex flex-col items-center gap-4 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md'>
      <span className='text-5xl'>{emoji}</span>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>{name}</h3>
        <p className='text-gray-600'>{personality}</p>
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
    <section id='monsters' className='bg-lochinvar-50 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Rencontrez vos futurs compagnons</h2>
          <p className='text-lg text-gray-600'>Chaque créature possède sa propre personnalité et des besoins spécifiques.</p>
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
