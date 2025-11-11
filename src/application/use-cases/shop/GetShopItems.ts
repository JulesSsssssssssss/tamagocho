/**
 * Use Case: GetShopItems - Application Layer
 *
 * Responsabilités (SRP):
 * - Récupérer les items de la boutique
 * - Filtrer par catégorie ou rareté
 * - Formater les données pour la présentation
 *
 * Principe DIP:
 * - Dépend de l'abstraction IShopRepository
 */

import type { IShopRepository } from '@/domain/repositories/IShopRepository'
import type { ShopItem } from '@/domain/entities/ShopItem'
import type { ItemCategory, ItemRarity, BackgroundType } from '@/shared/types/shop'

/**
 * DTO pour filtrer les items
 */
export interface GetShopItemsFilter {
  category?: ItemCategory
  rarity?: ItemRarity
  availableOnly?: boolean
}

/**
 * DTO pour l'output
 */
export interface ShopItemDTO {
  id: string
  name: string
  description: string
  category: ItemCategory
  rarity: ItemRarity
  price: number
  imageUrl?: string
  isAvailable: boolean
  backgroundType?: BackgroundType
}

/**
 * Use Case: Récupérer les items de la boutique
 */
export class GetShopItemsUseCase {
  constructor (
    private readonly shopRepository: IShopRepository
  ) {}

  /**
   * Récupérer tous les items disponibles
   */
  async execute (filter?: GetShopItemsFilter): Promise<ShopItemDTO[]> {
    let items: ShopItem[]

    // Appliquer les filtres
    if (filter?.category !== undefined) {
      items = await this.shopRepository.findItemsByCategory(filter.category)
    } else if (filter?.rarity !== undefined) {
      items = await this.shopRepository.findItemsByRarity(filter.rarity)
    } else {
      items = await this.shopRepository.findAllAvailableItems()
    }

    // Filtrer par disponibilité si demandé
    if (filter?.availableOnly === true) {
      items = items.filter(item => item.isAvailable)
    }

    // Convertir en DTO
    return items.map(item => this.toDTO(item))
  }

  /**
   * Récupérer un item spécifique
   */
  async getById (itemId: string): Promise<ShopItemDTO | null> {
    const item = await this.shopRepository.findItemById(itemId)
    return item !== null ? this.toDTO(item) : null
  }

  /**
   * Convertir une entité ShopItem en DTO
   */
  private toDTO (item: ShopItem): ShopItemDTO {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      backgroundType: item.backgroundType
    }
  }
}
