/**
 * Hook personnalisé pour mettre à jour automatiquement les quêtes
 *
 * Responsabilités (SRP):
 * - Détecter les actions utilisateur
 * - Mettre à jour la progression des quêtes correspondantes
 * - Communiquer avec l'API
 *
 * Principe OCP:
 * - Extensible pour de nouveaux types de quêtes
 * - Ne nécessite pas de modification pour ajouter des actions
 */

'use client'

import { useCallback } from 'react'
import { type QuestType } from '@/domain/entities/Quest'

interface UseQuestProgressOptions {
  onProgressUpdate?: () => void
}

export function useQuestProgress ({ onProgressUpdate }: UseQuestProgressOptions = {}) {
  /**
   * Mettre à jour la progression d'un type de quête
   */
  const updateQuestProgress = useCallback(async (
    questType: QuestType,
    incrementBy: number = 1
  ): Promise<void> => {
    try {
      const response = await fetch('/api/quests/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questType, incrementBy })
      })

      if (response.ok && onProgressUpdate !== undefined) {
        onProgressUpdate()
      }
    } catch (error) {
      console.error('Error updating quest progress:', error)
    }
  }, [onProgressUpdate])

  /**
   * Helpers pour chaque type d'action
   */
  const trackFeedMonster = useCallback(() => {
    void updateQuestProgress('FEED_MONSTER', 1)
  }, [updateQuestProgress])

  const trackLevelUp = useCallback(() => {
    void updateQuestProgress('LEVEL_UP_MONSTER', 1)
  }, [updateQuestProgress])

  const trackInteract = useCallback(() => {
    void updateQuestProgress('INTERACT_MONSTERS', 1)
  }, [updateQuestProgress])

  const trackBuyItem = useCallback(() => {
    void updateQuestProgress('BUY_ITEM', 1)
  }, [updateQuestProgress])

  const trackMakePublic = useCallback(() => {
    void updateQuestProgress('MAKE_MONSTER_PUBLIC', 1)
  }, [updateQuestProgress])

  const trackPlay = useCallback(() => {
    void updateQuestProgress('PLAY_WITH_MONSTER', 1)
  }, [updateQuestProgress])

  const trackSleep = useCallback(() => {
    void updateQuestProgress('SLEEP_MONSTER', 1)
  }, [updateQuestProgress])

  const trackClean = useCallback(() => {
    void updateQuestProgress('CLEAN_MONSTER', 1)
  }, [updateQuestProgress])

  const trackVisitGallery = useCallback(() => {
    void updateQuestProgress('VISIT_GALLERY', 1)
  }, [updateQuestProgress])

  const trackEquipItem = useCallback(() => {
    void updateQuestProgress('EQUIP_ITEM', 1)
  }, [updateQuestProgress])

  return {
    updateQuestProgress,
    trackFeedMonster,
    trackLevelUp,
    trackInteract,
    trackBuyItem,
    trackMakePublic,
    trackPlay,
    trackSleep,
    trackClean,
    trackVisitGallery,
    trackEquipItem
  }
}
