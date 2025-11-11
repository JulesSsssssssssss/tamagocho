import { type ITransactionRepository } from '@/domain/repositories/IWalletRepository'
import { Transaction, type TransactionType, type TransactionReason } from '@/domain/entities/Transaction'
import TransactionModel from '@/db/models/transaction.model'
import { connectToDatabase } from '@/db'

/**
 * Implémentation MongoDB du repository Transaction
 *
 * Principe DIP (Dependency Inversion):
 * - Implémente l'interface définie dans le domain
 *
 * Principe SRP (Single Responsibility):
 * - Responsabilité unique: persistence des transactions dans MongoDB
 *
 * @class MongoTransactionRepository
 * @implements {ITransactionRepository}
 */
export class MongoTransactionRepository implements ITransactionRepository {
  /**
   * Créer une nouvelle transaction
   */
  async create (
    walletId: string,
    type: TransactionType,
    amount: number,
    reason: TransactionReason,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    await connectToDatabase()

    const transactionDoc = await TransactionModel.create({
      walletId,
      type,
      amount,
      reason,
      description,
      metadata: metadata ?? {}
    })

    return this.mapToDomain(transactionDoc)
  }

  /**
   * Récupérer toutes les transactions d'un wallet
   */
  async findByWalletId (
    walletId: string,
    options?: {
      limit?: number
      offset?: number
      type?: TransactionType
    }
  ): Promise<Transaction[]> {
    await connectToDatabase()

    let query = TransactionModel.find({ walletId })

    if (options?.type != null) {
      query = query.where('type').equals(options.type)
    }

    query = query.sort({ createdAt: -1 }) // Plus récent d'abord

    if (options?.limit != null) {
      query = query.limit(options.limit)
    }

    if (options?.offset != null) {
      query = query.skip(options.offset)
    }

    const docs = await query.exec()

    return docs.map(doc => this.mapToDomain(doc))
  }

  /**
   * Récupérer les transactions récentes d'un wallet
   */
  async findRecentByWalletId (walletId: string, limit: number = 10): Promise<Transaction[]> {
    return await this.findByWalletId(walletId, { limit })
  }

  /**
   * Récupérer une transaction par son ID
   *
   * @param {string} transactionId - ID de la transaction
   * @returns {Promise<Transaction | null>} La transaction ou null
   */
  async findById (transactionId: string): Promise<Transaction | null> {
    await connectToDatabase()

    const doc = await TransactionModel.findById(transactionId)

    if (doc == null) {
      return null
    }

    return this.mapToDomain(doc)
  }

  /**
   * Récupérer les transactions par type et raison
   */
  async findByTypeAndReason (
    walletId: string,
    type: TransactionType,
    reason: TransactionReason
  ): Promise<Transaction[]> {
    await connectToDatabase()

    const docs = await TransactionModel.find({ walletId, type, reason })
      .sort({ createdAt: -1 })
      .exec()

    return docs.map(doc => this.mapToDomain(doc))
  }

  /**
   * Compter les transactions d'un wallet
   */
  async countByWalletId (walletId: string): Promise<number> {
    await connectToDatabase()

    return await TransactionModel.countDocuments({ walletId })
  }

  /**
   * Mapper un document MongoDB vers une entité Domain
   *
   * @private
   * @param {any} doc - Document MongoDB
   * @returns {Transaction} Entité domain
   */
  private mapToDomain (doc: any): Transaction {
    return new Transaction({
      id: doc._id.toString(),
      walletId: doc.walletId,
      type: doc.type,
      amount: doc.amount,
      reason: doc.reason,
      description: doc.description,
      metadata: doc.metadata,
      createdAt: doc.createdAt
    })
  }
}
