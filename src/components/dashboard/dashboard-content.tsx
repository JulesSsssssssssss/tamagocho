'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { createMonster } from '@/actions/monsters.actions'
import { getPlayerData } from '@/actions/player.actions'
import type { CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'
import type { DBMonster } from '@/shared/types/monster'
import { MonstersList } from '@/components/monsters/monsters-list'
import CreateMonsterModal from './create-monster-modal'
import DashboardHero from './dashboard-hero'
import DashboardActions from './dashboard-actions'
import { useMonsterTransform } from '@/hooks/use-monster-transform'

/**
 * Type de session inféré depuis BetterAuth client
 */
type Session = typeof authClient.$Infer.Session

/**
 * Props du composant DashboardContent
 */
interface DashboardContentProps {
  /** Session utilisateur courante */
  session: Session
  /** Liste des monstres depuis la base de données */
  monsters: DBMonster[]
}

/**
 * Composant principal du Dashboard
 *
 * Responsabilités (SRP) :
 * - Composition des sous-composants du dashboard
 * - Orchestration des états et callbacks via hooks personnalisés
 * - Transformation des données pour l'affichage
 * - Mise à jour automatique des monstres via polling API
 *
 * Architecture (DIP - Dependency Inversion) :
 * - Dépend des abstractions (hooks) plutôt que des implémentations
 * - Les hooks encapsulent la logique métier
 *
 * Optimisation :
 * - Utilisation de hooks mémoïsés pour éviter les re-renders
 * - Sous-composants mémoïsés avec React.memo
 * - Polling automatique pour synchroniser l'état des monstres
 *
 * @param {DashboardContentProps} props - Props du composant
 * @returns {React.ReactNode} Interface du dashboard
 *
 * @example
 * ```tsx
 * // Dans app/dashboard/page.tsx
 * const session = await auth.api.getSession()
 * const monsters = await getMonsters()
 *
 * return <DashboardContent session={session} monsters={monsters} />
 * ```
 */
function DashboardContent ({ session, monsters }: DashboardContentProps): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monsterList, setMonsterList] = useState<DBMonster[]>(monsters)
  const [playerCoins, setPlayerCoins] = useState<number>(0)
  const [totalMonstersCreated, setTotalMonstersCreated] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  // Hook pour la transformation des données (SRP)
  const monstersList = useMonsterTransform(monsterList)

  // Récupération initiale des données du joueur
  useEffect(() => {
    const fetchPlayerData = async (): Promise<void> => {
      const playerData = await getPlayerData()
      setPlayerCoins(playerData.coins)
      setTotalMonstersCreated(playerData.totalMonstersCreated)
    }

    void fetchPlayerData()
  }, [])

  // Polling automatique pour synchroniser l'état des monstres et les pièces avec la base de données
  useEffect(() => {
    const fetchAndUpdateData = async (): Promise<void> => {
      const [monstersResponse, playerData] = await Promise.all([
        fetch('/api/monsters'),
        getPlayerData()
      ])
      const updatedMonsters = await monstersResponse.json()
      setMonsterList(updatedMonsters)
      setPlayerCoins(playerData.coins)
      setTotalMonstersCreated(playerData.totalMonstersCreated)
    }

    const interval = setInterval(() => {
      void fetchAndUpdateData()
    }, 1000) // Met à jour toutes les 1 seconde

    return () => clearInterval(interval)
  }, [])

  /**
   * Ouvre le modal de création de monstre
   */
  const handleOpenModal = (): void => {
    setIsModalOpen(true)
  }

  /**
   * Ferme le modal de création de monstre
   */
  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   */
  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  /**
   * Soumet le formulaire de création de monstre
   * @param {CreateMonsterFormValues} values - Valeurs du formulaire
   */
  const handleMonsterSubmit = async (values: CreateMonsterFormValues): Promise<void> => {
    try {
      setError(null)
      await createMonster(values)
      window.location.reload()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      console.error('Erreur lors de la création du monstre:', err)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      {/* Effet de grille en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none' />

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Hero section avec affichage des pièces */}
          <DashboardHero userEmail={session.user.email} coins={playerCoins} />

          {/* Affichage des erreurs */}
          {error !== null && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          {/* Actions principales (créer/déconnecter) */}
          <DashboardActions
            onCreateMonster={handleOpenModal}
            onLogout={handleLogout}
            isDisabled={false}
            totalMonstersCreated={totalMonstersCreated}
            playerCoins={playerCoins}
          />

          {/* Liste des monstres ou état vide */}
          <MonstersList monsters={monstersList} />

          {/* Modal de création de monstre */}
          <CreateMonsterModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={(values) => { void handleMonsterSubmit(values) }}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
