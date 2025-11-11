/**
 * Use Case: Get Public Monsters
 *
 * Responsabilités (SRP):
 * - Récupérer les monstres publics avec filtres
 * - Appliquer la pagination
 * - Retourner les données formatées pour la galerie
 *
 * Principe DIP:
 * - Dépend de l'abstraction ITamagotchiRepository
 * - Injecté via constructeur (Dependency Injection)
 *
 * Règles métier:
 * - Seuls les monstres avec isPublic=true sont visibles
 * - Pagination par défaut: 12 par page
 * - Tri par défaut: date de création DESC (plus récents en premier)
 */

import type { ITamagotchiRepository } from '@/domain'
import type { GalleryFilters, PaginationParams, PublicMonster, GalleryResponse } from '@/shared/types/gallery'

export class GetPublicMonstersUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  /**
   * Récupère les monstres publics avec filtres et pagination
   *
   * @param filters - Filtres optionnels (niveau, état, tri)
   * @param pagination - Paramètres de pagination
   * @returns Réponse galerie avec monstres et métadonnées pagination
   */
  async execute (
    filters: GalleryFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<GalleryResponse> {
    // Récupération des monstres publics enrichis depuis le repository
    const { monsters: enrichedMonsters, total } = await this.repository.findPublicMonsters(filters, pagination)

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(total / pagination.limit)
    const hasMore = pagination.page < totalPages

    // Transformation en format galerie (DTO)
    const publicMonsters: PublicMonster[] = enrichedMonsters.map(enriched => this.toPublicMonster(enriched))

    return {
      monsters: publicMonsters,
      total,
      page: pagination.page,
      limit: pagination.limit,
      hasMore,
      totalPages
    }
  }

  /**
   * Transforme un EnrichedMonster en PublicMonster (DTO)
   * Retire les données sensibles et formate pour l'affichage
   *
   * @param enriched - Monstre enrichi avec items équipés
   * @returns DTO PublicMonster pour galerie
   */
  private toPublicMonster (enriched: any): PublicMonster {
    const { tamagotchi, equippedItems, equippedBackground } = enriched

    return {
      id: tamagotchi.getId(),
      name: tamagotchi.getName(),
      level: tamagotchi.getLevel(),
      state: tamagotchi.getState(),
      traits: JSON.stringify(tamagotchi.getTraits()),
      equippedItems,
      equippedBackground,
      creatorName: 'Anonyme', // Sera remplacé par le vrai nom depuis User
      createdAt: tamagotchi.getCreatedAt()
    }
  }
}
