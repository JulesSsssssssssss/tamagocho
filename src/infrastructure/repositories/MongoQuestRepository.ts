/**
 * Implémentation MongoDB du repository Quest
 *
 * Principe DIP (Dependency Inversion):
 * - Implémente l'interface IQuestRepository définie dans le domain
 *
 * Principe SRP (Single Responsibility):
 * - Responsabilité unique: persistence des quêtes dans MongoDB
 *
 * @class MongoQuestRepository
 * @implements {IQuestRepository}
 */

import { type IQuestRepository } from '@/domain/repositories/IQuestRepository'
import { Quest, type QuestType, type QuestStatus } from '@/domain/entities/Quest'
import { connectMongooseToDatabase } from '@/db'
import mongoose, { type Document } from 'mongoose'

/**
 * Interface pour le document MongoDB Quest
 */
interface IQuestDocument extends Document {
  _id: string
  userId: string
  type: QuestType
  description: string
  target: number
  progress: number
  reward: number
  status: QuestStatus
  assignedAt: Date
  completedAt?: Date
  claimedAt?: Date
  expiresAt: Date
}

/**
 * Schéma Mongoose pour Quest
 */
const questSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: [
      'FEED_MONSTER',
      'LEVEL_UP_MONSTER',
      'INTERACT_MONSTERS',
      'BUY_ITEM',
      'MAKE_MONSTER_PUBLIC',
      'PLAY_WITH_MONSTER',
      'SLEEP_MONSTER',
      'CLEAN_MONSTER',
      'VISIT_GALLERY',
      'EQUIP_ITEM'
    ]
  },
  description: { type: String, required: true },
  target: { type: Number, required: true, min: 1, max: 10 },
  progress: { type: Number, required: true, default: 0, min: 0 },
  reward: { type: Number, required: true, min: 10, max: 100 },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'COMPLETED', 'CLAIMED'],
    default: 'ACTIVE'
  },
  assignedAt: { type: Date, required: true, default: Date.now },
  completedAt: { type: Date },
  claimedAt: { type: Date },
  expiresAt: { type: Date, required: true, index: true }
})

// Index composés pour optimiser les requêtes fréquentes
questSchema.index({ userId: 1, status: 1 })
questSchema.index({ userId: 1, expiresAt: 1 })
questSchema.index({ expiresAt: 1, status: 1 })

// Modèle Mongoose
const QuestModel = mongoose.models.Quest ?? mongoose.model<IQuestDocument>('Quest', questSchema)

/**
 * Repository MongoDB pour les quêtes
 */
export class MongoQuestRepository implements IQuestRepository {
  /**
   * Mapper un document MongoDB vers une entité Domain
   */
  private mapToDomain (doc: IQuestDocument): Quest {
    return new Quest({
      id: doc._id.toString(),
      userId: doc.userId,
      type: doc.type,
      description: doc.description,
      target: doc.target,
      progress: doc.progress,
      reward: doc.reward,
      status: doc.status,
      assignedAt: doc.assignedAt,
      completedAt: doc.completedAt,
      claimedAt: doc.claimedAt,
      expiresAt: doc.expiresAt
    })
  }

  /**
   * Créer une nouvelle quête
   */
  async create (quest: Quest): Promise<Quest> {
    await connectMongooseToDatabase()

    const questProps = quest.toJSON()

    const doc = await QuestModel.create({
      userId: questProps.userId,
      type: questProps.type,
      description: questProps.description,
      target: questProps.target,
      progress: questProps.progress,
      reward: questProps.reward,
      status: questProps.status,
      assignedAt: questProps.assignedAt,
      completedAt: questProps.completedAt,
      claimedAt: questProps.claimedAt,
      expiresAt: questProps.expiresAt
    })

    return this.mapToDomain(doc)
  }

  /**
   * Récupérer une quête par son ID
   */
  async findById (questId: string): Promise<Quest | null> {
    await connectMongooseToDatabase()

    const doc = await QuestModel.findById(questId)

    if (doc === null) {
      return null
    }

    return this.mapToDomain(doc)
  }

  /**
   * Récupérer toutes les quêtes actives d'un utilisateur pour aujourd'hui
   * (non expirées et avec status ACTIVE ou COMPLETED)
   */
  async findActiveQuestsByUserId (userId: string): Promise<Quest[]> {
    await connectMongooseToDatabase()

    const now = new Date()

    // Inclure aussi les CLAIMED pour éviter de régénérer des quêtes dans la même journée
    const docs = await QuestModel.find({
      userId,
      status: { $in: ['ACTIVE', 'COMPLETED', 'CLAIMED'] },
      expiresAt: { $gt: now }
    })
      .sort({ assignedAt: -1 })
      .limit(Quest.MAX_DAILY_QUESTS)

    return docs.map(doc => this.mapToDomain(doc))
  }

  /**
   * Récupérer toutes les quêtes d'un utilisateur (historique)
   */
  async findAllQuestsByUserId (
    userId: string,
    options?: {
      limit?: number
      offset?: number
      includeExpired?: boolean
    }
  ): Promise<Quest[]> {
    await connectMongooseToDatabase()

    const query: any = { userId }

    // Par défaut, exclure les quêtes expirées
    if (options?.includeExpired === false || options?.includeExpired === undefined) {
      query.expiresAt = { $gt: new Date() }
    }

    let dbQuery = QuestModel.find(query).sort({ assignedAt: -1 })

    if (options?.limit !== undefined) {
      dbQuery = dbQuery.limit(options.limit)
    }

    if (options?.offset !== undefined) {
      dbQuery = dbQuery.skip(options.offset)
    }

    const docs = await dbQuery.exec()

    return docs.map(doc => this.mapToDomain(doc))
  }

  /**
   * Mettre à jour une quête
   */
  async update (quest: Quest): Promise<Quest> {
    await connectMongooseToDatabase()

    const questProps = quest.toJSON()

    const doc = await QuestModel.findByIdAndUpdate(
      quest.id,
      {
        progress: questProps.progress,
        status: questProps.status,
        completedAt: questProps.completedAt,
        claimedAt: questProps.claimedAt
      },
      { new: true }
    )

    if (doc === null) {
      throw new Error(`Quest with ID ${quest.id} not found`)
    }

    return this.mapToDomain(doc)
  }

  /**
   * Supprimer une quête
   */
  async delete (questId: string): Promise<void> {
    await connectMongooseToDatabase()

    await QuestModel.findByIdAndDelete(questId)
  }

  /**
   * Supprimer toutes les quêtes expirées d'un utilisateur
   */
  async deleteExpiredQuests (userId: string): Promise<number> {
    await connectMongooseToDatabase()

    const now = new Date()

    const result = await QuestModel.deleteMany({
      userId,
      expiresAt: { $lt: now }
    })

    return result.deletedCount ?? 0
  }

  /**
   * Supprimer toutes les quêtes expirées (tous utilisateurs)
   */
  async deleteAllExpiredQuests (): Promise<number> {
    await connectMongooseToDatabase()

    const now = new Date()

    const result = await QuestModel.deleteMany({
      expiresAt: { $lt: now }
    })

    return result.deletedCount ?? 0
  }

  /**
   * Vérifier si un utilisateur a déjà ses quêtes du jour
   */
  async hasActiveDailyQuests (userId: string): Promise<boolean> {
    const count = await this.countActiveQuests(userId)
    return count >= Quest.MAX_DAILY_QUESTS
  }

  /**
   * Obtenir le nombre de quêtes actives d'un utilisateur
   */
  async countActiveQuests (userId: string): Promise<number> {
    await connectMongooseToDatabase()

    const now = new Date()

    const count = await QuestModel.countDocuments({
      userId,
      status: { $in: ['ACTIVE', 'COMPLETED'] },
      expiresAt: { $gt: now }
    })

    return count
  }

  /**
   * Récupérer toutes les quêtes complétées mais non réclamées d'un utilisateur
   */
  async findUnclaimedQuests (userId: string): Promise<Quest[]> {
    await connectMongooseToDatabase()

    const now = new Date()

    const docs = await QuestModel.find({
      userId,
      status: 'COMPLETED',
      expiresAt: { $gt: now }
    }).sort({ completedAt: -1 })

    return docs.map(doc => this.mapToDomain(doc))
  }
}
