import { type Quest } from '../entities/Quest'

/**
 * Interface du repository Quest (abstraction)
 *
 * Principe DIP (Dependency Inversion):
 * - Le domain définit l'interface
 * - L'infrastructure l'implémente
 * - Les use cases dépendent de l'interface, pas de l'implémentation
 *
 * Principe ISP (Interface Segregation):
 * - Interface focalisée sur les opérations quêtes uniquement
 *
 * Principe SRP (Single Responsibility):
 * - Responsabilité unique: définir le contrat de persistance des quêtes
 */
export interface IQuestRepository {
  /**
   * Créer une nouvelle quête pour un utilisateur
   */
  create: (quest: Quest) => Promise<Quest>

  /**
   * Récupérer une quête par son ID
   */
  findById: (questId: string) => Promise<Quest | null>

  /**
   * Récupérer toutes les quêtes actives d'un utilisateur pour aujourd'hui
   */
  findActiveQuestsByUserId: (userId: string) => Promise<Quest[]>

  /**
   * Récupérer toutes les quêtes d'un utilisateur (historique)
   */
  findAllQuestsByUserId: (
    userId: string,
    options?: {
      limit?: number
      offset?: number
      includeExpired?: boolean
    }
  ) => Promise<Quest[]>

  /**
   * Mettre à jour une quête
   */
  update: (quest: Quest) => Promise<Quest>

  /**
   * Supprimer une quête (pour cleanup)
   */
  delete: (questId: string) => Promise<void>

  /**
   * Supprimer toutes les quêtes expirées d'un utilisateur
   */
  deleteExpiredQuests: (userId: string) => Promise<number>

  /**
   * Supprimer toutes les quêtes expirées (tous utilisateurs)
   */
  deleteAllExpiredQuests: () => Promise<number>

  /**
   * Vérifier si un utilisateur a déjà ses quêtes du jour
   */
  hasActiveDailyQuests: (userId: string) => Promise<boolean>

  /**
   * Obtenir le nombre de quêtes actives d'un utilisateur
   */
  countActiveQuests: (userId: string) => Promise<number>

  /**
   * Récupérer toutes les quêtes complétées mais non réclamées d'un utilisateur
   */
  findUnclaimedQuests: (userId: string) => Promise<Quest[]>
}
