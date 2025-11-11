/**
 * Contenu de la page des quêtes (Client Component)
 *
 * Responsabilités (SRP):
 * - Afficher les quêtes en grand format
 * - Statistiques et progression globale
 * - Historique des quêtes complétées
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import QuestRewardToast from '@/components/quest-reward-toast'
import 'react-toastify/dist/ReactToastify.css'

interface QuestData {
  id: string
  type: string
  description: string
  target: number
  progress: number
  reward: number
  status: 'ACTIVE' | 'COMPLETED' | 'CLAIMED'
  assignedAt: string
  completedAt?: string
  claimedAt?: string
  expiresAt: string
  progressDetails?: Record<string, number>
}

/**
 * Calcule le pourcentage de progression
 */
function getProgressPercentage (progress: number, target: number): number {
  return Math.min(Math.round((progress / target) * 100), 100)
}

/**
 * Récupère l'emoji selon le type de quête
 */
function getQuestEmoji (type: string): string {
  const emojiMap: Record<string, string> = {
    FEED_MONSTER: '🍖',
    LEVEL_UP_MONSTER: '⭐',
    INTERACT_MONSTERS: '👥',
    BUY_ITEM: '🛒',
    MAKE_MONSTER_PUBLIC: '🌍',
    PLAY_WITH_MONSTER: '🎾',
    SLEEP_MONSTER: '💤',
    CLEAN_MONSTER: '🧼',
    VISIT_GALLERY: '🖼️',
    EQUIP_ITEM: '👔'
  }
  return emojiMap[type] ?? '🎯'
}

/**
 * Récupère la route et le texte du bouton selon le type de quête
 */
function getQuestActionButton (type: string): { route: string, label: string } | null {
  const actionMap: Record<string, { route: string, label: string }> = {
    FEED_MONSTER: { route: '/dashboard', label: '🍖 Nourrir' },
    PLAY_WITH_MONSTER: { route: '/dashboard', label: '🎾 Jouer' },
    SLEEP_MONSTER: { route: '/dashboard', label: '💤 Dormir' },
    CLEAN_MONSTER: { route: '/dashboard', label: '🧼 Nettoyer' },
    LEVEL_UP_MONSTER: { route: '/dashboard', label: '⭐ Faire monter de niveau' },
    INTERACT_MONSTERS: { route: '/dashboard', label: '👥 Interagir' },
    MAKE_MONSTER_PUBLIC: { route: '/dashboard', label: '🌍 Rendre public' },
    BUY_ITEM: { route: '/shop', label: '🛒 Acheter' },
    EQUIP_ITEM: { route: '/inventory', label: '👔 Équiper' },
    VISIT_GALLERY: { route: '/gallery', label: '🖼️ Visiter' }
  }
  return actionMap[type] ?? null
}

export default function QuestsPageContent (): React.ReactElement {
  const router = useRouter()
  const [quests, setQuests] = useState<QuestData[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  /**
   * Charger les quêtes depuis l'API
   */
  const loadQuests = async (): Promise<void> => {
    try {
      const response = await fetch('/api/quests')
      const data = await response.json()

      if (data.success === true) {
        setQuests(data.data.quests)
      }
    } catch (error) {
      console.error('Error loading quests:', error)
      toast.error('Erreur lors du chargement des quêtes')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Réclamer une récompense
   */
  const handleClaimReward = async (questId: string): Promise<void> => {
    setClaiming(questId)

    try {
      const response = await fetch(`/api/quests/${questId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (data.success === true) {
        const completedQuest = quests.find(q => q.id === questId)

        toast.success(
          <QuestRewardToast
            coinsEarned={data.data.reward}
            newBalance={data.data.newBalance}
            questTitle={completedQuest?.description}
          />,
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: 'dark',
            closeButton: false,
            style: {
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
              margin: '0 auto',
              width: '100%',
              maxWidth: '480px',
              top: '20px'
            },
            bodyStyle: {
              padding: 0,
              margin: 0
            }
          }
        )

        await loadQuests()
      } else {
        toast.error(data.error ?? 'Impossible de réclamer la récompense')
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
      toast.error('Erreur lors de la réclamation')
    } finally {
      setClaiming(null)
    }
  }

  // Charger les quêtes au montage
  useEffect(() => {
    void loadQuests()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400' />
      </div>
    )
  }

  const activeQuests = quests.filter(q => q.status === 'ACTIVE')
  const completedQuests = quests.filter(q => q.status === 'COMPLETED')
  const claimedQuests = quests.filter(q => q.status === 'CLAIMED')

  return (
    <div className='space-y-8'>
      {/* Statistiques du jour */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-slate-800/60 rounded-xl p-6 border border-yellow-500/20'>
          <div className='flex items-center gap-3'>
            <div className='text-4xl'>📊</div>
            <div>
              <p className='text-slate-400 text-sm font-mono'>PROGRESSION</p>
              <p className='text-2xl font-black text-white font-mono'>
                {claimedQuests.length}/{quests.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-slate-800/60 rounded-xl p-6 border border-green-500/20'>
          <div className='flex items-center gap-3'>
            <div className='text-4xl'>💰</div>
            <div>
              <p className='text-slate-400 text-sm font-mono'>COINS GAGNÉS</p>
              <p className='text-2xl font-black text-green-400 font-mono'>
                {claimedQuests.reduce((sum, q) => sum + q.reward, 0)} TC
              </p>
            </div>
          </div>
        </div>

        <div className='bg-slate-800/60 rounded-xl p-6 border border-purple-500/20'>
          <div className='flex items-center gap-3'>
            <div className='text-4xl'>✨</div>
            <div>
              <p className='text-slate-400 text-sm font-mono'>EN ATTENTE</p>
              <p className='text-2xl font-black text-purple-400 font-mono'>
                {completedQuests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quêtes actives */}
      {activeQuests.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-black text-white font-mono tracking-wider'>
            🎯 QUÊTES EN COURS
          </h2>
          <div className='grid grid-cols-1 gap-4'>
            {activeQuests.map((quest) => {
              const percentage = getProgressPercentage(quest.progress, quest.target)
              const emoji = getQuestEmoji(quest.type)

              const actionButton = getQuestActionButton(quest.type)

              return (
                <div
                  key={quest.id}
                  className='bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-3'>
                        <span className='text-4xl'>{emoji}</span>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold text-white font-mono'>
                            {quest.description}
                          </h3>
                          <p className='text-sm text-slate-400 font-mono'>
                            {quest.progress}/{quest.target} complétés
                          </p>
                        </div>
                        {actionButton != null && (
                          <button
                            onClick={() => { router.push(actionButton.route) }}
                            className='px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold font-mono text-sm rounded-lg transition-all duration-300 active:scale-95 border-2 border-yellow-300 shadow-lg hover:shadow-yellow-500/50'
                          >
                            {actionButton.label}
                          </button>
                        )}
                      </div>

                      {/* Barre de progression */}
                      <div className='relative h-3 bg-slate-700/50 rounded-full overflow-hidden'>
                        <div
                          className='absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500 ease-out'
                          style={{ width: `${percentage}%` }}
                        />
                        {percentage === 100 && (
                          <div className='absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 animate-pulse' />
                        )}
                      </div>

                      <div className='flex items-center justify-between mt-2'>
                        <span className='text-xs text-slate-500 font-mono'>
                          {percentage}%
                        </span>
                        <span className='text-sm text-yellow-400 font-bold font-mono'>
                          +{quest.reward} TC
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quêtes complétées (à réclamer) */}
      {completedQuests.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-black text-green-400 font-mono tracking-wider animate-pulse'>
            ✅ QUÊTES COMPLÉTÉES - À RÉCLAMER !
          </h2>
          <div className='grid grid-cols-1 gap-4'>
            {completedQuests.map((quest) => {
              const emoji = getQuestEmoji(quest.type)
              const isClaiming = claiming === quest.id

              return (
                <div
                  key={quest.id}
                  className='bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-xl p-6 border-2 border-green-500/50 animate-glow-green'
                >
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                      <span className='text-5xl animate-bounce'>{emoji}</span>
                      <div>
                        <h3 className='text-xl font-black text-white font-mono'>
                          {quest.description}
                        </h3>
                        <p className='text-green-300 font-mono font-bold text-lg mt-1'>
                          Récompense: +{quest.reward} TC 💰
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => { void handleClaimReward(quest.id) }}
                      disabled={isClaiming}
                      className='px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-white font-black font-mono text-lg rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 hover:shadow-green-500/80'
                    >
                      {isClaiming
                        ? (
                          <span className='flex items-center gap-2'>
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
                            CLAIM...
                          </span>
                          )
                        : (
                            'CLAIM 💰'
                          )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quêtes réclamées */}
      {claimedQuests.length > 0 && (
        <div className='space-y-4'>
          <h2 className='text-2xl font-black text-slate-400 font-mono tracking-wider'>
            ✔️ RÉCLAMÉES AUJOURD'HUI
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {claimedQuests.map((quest) => {
              const emoji = getQuestEmoji(quest.type)

              return (
                <div
                  key={quest.id}
                  className='bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 opacity-70'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-3xl opacity-50'>{emoji}</span>
                    <div className='flex-1'>
                      <h3 className='text-sm font-bold text-slate-300 font-mono'>
                        {quest.description}
                      </h3>
                      <p className='text-xs text-green-400 font-mono mt-1'>
                        ✅ +{quest.reward} TC réclamés
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Message si toutes les quêtes sont terminées */}
      {quests.length > 0 && activeQuests.length === 0 && completedQuests.length === 0 && claimedQuests.length > 0 && (
        <div className='text-center py-16 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl border-2 border-green-500/30'>
          <div className='text-7xl mb-6 animate-bounce'>🎉</div>
          <h2 className='text-3xl font-black text-white font-mono mb-3 tracking-wider'>
            TOUTES LES QUÊTES TERMINÉES !
          </h2>
          <p className='text-green-400 text-lg font-bold font-mono mb-6'>
            Bravo ! Tu as complété toutes tes quêtes du jour !
          </p>
          <div className='bg-slate-900/60 rounded-xl p-6 max-w-md mx-auto border-2 border-green-500/50'>
            <div className='flex items-center justify-center gap-3 mb-3'>
              <span className='text-5xl'>💰</span>
              <div>
                <p className='text-2xl font-black text-yellow-400 font-mono'>
                  +{claimedQuests.reduce((sum, q) => sum + q.reward, 0)} TC
                </p>
                <p className='text-sm text-slate-400 font-mono'>
                  Total gagné aujourd'hui
                </p>
              </div>
            </div>
          </div>
          <div className='mt-8 space-y-2'>
            <p className='text-slate-300 font-mono text-lg'>
              ⏰ Nouvelles quêtes disponibles à minuit
            </p>
            <p className='text-slate-500 font-mono text-sm'>
              Reviens demain pour gagner encore plus de Tamacoins !
            </p>
          </div>
        </div>
      )}

      {/* Message si aucune quête */}
      {quests.length === 0 && (
        <div className='text-center py-20'>
          <div className='text-6xl mb-4'>🎯</div>
          <h2 className='text-2xl font-black text-white font-mono mb-2'>
            Aucune quête disponible
          </h2>
          <p className='text-slate-400 font-mono'>
            Reviens à minuit pour de nouvelles quêtes !
          </p>
        </div>
      )}

      {/* Info expiration */}
      {quests.length > 0 && (activeQuests.length > 0 || completedQuests.length > 0) && (
        <div className='bg-slate-800/40 rounded-xl p-4 border border-yellow-500/20 text-center'>
          <p className='text-sm text-slate-400 font-mono'>
            ⏰ Les quêtes se renouvellent chaque jour à minuit
          </p>
        </div>
      )}
    </div>
  )
}
