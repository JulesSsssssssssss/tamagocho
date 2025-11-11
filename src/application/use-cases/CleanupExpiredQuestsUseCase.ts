import { type IQuestRepository } from '@/domain/repositories/IQuestRepository'

/**
 * Use Case: Nettoyer les quêtes expirées
 *
 * Principe SRP:
 * - Responsabilité unique: supprimer les quêtes expirées
 *
 * Principe DIP:
 * - Dépend de l'abstraction IQuestRepository
 */
export class CleanupExpiredQuestsUseCase {
  constructor (
    private readonly questRepository: IQuestRepository
  ) {}

  /**
   * Supprimer toutes les quêtes expirées de tous les utilisateurs
   * @returns Nombre de quêtes supprimées
   */
  async execute (): Promise<number> {
    const deletedCount = await this.questRepository.deleteAllExpiredQuests()
    return deletedCount
  }

  /**
   * Supprimer les quêtes expirées d'un utilisateur spécifique
   */
  async executeForUser (userId: string): Promise<number> {
    if (userId === '' || userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    const deletedCount = await this.questRepository.deleteExpiredQuests(userId)
    return deletedCount
  }
}
