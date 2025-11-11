'use client'

import { useEffect, useState } from 'react'
import { getMonsterById } from '@/actions/monsters/monsters.actions'
import { TamagotchiStats, TamagotchiInfo, TamagotchiActions } from '@/components/tamagotchi'
import { PixelMonster } from '@/components/monsters'
import { DEFAULT_MONSTER_STATE, DEFAULT_MONSTER_TRAITS, type MonsterState, type MonsterTraits } from '@/shared/types/monster'

interface TamagotchiDetailProps {
  monsterId: string
}

export function TamagotchiDetail ({ monsterId }: TamagotchiDetailProps): React.ReactNode {
  const [monster, setMonster] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMonster = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMonsterById(monsterId)
      setMonster(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMonster()
  }, [monsterId])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-600'>Chargement...</p>
      </div>
    )
  }

  if (error || !monster) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <p className='text-red-700'>{error || 'Monstre introuvable'}</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <TamagotchiInfo
        name={monster.name}
        level={monster.level}
        experience={monster.experience}
      />

      <div className='flex justify-center rounded-3xl border border-moccaccino-100 bg-white/80 p-6 shadow-inner'>
        <PixelMonster
          traits={(monster.traits as MonsterTraits | undefined) ?? DEFAULT_MONSTER_TRAITS}
          state={(monster.state as MonsterState | undefined) ?? DEFAULT_MONSTER_STATE}
        />
      </div>

      <TamagotchiStats stats={monster.stats} />

      <TamagotchiActions
        monsterId={monsterId}
        onActionComplete={loadMonster}
        isAlive={!monster.isDead}
      />
    </div>
  )
}
