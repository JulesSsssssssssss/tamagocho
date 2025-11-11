'use client'

import { useCreatureData } from '@/hooks/use-creature-data'
import CreatureLoadingState from './creature-loading-state'
import CreatureErrorState from './creature-error-state'
import CreatureNotFoundState from './creature-not-found-state'
import CreatureDetail from './creature-detail'
import type { DBMonster } from '@/shared/types/monster'

/**
 * Props du composant CreatureContent
 */
interface CreatureContentProps {
  /** ID de la créature à afficher */
  creatureId: string
  /** Données initiales pré-chargées côté serveur (optimisation) */
  initialCreature?: DBMonster
}

/**
 * Composant client pour la page créature
 *
 * Responsabilités (SRP) :
 * - Gestion du chargement des données via hook
 * - Gestion des différents états (loading, error, success)
 * - Rendu conditionnel selon l'état
 *
 * Architecture (DIP - Dependency Inversion) :
 * - Dépend de l'abstraction useCreatureData
 * - Implémentation du hook modifiable sans impact
 *
 * Optimisation :
 * - Accepte initialCreature pour affichage instantané
 * - Évite le chargement initial si les données sont pré-chargées
 *
 * États gérés :
 * - Loading : CreatureLoadingState
 * - Error : CreatureErrorState
 * - Not Found : CreatureNotFoundState
 * - Success : CreatureDetail
 *
 * @param {CreatureContentProps} props - Props du composant
 * @returns {React.ReactNode} Contenu de la page créature
 *
 * @example
 * ```tsx
 * // Dans app/creature/[id]/page.tsx
 * const creature = await getMonsterById(params.id[0])
 * return <CreatureContent creatureId={params.id[0]} initialCreature={creature} />
 * ```
 */
export function CreatureContent ({ creatureId, initialCreature }: CreatureContentProps): React.ReactNode {
  // Hook pour le chargement des données (SRP)
  const { creature, isLoading, error, refresh } = useCreatureData(creatureId, initialCreature)

  // État de chargement
  if (isLoading) {
    return <CreatureLoadingState />
  }

  // État d'erreur
  if (error !== null) {
    return <CreatureErrorState message={error} onRetry={refresh} />
  }

  // État "créature introuvable"
  if (creature === null) {
    return <CreatureNotFoundState />
  }

  // État de succès : affichage de la créature avec polling automatique
  return <CreatureDetail creature={creature} />
}

export default CreatureContent
