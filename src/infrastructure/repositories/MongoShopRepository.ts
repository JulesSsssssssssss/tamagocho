/**
 * Implémentation MongoDB des repositories Shop et Inventory
 *
 * Responsabilités (SRP):
 * - Persistence des items de boutique dans MongoDB
 * - Persistence de l'inventaire des joueurs
 *
 * Principe DIP:
 * - Implémente les interfaces définies dans le domain
 */

import type { IShopRepository, IInventoryRepository } from '@/domain/repositories/IShopRepository'
import type { ItemCategory, ItemRarity, BackgroundType } from '@/shared/types/shop'
import { ShopItem } from '@/domain/entities/ShopItem'
import { InventoryItem } from '@/domain/entities/InventoryItem'
import { connectMongooseToDatabase } from '@/db'
import { TEST_SHOP_ITEMS } from '@/shared/data/test-shop-items'
import mongoose, { type Document } from 'mongoose'

/**
 * Interface pour le document MongoDB ShopItem
 */
interface IShopItemDocument extends Document {
  _id: string
  name: string
  description: string
  category: ItemCategory
  rarity: ItemRarity
  price: number
  imageUrl?: string
  backgroundType?: BackgroundType // Pour les fonds d'écran
  isAvailable: boolean
  createdAt: Date
}

/**
 * Interface pour le document MongoDB InventoryItem
 */
interface IInventoryItemDocument extends Document {
  _id: string
  itemId: string
  monsterId: string
  ownerId: string
  purchasedAt: Date
  isEquipped: boolean
}

/**
 * Schéma Mongoose pour ShopItem
 */
const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['hat', 'glasses', 'shoes', 'background'] },
  rarity: { type: String, required: true, enum: ['common', 'rare', 'epic', 'legendary'] },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  backgroundType: { type: String, enum: ['day', 'garden', 'night'] }, // Pour les fonds d'écran
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

/**
 * Schéma Mongoose pour InventoryItem
 */
const inventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, ref: 'ShopItem' },
  monsterId: { type: String, required: true, ref: 'Monster' },
  ownerId: { type: String, required: true },
  purchasedAt: { type: Date, default: Date.now },
  isEquipped: { type: Boolean, default: false }
})

// Index pour optimiser les requêtes
inventoryItemSchema.index({ monsterId: 1 })
inventoryItemSchema.index({ ownerId: 1 })
inventoryItemSchema.index({ itemId: 1, monsterId: 1 })

// Modèles Mongoose
const ShopItemModel = mongoose.models.ShopItem ?? mongoose.model<IShopItemDocument>('ShopItem', shopItemSchema)
const InventoryItemModel = mongoose.models.InventoryItem ?? mongoose.model<IInventoryItemDocument>('InventoryItem', inventoryItemSchema)

/**
 * Repository MongoDB pour la boutique
 */
export class MongoShopRepository implements IShopRepository {
  /**
   * Mapper un document MongoDB vers une entité Domain
   */
  private mapToDomain (doc: IShopItemDocument): ShopItem {
    return new ShopItem({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      category: doc.category,
      rarity: doc.rarity,
      price: doc.price,
      imageUrl: doc.imageUrl,
      backgroundType: doc.backgroundType, // Inclure le backgroundType
      isAvailable: doc.isAvailable,
      createdAt: doc.createdAt
    })
  }

  async findAllAvailableItems (): Promise<ShopItem[]> {
    await connectMongooseToDatabase()
    const docs = await ShopItemModel.find({ isAvailable: true }).sort({ createdAt: -1 })
    return docs.map(doc => this.mapToDomain(doc))
  }

  async findItemById (itemId: string): Promise<ShopItem | null> {
    // Si c'est un item de test, le récupérer depuis les données de test
    if (itemId.startsWith('test_')) {
      const testItem = TEST_SHOP_ITEMS.find(item => item.id === itemId)
      if (testItem !== undefined) {
        return new ShopItem({
          id: testItem.id,
          name: testItem.name,
          description: testItem.description,
          category: testItem.category,
          rarity: testItem.rarity,
          price: testItem.price,
          imageUrl: testItem.imageUrl,
          backgroundType: testItem.backgroundType, // Inclure le backgroundType
          isAvailable: testItem.isAvailable,
          createdAt: new Date()
        })
      }
      return null
    }

    // Sinon, chercher dans MongoDB
    await connectMongooseToDatabase()
    const doc = await ShopItemModel.findById(itemId)
    return doc !== null ? this.mapToDomain(doc) : null
  }

  async findItemsByCategory (category: ItemCategory): Promise<ShopItem[]> {
    await connectMongooseToDatabase()
    const docs = await ShopItemModel.find({ category, isAvailable: true })
    return docs.map(doc => this.mapToDomain(doc))
  }

  async findItemsByRarity (rarity: ItemRarity): Promise<ShopItem[]> {
    await connectMongooseToDatabase()
    const docs = await ShopItemModel.find({ rarity, isAvailable: true })
    return docs.map(doc => this.mapToDomain(doc))
  }

  async createItem (item: ShopItem): Promise<void> {
    await connectMongooseToDatabase()
    // Ne pas passer _id, laisser MongoDB le générer automatiquement
    await ShopItemModel.create({
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt
    })
  }

  async updateItem (item: ShopItem): Promise<void> {
    await connectMongooseToDatabase()
    await ShopItemModel.findByIdAndUpdate(item.id, {
      name: item.name,
      description: item.description,
      category: item.category,
      rarity: item.rarity,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    })
  }

  async deleteItem (itemId: string): Promise<void> {
    await connectMongooseToDatabase()
    await ShopItemModel.findByIdAndDelete(itemId)
  }
}

/**
 * Repository MongoDB pour l'inventaire
 */
export class MongoInventoryRepository implements IInventoryRepository {
  /**
   * Mapper un document MongoDB vers une entité Domain
   */
  private mapToDomain (doc: IInventoryItemDocument): InventoryItem {
    return new InventoryItem({
      id: doc._id.toString(),
      itemId: doc.itemId,
      monsterId: doc.monsterId,
      ownerId: doc.ownerId,
      purchasedAt: doc.purchasedAt,
      isEquipped: doc.isEquipped
    })
  }

  async findByMonsterId (monsterId: string): Promise<InventoryItem[]> {
    await connectMongooseToDatabase()
    const docs = await InventoryItemModel.find({ monsterId }).sort({ purchasedAt: -1 })
    return docs.map(doc => this.mapToDomain(doc))
  }

  async findByOwnerId (ownerId: string): Promise<InventoryItem[]> {
    await connectMongooseToDatabase()
    const docs = await InventoryItemModel.find({ ownerId }).sort({ purchasedAt: -1 })
    return docs.map(doc => this.mapToDomain(doc))
  }

  async addItem (item: InventoryItem): Promise<void> {
    await connectMongooseToDatabase()
    // Ne pas passer _id, laisser MongoDB le générer automatiquement
    await InventoryItemModel.create({
      itemId: item.itemId,
      monsterId: item.monsterId,
      ownerId: item.ownerId,
      purchasedAt: item.purchasedAt,
      isEquipped: item.isEquipped
    })
  }

  async removeItem (itemId: string): Promise<void> {
    await connectMongooseToDatabase()
    await InventoryItemModel.findByIdAndDelete(itemId)
  }

  async updateItem (item: InventoryItem): Promise<void> {
    await connectMongooseToDatabase()
    await InventoryItemModel.findByIdAndUpdate(item.id, {
      isEquipped: item.isEquipped
    })
  }

  async hasItem (monsterId: string, shopItemId: string): Promise<boolean> {
    await connectMongooseToDatabase()
    const count = await InventoryItemModel.countDocuments({
      monsterId,
      itemId: shopItemId
    })
    return count > 0
  }

  async findEquippedItems (monsterId: string): Promise<InventoryItem[]> {
    await connectMongooseToDatabase()
    const docs = await InventoryItemModel.find({ monsterId, isEquipped: true })
    return docs.map(doc => this.mapToDomain(doc))
  }
}
