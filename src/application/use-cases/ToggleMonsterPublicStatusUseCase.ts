/**
 * Use Case: Toggle Monster Public Status
 *
 * Responsabilités (SRP):
 * - Basculer le statut public/privé d'un monstre
 * - Valider que l'utilisateur est propriétaire du monstre (sécurité)
 * - Persister le changement en base de données
 *
 * Principe DIP:
 * - Dépend de l'abstraction ITamagotchiRepository
 * - Injecté via constructeur (Dependency Injection)
 *
 * Règles métier:
 * - Seul le propriétaire peut modifier le statut
 * - Le monstre doit exister
 * - Le statut peut être true (public) ou false (privé)
 */

import type { Tamagotchi, ITamagotchiRepository } from '@/domain'

export class ToggleMonsterPublicStatusUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  /**
   * Bascule le statut public d'un monstre
   *
   * @param monsterId - ID du monstre à modifier
   * @param userId - ID de l'utilisateur demandant le changement
   * @param isPublic - Nouveau statut (true = public, false = privé)
   * @returns Le monstre mis à jour
   * @throws Error si le monstre n'existe pas ou si l'utilisateur n'est pas propriétaire
   */
  async execute (monsterId: string, userId: string, isPublic: boolean): Promise<Tamagotchi> {
    // Validation: Le monstre existe
    const tamagotchi = await this.repository.findById(monsterId)
    if (tamagotchi == null) {
      throw new Error('Monster not found')
    }

    // Validation: L'utilisateur est propriétaire (Sécurité)
    if (tamagotchi.getOwnerId() !== userId) {
      throw new Error('Unauthorized: You are not the owner of this monster')
    }

    // Mise à jour du statut public
    tamagotchi.togglePublicStatus(isPublic)

    // Persistence
    return await this.repository.update(tamagotchi)
  }
}
