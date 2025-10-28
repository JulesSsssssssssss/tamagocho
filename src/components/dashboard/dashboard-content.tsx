'use client'

import { authClient } from '@/lib/auth-client'
import { MonstersList } from '@/components/monsters/monsters-list'
import type { DBMonster } from '@/shared/types/monster'
import CreateMonsterModal from './create-monster-modal'
import DashboardHeader from './dashboard-header'
import DashboardActions from './dashboard-actions'
import { useMonsterCreation } from '@/hooks/use-monster-creation'
import { useLogout } from '@/hooks/use-logout'
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
 * 
 * Architecture (DIP - Dependency Inversion) :
 * - Dépend des abstractions (hooks) plutôt que des implémentations
 * - Les hooks encapsulent la logique métier
 * 
 * Optimisation :
 * - Utilisation de hooks mémoïsés pour éviter les re-renders
 * - Sous-composants mémoïsés avec React.memo
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
  // Hook pour la gestion de création de monstre (SRP)
  const { isModalOpen, isPending, openModal, closeModal, handleSubmit } = useMonsterCreation()
  
  // Hook pour la gestion de déconnexion (SRP)
  const { logout } = useLogout()
  
  // Hook pour la transformation des données (SRP)
  const monstersList = useMonsterTransform(monsters)

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-8 px-4'>
      {/* En-tête avec message de bienvenue */}
      <DashboardHeader userEmail={session.user.email} />

      {/* Actions principales (créer/déconnecter) */}
      <DashboardActions
        onCreateMonster={openModal}
        onLogout={logout}
        isDisabled={isPending}
      />

      {/* Liste des monstres ou état vide */}
      <MonstersList monsters={monstersList} />

      {/* Modal de création de monstre */}
      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default DashboardContent

