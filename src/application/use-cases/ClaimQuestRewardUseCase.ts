import { type IQuestRepository } from '@/domain/repositories/IQuestRepository'
import { type IWalletRepository, type ITransactionRepository } from '@/domain/repositories/IWalletRepository'
import { type Quest } from '@/domain/entities/Quest'

/**
 * Use Case: Réclamer les récompenses d'une quête complétée
 *
 * Principe SRP:
 * - Responsabilité unique: gérer la réclamation des récompenses
 *
 * Principe DIP:
 * - Dépend des abstractions IQuestRepository, IWalletRepository, ITransactionRepository
 * - Ne dépend pas des implémentations concrètes
 *
 * Principe OCP:
 * - Ouvert à l'extension (nouveaux types de récompenses)
 * - Fermé à la modification
 */
export class ClaimQuestRewardUseCase {
  constructor (
    private readonly questRepository: IQuestRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  /**
   * Réclamer la récompense d'une quête
   * @returns Le montant de la récompense réclamée
   */
  async execute (questId: string, userId: string): Promise<{ reward: number, quest: Quest }> {
    if (questId === '' || questId.trim() === '') {
      throw new Error('Quest ID cannot be empty')
    }

    if (userId === '' || userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    // Récupérer la quête
    const quest = await this.questRepository.findById(questId)

    if (quest === null) {
      throw new Error('Quest not found')
    }

    // Vérifier que la quête appartient à l'utilisateur
    if (quest.userId !== userId) {
      throw new Error('Quest does not belong to this user')
    }

    // Vérifier que la quête peut être réclamée
    if (!quest.canBeClaimed()) {
      throw new Error('Quest cannot be claimed. Must be completed and not expired.')
    }

    // Réclamer la récompense (cela change le statut de la quête)
    const reward = quest.claim()

    // Mettre à jour la quête dans la base de données
    const updatedQuest = await this.questRepository.update(quest)

    // Ajouter les Koins au wallet de l'utilisateur
    const wallet = await this.walletRepository.findByOwnerId(userId)

    if (wallet === null) {
      throw new Error('Wallet not found for user')
    }

    wallet.addCoins(reward)
    await this.walletRepository.update(wallet)

    // Créer une transaction
    await this.transactionRepository.create(
      wallet.id,
      'EARN',
      reward,
      'QUEST_REWARD',
      `Récompense pour la quête: ${quest.description}`,
      {
        questId: quest.id,
        questType: quest.type
      }
    )

    return {
      reward,
      quest: updatedQuest
    }
  }
}
