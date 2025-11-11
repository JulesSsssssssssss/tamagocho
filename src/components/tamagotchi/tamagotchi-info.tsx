'use client'

interface TamagotchiInfoProps {
  name: string
  level: number
  experience: number
}

export function TamagotchiInfo ({ name, level, experience }: TamagotchiInfoProps): React.ReactNode {
  const nextLevelExp = level * 50
  const expPercent = (experience / nextLevelExp) * 100

  return (
    <div className='bg-white rounded-lg p-4 border border-gray-200'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>{name}</h2>
          <p className='text-gray-600'>Niveau {level}</p>
        </div>
      </div>

      <div className='mt-4'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-sm text-gray-600'>Expérience</span>
          <span className='text-sm font-medium text-gray-700'>
            {experience} / {nextLevelExp}
          </span>
        </div>
        <div className='bg-gray-200 rounded-full h-2'>
          <div
            className='bg-green-500 h-2 rounded-full transition-all duration-300'
            style={{ width: `${Math.min(100, expPercent)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
