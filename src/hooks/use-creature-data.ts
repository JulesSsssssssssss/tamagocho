import { useState, useEffect, useCallback } from 'react'
import { getMonsterById } from '@/actions/monsters/monsters.actions'
import type { DBMonster } from '@/shared/types/monster'

/**
 * État de chargement des données d'une créature
 */
interface CreatureDataState {
  /** Données de la créature */
  creature: DBMonster | null
  /** Indique si le chargement est en cours */
  isLoading: boolean
  /** Message d'erreur éventuel */
  error: string | null
}

/**
 * Hook personnalisé pour gérer le chargement des données d'une créature
 *
 * Responsabilités (SRP) :
 * - Chargement des données depuis le serveur
 * - Gestion des états (loading, error, success)
 * - Rafraîchissement des données
 *
 * Optimisation :
 * - Accepte initialCreature pour éviter le chargement initial
 * - Affichage instantané si les données sont pré-chargées
 *
 * @param {string} creatureId - ID de la créature à charger
 * @param {DBMonster} [initialCreature] - Données pré-chargées (optionnel)
 * @returns {Object} État et fonction de rafraîchissement
 * @property {DBMonster | null} creature - Données de la créature
 * @property {boolean} isLoading - Indique si le chargement est en cours
 * @property {string | null} error - Message d'erreur éventuel
 * @property {Function} refresh - Fonction pour rafraîchir les données
 *
 * @example
 * ```tsx
 * // Avec données pré-chargées (rapide)
 * const { creature, refresh } = useCreatureData('monster-123', initialData)
 *
 * // Sans données (chargement côté client)
 * const { creature, isLoading, error, refresh } = useCreatureData('monster-123')
 * ```
 */
export function useCreatureData (creatureId: string, initialCreature?: DBMonster): {
  creature: DBMonster | null
  isLoading: boolean
  error: string | null
  refresh: () => void
} {
  const [state, setState] = useState<CreatureDataState>({
    creature: initialCreature ?? null,
    isLoading: initialCreature == null, // Pas de chargement si données initiales
    error: null
  })

  /**
   * Charge les données de la créature depuis le serveur
   * Gère les états de chargement et d'erreur
   */
  const loadCreature = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const data = await getMonsterById(creatureId)

      if (data === null) {
        setState({
          creature: null,
          isLoading: false,
          error: 'Créature introuvable'
        })
        return
      }

      setState({
        creature: data,
        isLoading: false,
        error: null
      })
    } catch (err) {
      setState({
        creature: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erreur lors du chargement'
      })
    }
  }, [creatureId])

  /**
   * Rafraîchit les données de la créature
   * Peut être appelé après une action utilisateur
   */
  const refresh = useCallback(() => {
    void loadCreature()
  }, [loadCreature])

  // Chargement initial uniquement si pas de données initiales
  useEffect(() => {
    if (initialCreature == null) {
      void loadCreature()
    }
  }, [loadCreature, initialCreature])

  return {
    creature: state.creature,
    isLoading: state.isLoading,
    error: state.error,
    refresh
  }
}
