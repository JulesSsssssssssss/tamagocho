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
    console.log(`🎯 Action triggered: ${actionName} for creature ${creatureId}`)
    setLoadingAction(actionName)
    startTransition(async () => {
      try {
        console.log(`⏳ Executing action: ${actionName}`)
        await action(creatureId)
        console.log(`✅ Action ${actionName} completed successfully`)
        onActionComplete?.()
      } catch (error) {
        console.error(`❌ Error executing ${actionName}:`, error)
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
        className={`group relative flex flex-col items-center gap-3 rounded-2xl ${colorClass} p-4 shadow-lg ring-1 ring-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-yellow-400/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        aria-label={label}
      >
        {/* Emoji */}
        <span className='text-4xl transform transition-transform duration-300 group-hover:scale-110' aria-hidden='true'>
          {isLoading ? '⏳' : emoji}
        </span>

        {/* Label */}
        <span className='text-sm font-semibold text-white font-mono'>
          {isLoading ? 'Chargement...' : label}
        </span>

        {/* Effet de brillance au hover */}
        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </button>
    )
  }

  return (
    <div className='bg-slate-800/60 rounded-3xl p-6 shadow-lg ring-1 ring-yellow-500/20'>
      <h3 className='text-lg font-semibold text-white mb-5 font-mono tracking-wider'>
        🎮 INTERACTIONS
      </h3>

      {/* Grille de boutons */}
      <div className='grid grid-cols-2 gap-4'>
        <ActionButton
          emoji='🍖'
          label='Nourrir'
          action={feedMonster}
          actionName='feed'
          colorClass='bg-gradient-to-br from-red-900/40 to-red-800/40'
        />

        <ActionButton
          emoji='🎾'
          label='Jouer'
          action={playWithMonster}
          actionName='play'
          colorClass='bg-gradient-to-br from-green-900/40 to-green-800/40'
        />

        <ActionButton
          emoji='😴'
          label='Dormir'
          action={sleepMonster}
          actionName='sleep'
          colorClass='bg-gradient-to-br from-blue-900/40 to-blue-800/40'
        />

        <ActionButton
          emoji='🧼'
          label='Nettoyer'
          action={cleanMonster}
          actionName='clean'
          colorClass='bg-gradient-to-br from-cyan-900/40 to-cyan-800/40'
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
