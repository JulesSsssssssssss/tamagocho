/**
 * Exemple d'intégration du système de quêtes dans le Dashboard
 *
 * Ce fichier montre comment intégrer le composant DailyQuestsDisplay
 * dans votre page dashboard existante.
 */

'use client'

import { DailyQuestsDisplay } from '@/components/dashboard/daily-quests'
import { useState } from 'react'

/**
 * Exemple de Dashboard avec Quêtes Journalières
 */
export default function DashboardWithQuests (): React.ReactNode {
  const [userBalance, setUserBalance] = useState(100) // Votre état de balance existant

  /**
   * Callback appelé quand une quête est réclamée
   * Permet de mettre à jour le wallet sans recharger
   */
  const handleQuestClaimed = (reward: number): void => {
    setUserBalance(prev => prev + reward)
    console.log(`🎉 Quête réclamée ! +${reward} TC`)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6'>
      {/* Header du Dashboard */}
      <div className='max-w-7xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-4xl font-black text-white font-mono tracking-wider'>
            🎮 DASHBOARD
          </h1>
          <p className='text-slate-400 mt-2'>
            Balance: <span className='text-yellow-400 font-bold'>{userBalance} TC</span>
          </p>
        </header>

        {/* Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Colonne Principale (2/3) */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Vos composants existants */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-slate-700'>
              <h2 className='text-xl font-bold text-white mb-4'>Mes Monstres</h2>
              {/* MonsterList ou autre composant */}
            </div>

            <div className='bg-slate-800/50 rounded-xl p-6 border border-slate-700'>
              <h2 className='text-xl font-bold text-white mb-4'>Statistiques</h2>
              {/* Stats component */}
            </div>
          </div>

          {/* Sidebar (1/3) - Quêtes Journalières */}
          <div className='space-y-6'>
            {/* Section Quêtes */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-slate-700'>
              <DailyQuestsDisplay onQuestClaimed={handleQuestClaimed} />
            </div>

            {/* Autres widgets sidebar */}
            <div className='bg-slate-800/50 rounded-xl p-6 border border-slate-700'>
              <h3 className='text-lg font-bold text-white mb-4'>Activité Récente</h3>
              {/* Activity feed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Alternative: Intégration Minimaliste
 *
 * Si vous voulez juste ajouter les quêtes à votre dashboard existant:
 */
export function MinimalQuestsIntegration (): React.ReactNode {
  return (
    <div className='max-w-2xl mx-auto my-8'>
      <DailyQuestsDisplay />
    </div>
  )
}

/**
 * Alternative: Quêtes dans un Modal/Drawer
 *
 * Si vous préférez afficher les quêtes dans un modal:
 */
export function QuestsModal ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactNode {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
      <div className='relative bg-slate-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]'>
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-white text-2xl'
        >
          ✕
        </button>

        {/* Quêtes */}
        <DailyQuestsDisplay />
      </div>
    </div>
  )
}

/**
 * Conseils d'Intégration:
 *
 * 1. Position Recommandée:
 *    - Sidebar du dashboard (comme ci-dessus)
 *    - Page dédiée /quests
 *    - Modal accessible depuis un bouton "Quêtes"
 *
 * 2. Rafraîchissement:
 *    - Le composant charge automatiquement les quêtes
 *    - Utilisez le callback onQuestClaimed pour mettre à jour l'UI parent
 *    - Pas besoin de gérer le reloading manuellement
 *
 * 3. Responsive Design:
 *    - Le composant est déjà responsive
 *    - Sur mobile, considérez une page dédiée plutôt qu'une sidebar
 *
 * 4. Performance:
 *    - Le composant est optimisé avec useCallback
 *    - Les appels API sont automatiques
 *    - Pas de re-renders inutiles
 */
