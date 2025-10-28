'use client'

import { memo, useState, useTransition } from 'react'
import { feedMonster, playWithMonster, sleepMonster, cleanMonster } from '@/actions/monsters/monsters.actions'

/**
 * Props du composant CreatureActions
 */
interface CreatureActionsProps {
  /** ID du monstre pour les actions */
  creatureId: string
  /** Callback appelé après une action réussie */
  onActionComplete?: () => void
}

/**
 * Composant des boutons d'interaction avec un monstre
 * 
 * Responsabilités (SRP) :
 * - Affichage des 4 boutons d'action (feed, play, sleep, clean)
 * - Gestion des états de chargement par action
 * - Appel des server actions
 * - Feedback visuel sur les interactions
 * 
 * Architecture (DIP) :
 * - Dépend des abstractions (server actions injectées)
 * - Callback onActionComplete pour notifier le parent
 * 
 * Optimisation :
 * - Composant mémoïsé avec React.memo
 * - useTransition pour des transitions fluides
 * 
 * @param {CreatureActionsProps} props - Props du composant
 * @returns {React.ReactNode} Boutons d'actions
 * 
 * @example
 * ```tsx
 * <CreatureActions 
 *   creatureId={monster._id} 
 *   onActionComplete={refresh} 
 * />
 * ```
 */
const CreatureActions = memo(function CreatureActions ({
  creatureId,
  onActionComplete
}: CreatureActionsProps): React.ReactNode {
  const [isPending, startTransition] = useTransition()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  /**
   * Exécute une action sur le monstre
   */
  const handleAction = async (
    action: (id: string) => Promise<void>,
    actionName: string
  ): Promise<void> => {
    setLoadingAction(actionName)
    startTransition(async () => {
      try {
        await action(creatureId)
        onActionComplete?.()
      } catch (error) {
        console.error(`Error executing ${actionName}:`, error)
      } finally {
        setLoadingAction(null)
      }
    })
  }

  /**
   * Composant de bouton d'action
   */
  const ActionButton = ({
    emoji,
    label,
    action,
    actionName,
    colorClass
  }: {
    emoji: string
    label: string
    action: (id: string) => Promise<void>
    actionName: string
    colorClass: string
  }): React.ReactNode => {
    const isLoading = loadingAction === actionName

    return (
      <button
        onClick={() => { void handleAction(action, actionName) }}
        disabled={isPending}
        className={`group relative flex flex-col items-center gap-3 rounded-2xl ${colorClass} p-4 shadow-lg ring-1 ring-white/70 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        aria-label={label}
      >
        {/* Emoji */}
        <span className='text-4xl transform transition-transform duration-300 group-hover:scale-110' aria-hidden='true'>
          {isLoading ? '⏳' : emoji}
        </span>
        
        {/* Label */}
        <span className='text-sm font-semibold text-slate-700'>
          {isLoading ? 'Chargement...' : label}
        </span>

        {/* Effet de brillance au hover */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </button>
    )
  }

  return (
    <div className='bg-white rounded-3xl p-6 shadow-lg ring-1 ring-white/80'>
      <h3 className='text-lg font-semibold text-slate-900 mb-5'>
        🎮 Interactions
      </h3>

      {/* Grille de boutons */}
      <div className='grid grid-cols-2 gap-4'>
        <ActionButton
          emoji='🍖'
          label='Nourrir'
          action={feedMonster}
          actionName='feed'
          colorClass='bg-gradient-to-br from-moccaccino-100 to-moccaccino-50'
        />
        
        <ActionButton
          emoji='🎾'
          label='Jouer'
          action={playWithMonster}
          actionName='play'
          colorClass='bg-gradient-to-br from-fuchsia-blue-100 to-fuchsia-blue-50'
        />
        
        <ActionButton
          emoji='😴'
          label='Dormir'
          action={sleepMonster}
          actionName='sleep'
          colorClass='bg-gradient-to-br from-lochinvar-100 to-lochinvar-50'
        />
        
        <ActionButton
          emoji='🧼'
          label='Nettoyer'
          action={cleanMonster}
          actionName='clean'
          colorClass='bg-gradient-to-br from-slate-100 to-slate-50'
        />
      </div>

      {/* Message d'information */}
      <p className='mt-5 text-xs text-slate-500 text-center'>
        Chaque action modifie les statistiques de ton monstre
      </p>
    </div>
  )
})

export default CreatureActions
