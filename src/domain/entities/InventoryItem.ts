/**
 * Entité InventoryItem du Domain Layer
 *
 * Responsabilités (SRP):
 * - Représentation métier d'un item dans l'inventaire d'une créature
 * - Gestion de l'état équipé/non équipé
 * - Règles métier de l'inventaire
 *
 * IMPORTANT: Chaque item est rattaché à UNE créature spécifique (monsterId)
 *
 * Indépendant de:
 * - La base de données
 * - Le framework (Next.js)
 * - L'infrastructure
 */

import type { IInventoryItemProps } from '@/shared/types/shop'

/**
 * Classe InventoryItem - Entité du domaine
 */
export class InventoryItem {
  private readonly _id: string
  private readonly _itemId: string
  private readonly _monsterId: string
  private readonly _ownerId: string
  private readonly _purchasedAt: Date
  private _isEquipped: boolean

  constructor (props: IInventoryItemProps) {
    this._id = props.id
    this._itemId = props.itemId
    this._monsterId = props.monsterId
    this._ownerId = props.ownerId
    this._purchasedAt = props.purchasedAt
    this._isEquipped = props.isEquipped

    this.validate()
  }

  // Getters
  get id (): string { return this._id }
  get itemId (): string { return this._itemId }
  get monsterId (): string { return this._monsterId }
  get ownerId (): string { return this._ownerId }
  get purchasedAt (): Date { return this._purchasedAt }
  get isEquipped (): boolean { return this._isEquipped }

  /**
   * Validation des règles métier
   */
  private validate (): void {
    if (this._itemId === '' || this._ownerId === '' || this._monsterId === '') {
      throw new Error('ItemId, OwnerId and MonsterId are required')
    }

    if (this._purchasedAt > new Date()) {
      throw new Error('Purchase date cannot be in the future')
    }
  }

  /**
   * Équiper l'item
   */
  public equip (): void {
    this._isEquipped = true
  }

  /**
   * Déséquiper l'item
   */
  public unequip (): void {
    this._isEquipped = false
  }

  /**
   * Basculer l'état équipé/non équipé
   */
  public toggleEquipped (): void {
    this._isEquipped = !this._isEquipped
  }

  /**
   * Convertit l'entité en objet simple pour la persistance
   */
  public toObject (): IInventoryItemProps {
    return {
      id: this._id,
      itemId: this._itemId,
      monsterId: this._monsterId,
      ownerId: this._ownerId,
      purchasedAt: this._purchasedAt,
      isEquipped: this._isEquipped
    }
  }

  /**
   * Factory method pour créer un nouvel item d'inventaire
   */
  public static create (
    id: string,
    itemId: string,
    monsterId: string,
    ownerId: string
  ): InventoryItem {
    return new InventoryItem({
      id,
      itemId,
      monsterId,
      ownerId,
      purchasedAt: new Date(),
      isEquipped: false
    })
  }
}

/**
 * Classe Inventory - Agrégat pour gérer la collection d'items d'une créature
 */
export class Inventory {
  private readonly _monsterId: string
  private readonly _ownerId: string
  private readonly _items: Map<string, InventoryItem>

  // Constantes métier
  public static readonly MAX_ITEMS_PER_CATEGORY = 50
  public static readonly MAX_TOTAL_ITEMS = 150

  constructor (monsterId: string, ownerId: string, items: InventoryItem[] = []) {
    this._monsterId = monsterId
    this._ownerId = ownerId
    this._items = new Map()

    items.forEach(item => {
      this._items.set(item.id, item)
    })

    this.validate()
  }

  // Getters
  get monsterId (): string { return this._monsterId }
  get ownerId (): string { return this._ownerId }
  get itemCount (): number { return this._items.size }

  /**
   * Validation de l'inventaire
   */
  private validate (): void {
    if (this._items.size > Inventory.MAX_TOTAL_ITEMS) {
      throw new Error(`Inventory cannot exceed ${Inventory.MAX_TOTAL_ITEMS} items`)
    }
  }

  /**
   * Ajouter un item à l'inventaire
   */
  public addItem (item: InventoryItem): void {
    if (this._items.size >= Inventory.MAX_TOTAL_ITEMS) {
      throw new Error('Inventory is full')
    }

    if (this._items.has(item.id)) {
      throw new Error('Item already exists in inventory')
    }

    if (item.ownerId !== this._ownerId) {
      throw new Error('Item does not belong to this inventory owner')
    }

    if (item.monsterId !== this._monsterId) {
      throw new Error('Item does not belong to this monster')
    }

    this._items.set(item.id, item)
  }

  /**
   * Retirer un item de l'inventaire
   */
  public removeItem (itemId: string): void {
    if (!this._items.has(itemId)) {
      throw new Error('Item not found in inventory')
    }

    this._items.delete(itemId)
  }

  /**
   * Obtenir un item spécifique
   */
  public getItem (itemId: string): InventoryItem | undefined {
    return this._items.get(itemId)
  }

  /**
   * Obtenir tous les items
   */
  public getAllItems (): InventoryItem[] {
    return Array.from(this._items.values())
  }

  /**
   * Obtenir les items équipés
   */
  public getEquippedItems (): InventoryItem[] {
    return this.getAllItems().filter(item => item.isEquipped)
  }

  /**
   * Vérifier si un item existe dans l'inventaire
   */
  public hasItem (itemId: string): boolean {
    return this._items.has(itemId)
  }

  /**
   * Vérifier si le joueur possède un item spécifique du shop
   */
  public ownsShopItem (shopItemId: string): boolean {
    return this.getAllItems().some(item => item.itemId === shopItemId)
  }

  /**
   * Équiper un item et déséquiper les autres de la même catégorie
   * (Un seul item de chaque type peut être équipé en même temps)
   */
  public equipItem (itemId: string): void {
    const item = this._items.get(itemId)
    if (item === undefined) {
      throw new Error('Item not found in inventory')
    }

    item.equip()
  }

  /**
   * Déséquiper un item
   */
  public unequipItem (itemId: string): void {
    const item = this._items.get(itemId)
    if (item === undefined) {
      throw new Error('Item not found in inventory')
    }

    item.unequip()
  }
}
