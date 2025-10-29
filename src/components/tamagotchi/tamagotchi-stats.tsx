'use client'

import type { ITamagotchiStats } from '@/domain'

interface TamagotchiStatsProps {
  stats: ITamagotchiStats
}

export function TamagotchiStats ({ stats }: TamagotchiStatsProps): React.ReactNode {
  return (
    <div className='bg-white rounded-lg p-4 border border-gray-200'>
      <h3 className='font-semibold text-gray-900 mb-4'>Statistiques</h3>
      <div className='space-y-3'>
        <StatBar label='Santé' value={stats.health} color='bg-red-500' />
        <StatBar label='Faim' value={100 - stats.hunger} color='bg-orange-500' />
        <StatBar label='Bonheur' value={stats.happiness} color='bg-yellow-500' />
        <StatBar label='Énergie' value={stats.energy} color='bg-blue-500' />
      </div>
    </div>
  )
}

interface StatBarProps {
  label: string
  value: number
  color: string
}

function StatBar ({ label, value, color }: StatBarProps): React.ReactNode {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-sm text-gray-600'>{label}</span>
      <div className='flex-1 mx-2 bg-gray-200 rounded-full h-2'>
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className='text-sm font-medium text-gray-700'>{Math.round(value)}%</span>
    </div>
  )
}
