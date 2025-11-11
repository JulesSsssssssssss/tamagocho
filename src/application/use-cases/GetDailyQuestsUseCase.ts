import { type IQuestRepository } from '@/domain/repositories/IQuestRepository'
import { Quest } from '@/domain/entities/Quest'

/**
 * Use Case: Récupérer les quêtes journalières actives d'un utilisateur
 *
 * Principe SRP:
 * - Responsabilité unique: récupérer les quêtes du jour
 *
 * Principe DIP:
 * - Dépend de l'abstraction IQuestRepository
 * - Ne dépend pas de l'implémentation concrète
 */
export class GetDailyQuestsUseCase {
  constructor (
    private readonly questRepository: IQuestRepository
  ) {}

  /**
   * Récupérer les 3 quêtes journalières de l'utilisateur
   * Si elles n'existent pas, les créer automatiquement
   */
  async execute (userId: string): Promise<Quest[]> {
    if (userId === '' || userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    // Nettoyer d'abord les quêtes expirées de cet utilisateur
    await this.questRepository.deleteExpiredQuests(userId)

    // Vérifier si l'utilisateur a déjà ses quêtes du jour
    const activeQuests = await this.questRepository.findActiveQuestsByUserId(userId)

    // Si l'utilisateur a déjà 3 quêtes (actives, complétées ou réclamées) du jour, les retourner
    if (activeQuests.length >= Quest.MAX_DAILY_QUESTS) {
      return activeQuests.slice(0, Quest.MAX_DAILY_QUESTS)
    }

    // Si moins de 3 quêtes, c'est qu'elles ont expiré
    // Supprimer les anciennes et générer de nouvelles quêtes
    if (activeQuests.length > 0) {
      // Supprimer toutes les quêtes restantes de l'utilisateur
      for (const quest of activeQuests) {
        await this.questRepository.delete(quest.id)
      }
    }

    // Générer 3 nouvelles quêtes
    const questConfigs = Quest.getRandomUniqueConfigs()
    const newQuests: Quest[] = []

    for (const config of questConfigs) {
      const quest = Quest.createFromConfig(userId, config)
      const createdQuest = await this.questRepository.create(quest)
      newQuests.push(createdQuest)
    }

    return newQuests
  }
}
