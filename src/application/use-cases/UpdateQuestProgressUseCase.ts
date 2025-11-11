import { type IQuestRepository } from '@/domain/repositories/IQuestRepository'
import { type Quest, type QuestType } from '@/domain/entities/Quest'

/**
 * Use Case: Mettre à jour la progression d'une quête
 *
 * Principe SRP:
 * - Responsabilité unique: incrémenter la progression
 *
 * Principe DIP:
 * - Dépend de l'abstraction IQuestRepository
 * - Ne dépend pas de l'implémentation concrète
 */
export class UpdateQuestProgressUseCase {
  constructor (
    private readonly questRepository: IQuestRepository
  ) {}

  /**
   * Mettre à jour la progression d'une quête spécifique
   */
  async execute (
    userId: string,
    questType: QuestType,
    incrementBy: number = 1
  ): Promise<Quest | null> {
    if (userId === '' || userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    if (incrementBy <= 0 || !Number.isInteger(incrementBy)) {
      throw new Error('Increment must be a positive integer')
    }

    // Récupérer les quêtes actives de l'utilisateur
    const activeQuests = await this.questRepository.findActiveQuestsByUserId(userId)

    // Trouver la quête correspondante au type
    const questToUpdate = activeQuests.find(q => q.type === questType && q.status === 'ACTIVE')

    if (questToUpdate === undefined) {
      // Aucune quête de ce type n'est active
      return null
    }

    // Incrémenter la progression
    questToUpdate.incrementProgress(incrementBy)

    // Sauvegarder la quête mise à jour
    const updatedQuest = await this.questRepository.update(questToUpdate)

    return updatedQuest
  }

  /**
   * Mettre à jour la progression de toutes les quêtes actives d'un utilisateur
   * qui correspondent au type donné
   */
  async executeForAllMatching (
    userId: string,
    questType: QuestType,
    incrementBy: number = 1
  ): Promise<Quest[]> {
    if (userId === '' || userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    if (incrementBy <= 0 || !Number.isInteger(incrementBy)) {
      throw new Error('Increment must be a positive integer')
    }

    // Récupérer les quêtes actives de l'utilisateur
    const activeQuests = await this.questRepository.findActiveQuestsByUserId(userId)

    // Trouver toutes les quêtes correspondantes au type
    const questsToUpdate = activeQuests.filter(q => q.type === questType && q.status === 'ACTIVE')

    const updatedQuests: Quest[] = []

    for (const quest of questsToUpdate) {
      // Incrémenter la progression
      quest.incrementProgress(incrementBy)

      // Sauvegarder la quête mise à jour
      const updatedQuest = await this.questRepository.update(quest)
      updatedQuests.push(updatedQuest)
    }

    return updatedQuests
  }
}
