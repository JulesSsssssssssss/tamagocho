'use client'

import { useState } from 'react'
import { feedMonster, playWithMonster, sleepMonster, cleanMonster } from '@/actions/monsters/monsters.actions'
import { Button } from '@/components/ui/button'

interface TamagotchiActionsProps {
  monsterId: string
  onActionComplete?: () => void
  isAlive: boolean
}

export function TamagotchiActions ({ monsterId, onActionComplete, isAlive }: TamagotchiActionsProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (action: () => Promise<void>, actionName: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await action()
      onActionComplete?.()
    } catch (err) {
      setError(`Erreur lors de ${actionName}: ${err instanceof Error ? err.message : 'erreur inconnue'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAlive) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <p className='text-red-700 font-semibold'>Votre monstre est mort 😭</p>
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-2 gap-2 mb-4'>
        <Button
          onClick={async () => await handleAction(async () => await feedMonster(monsterId), 'l\'alimentation')}
          disabled={isLoading}
          variant='default'
          className='w-full'
        >
          🍖 Nourrir
        </Button>
        <Button
          onClick={async () => await handleAction(async () => await playWithMonster(monsterId), 'du jeu')}
          disabled={isLoading}
          variant='default'
          className='w-full'
        >
          🎮 Jouer
        </Button>
        <Button
          onClick={async () => await handleAction(async () => await sleepMonster(monsterId), 'du repos')}
          disabled={isLoading}
          variant='default'
          className='w-full'
        >
          😴 Dormir
        </Button>
        <Button
          onClick={async () => await handleAction(async () => await cleanMonster(monsterId), 'du nettoyage')}
          disabled={isLoading}
          variant='default'
          className='w-full'
        >
          🧼 Nettoyer
        </Button>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}
    </div>
  )
}
