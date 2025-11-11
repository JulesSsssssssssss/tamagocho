/**
 * Entité ShopItem du Domain Layer
 *
 * Responsabilités (SRP):
 * - Représentation métier d'un item de boutique
 * - Règles de validation des items
 * - Calcul du prix selon la rareté
 *
 * Indépendant de:
 * - La base de données
 * - Le framework (Next.js)
 * - L'infrastructure
 */

import type { ItemCategory, ItemRarity, IShopItemProps, BackgroundType } from '@/shared/types/shop'
import { BASE_PRICES, RARITY_PRICE_MULTIPLIER } from '@/shared/types/shop'

/**
 * Classe ShopItem - Entité du domaine
 */
export class ShopItem {
  private readonly _id: string
  private readonly _name: string
  private readonly _description: string
  private readonly _category: ItemCategory
  private readonly _rarity: ItemRarity
  private readonly _price: number
  private readonly _imageUrl?: string
  private _isAvailable: boolean
  private readonly _createdAt: Date
  private readonly _backgroundType?: BackgroundType

  // Constantes métier
  public static readonly MIN_PRICE = 1
  public static readonly MAX_PRICE = 999999
  public static readonly MIN_NAME_LENGTH = 3
  public static readonly MAX_NAME_LENGTH = 50

  constructor (props: IShopItemProps) {
    this._id = props.id
    this._name = props.name
    this._description = props.description
    this._category = props.category
    this._rarity = props.rarity
    this._price = props.price
    this._imageUrl = props.imageUrl
    this._isAvailable = props.isAvailable
    this._createdAt = props.createdAt
    this._backgroundType = props.backgroundType

    this.validate()
  }

  // Getters
  get id (): string { return this._id }
  get name (): string { return this._name }
  get description (): string { return this._description }
  get category (): ItemCategory { return this._category }
  get rarity (): ItemRarity { return this._rarity }
  get price (): number { return this._price }
  get imageUrl (): string | undefined { return this._imageUrl }
  get isAvailable (): boolean { return this._isAvailable }
  get createdAt (): Date { return this._createdAt }
  get backgroundType (): BackgroundType | undefined { return this._backgroundType }

  /**
   * Validation des règles métier
   */
  private validate (): void {
    // Validation du nom
    if (this._name === '' || this._name.trim().length < ShopItem.MIN_NAME_LENGTH) {
      throw new Error(`Item name must be at least ${ShopItem.MIN_NAME_LENGTH} characters`)
    }

    if (this._name.length > ShopItem.MAX_NAME_LENGTH) {
      throw new Error(`Item name cannot exceed ${ShopItem.MAX_NAME_LENGTH} characters`)
    }

    // Validation du prix
    if (!Number.isInteger(this._price)) {
      throw new Error('Item price must be an integer')
    }

    if (this._price < ShopItem.MIN_PRICE) {
      throw new Error(`Item price must be at least ${ShopItem.MIN_PRICE} TC`)
    }

    if (this._price > ShopItem.MAX_PRICE) {
      throw new Error(`Item price cannot exceed ${ShopItem.MAX_PRICE} TC`)
    }

    // Validation de la description
    if (this._description === '' || this._description.trim().length === 0) {
      throw new Error('Item description is required')
    }
  }

  /**
   * Calcule le prix selon la catégorie et la rareté
   * Méthode statique - Factory pattern
   */
  public static calculatePrice (category: ItemCategory, rarity: ItemRarity): number {
    const basePrice = BASE_PRICES[category]
    const multiplier = RARITY_PRICE_MULTIPLIER[rarity]
    return Math.floor(basePrice * multiplier)
  }

  /**
   * Rendre l'item disponible à l'achat
   */
  public makeAvailable (): void {
    this._isAvailable = true
  }

  /**
   * Rendre l'item indisponible à l'achat
   */
  public makeUnavailable (): void {
    this._isAvailable = false
  }

  /**
   * Vérifie si l'item peut être acheté
   */
  public canBePurchased (): boolean {
    return this._isAvailable
  }

  /**
   * Convertit l'entité en objet simple pour la persistance
   */
  public toObject (): IShopItemProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      category: this._category,
      rarity: this._rarity,
      price: this._price,
      imageUrl: this._imageUrl,
      isAvailable: this._isAvailable,
      createdAt: this._createdAt,
      backgroundType: this._backgroundType
    }
  }

  /**
   * Factory method pour créer un nouvel item
   */
  public static create (
    id: string,
    name: string,
    description: string,
    category: ItemCategory,
    rarity: ItemRarity,
    imageUrl?: string
  ): ShopItem {
    const price = ShopItem.calculatePrice(category, rarity)

    return new ShopItem({
      id,
      name,
      description,
      category,
      rarity,
      price,
      imageUrl,
      isAvailable: true,
      createdAt: new Date()
    })
  }
}
