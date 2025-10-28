import { type IWalletRepository } from '@/domain/repositories/IWalletRepository'
import { Wallet } from '@/domain/entities/Wallet'
import WalletModel from '@/db/models/wallet.model'
import { connectToDatabase } from '@/db'

/**
 * Implémentation MongoDB du repository Wallet
 *
 * Principe DIP (Dependency Inversion):
 * - Implémente l'interface définie dans le domain
 * - Dépend de l'abstraction, pas de détails techniques
 *
 * Principe SRP (Single Responsibility):
 * - Responsabilité unique: persistence des wallets dans MongoDB
 *
 * @class MongoWalletRepository
 * @implements {IWalletRepository}
 */
export class MongoWalletRepository implements IWalletRepository {
  /**
   * Créer un nouveau wallet pour un utilisateur avec bonus initial
   *
   * @param {string} ownerId - ID de l'utilisateur
   * @returns {Promise<Wallet>} Le wallet créé
   * @throws {Error} Si le wallet existe déjà ou erreur DB
   */
  async create (ownerId: string): Promise<Wallet> {
    await connectToDatabase()

    // Vérifier si le wallet existe déjà
    const existing = await WalletModel.findOne({ ownerId })
    if (existing != null) {
      throw new Error(`Wallet already exists for user ${ownerId}`)
    }

    // Créer avec bonus initial de 100 TC
    const walletDoc = await WalletModel.create({
      ownerId,
      balance: 100,
      currency: 'TC',
      totalEarned: 100,
      totalSpent: 0
    })

    return this.mapToDomain(walletDoc)
  }

  /**
   * Récupérer le wallet d'un utilisateur par son ID
   *
   * @param {string} ownerId - ID de l'utilisateur
   * @returns {Promise<Wallet | null>} Le wallet ou null si inexistant
   */
  async findByOwnerId (ownerId: string): Promise<Wallet | null> {
    await connectToDatabase()

    const walletDoc = await WalletModel.findOne({ ownerId })

    if (walletDoc == null) {
      return null
    }

    return this.mapToDomain(walletDoc)
  }

  /**
   * Récupérer un wallet par son ID
   *
   * @param {string} walletId - ID du wallet
   * @returns {Promise<Wallet | null>} Le wallet ou null si inexistant
   */
  async findById (walletId: string): Promise<Wallet | null> {
    await connectToDatabase()

    const walletDoc = await WalletModel.findById(walletId)

    if (walletDoc == null) {
      return null
    }

    return this.mapToDomain(walletDoc)
  }

  /**
   * Mettre à jour un wallet
   *
   * @param {Wallet} wallet - L'entité wallet à mettre à jour
   * @returns {Promise<Wallet>} Le wallet mis à jour
   * @throws {Error} Si le wallet n'existe pas
   */
  async update (wallet: Wallet): Promise<Wallet> {
    await connectToDatabase()

    const walletDoc = await WalletModel.findByIdAndUpdate(
      wallet.id,
      {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent
      },
      { new: true, runValidators: true }
    )

    if (walletDoc == null) {
      throw new Error(`Wallet ${wallet.id} not found`)
    }

    return this.mapToDomain(walletDoc)
  }

  /**
   * Supprimer un wallet (pour cleanup/tests)
   *
   * @param {string} walletId - ID du wallet à supprimer
   * @returns {Promise<void>}
   */
  async delete (walletId: string): Promise<void> {
    await connectToDatabase()

    await WalletModel.findByIdAndDelete(walletId)
  }

  /**
   * Vérifier si un wallet existe pour un utilisateur
   *
   * @param {string} ownerId - ID de l'utilisateur
   * @returns {Promise<boolean>} true si existe, false sinon
   */
  async exists (ownerId: string): Promise<boolean> {
    await connectToDatabase()

    const count = await WalletModel.countDocuments({ ownerId })
    return count > 0
  }

  /**
   * Mapper un document MongoDB vers une entité Domain
   *
   * @private
   * @param {any} doc - Document MongoDB
   * @returns {Wallet} Entité domain
   */
  private mapToDomain (doc: any): Wallet {
    return new Wallet({
      id: doc._id.toString(),
      ownerId: doc.ownerId,
      balance: doc.balance,
      currency: 'TC',
      totalEarned: doc.totalEarned,
      totalSpent: doc.totalSpent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })
  }
}
