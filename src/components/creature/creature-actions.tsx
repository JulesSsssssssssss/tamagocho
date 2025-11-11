'use client'

import { memo, useState } from 'react'
import { feedMonster, playWithMonster, sleepMonster, cleanMonster, type MonsterActionResult } from '@/actions/monsters/monsters.actions'
import { toast } from 'react-toastify'
import CoinsToast from '@/components/coins-toast'
import { useQuestProgress } from '@/hooks/use-quest-progress'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Props du composant CreatureActions
 */
interface CreatureActionsProps {
  /** ID du monstre pour les actions */
  creatureId: string
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
 * Optimisation :
 * - Composant mémoïsé avec React.memo
 * - Actions optimistes : pas d'attente de la réponse
 * - Le polling parent récupère automatiquement les nouvelles données
 *
 * @param {CreatureActionsProps} props - Props du composant
 * @returns {React.ReactNode} Boutons d'actions
 *
 * @example
 * ```tsx
 * <CreatureActions creatureId={monster._id} />
 * ```
 */
const CreatureActions = memo(function CreatureActions ({
  creatureId
}: CreatureActionsProps): React.ReactNode {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { trackFeedMonster, trackPlay, trackSleep, trackClean, trackInteract } = useQuestProgress()

  /**
   * Exécute une action sur le monstre de manière optimiste
   * Le polling parent récupérera automatiquement les nouvelles données
   */
  const handleAction = async (
    action: (id: string) => Promise<MonsterActionResult>,
    actionName: string
  ): Promise<void> => {
    setLoadingAction(actionName)
    try {
      // Appeler l'action et attendre le résultat
      const result = await action(creatureId)

      console.log('🎮 Action result:', result)

      if (result.success && result.coinsEarned !== undefined) {
        // Tracker la progression des quêtes selon l'action
        trackInteract() // Toutes les actions comptent comme une interaction

        if (actionName === 'feed') {
          trackFeedMonster()
        } else if (actionName === 'play') {
          trackPlay()
        } else if (actionName === 'sleep') {
          trackSleep()
        } else if (actionName === 'clean') {
          trackClean()
        }

        // Afficher un toast de succès avec les coins gagnés
        toast.success(
          <CoinsToast
            coinsEarned={result.coinsEarned}
            newBalance={result.newBalance}
          />,
          {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
            style: {
              background: 'transparent',
              padding: 0,
              border: '4px solid #facc15',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(250, 204, 21, 0.4), inset 0 0 20px rgba(250, 204, 21, 0.1)',
              fontFamily: 'monospace',
              imageRendering: 'pixelated' as any
            },
            progressStyle: {
              background: 'linear-gradient(to right, #fbbf24, #facc15, #fde047)',
              height: '6px',
              imageRendering: 'pixelated' as any
            }
          }
        )
      } else if (!result.success) {
        // Afficher un toast d'erreur
        toast.error(
          `❌ Erreur : ${result.error ?? 'Action échouée'}`,
          {
            position: 'top-right',
            autoClose: 3000,
            theme: 'dark'
          }
        )
      }

      // Réinitialiser après 2.5s (temps de l'animation)
      setTimeout(() => {
        setLoadingAction(null)
      }, 2500)
    } catch (error) {
      console.error(`❌ Error executing ${actionName}:`, error)
      toast.error(
        '❌ Erreur lors de l\'action',
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark'
        }
      )
      setLoadingAction(null)
    }
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
    action: (id: string) => Promise<MonsterActionResult>
    actionName: string
    colorClass: string
  }): React.ReactNode => {
    const isLoading = loadingAction === actionName

    return (
      <button
        onClick={() => { void handleAction(action, actionName) }}
        disabled={loadingAction !== null}
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
