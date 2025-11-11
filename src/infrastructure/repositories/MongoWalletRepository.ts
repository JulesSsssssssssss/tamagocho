/**
 * Implémentation MongoDB du repository Wallet
 *
 * Principe DIP (Dependency Inversion):
 * - Implémente l'interface IWalletRepository définie dans le domain
 *
 * Principe SRP (Single Responsibility):
 * - Responsabilité unique: persistence du wallet dans MongoDB
 *
 * Note: Utilise le modèle Player existant comme source de données
 * car Player.coins représente le wallet balance
 *
 * @class MongoWalletRepository
 * @implements {IWalletRepository}
 */

import { type IWalletRepository } from '@/domain/repositories/IWalletRepository'
import { Wallet } from '@/domain/entities/Wallet'
import { connectMongooseToDatabase } from '@/db'
import Player from '@/db/models/player.model'

export class MongoWalletRepository implements IWalletRepository {
  /**
   * Mapper un document Player vers une entité Wallet
   */
  private mapToDomain (doc: any): Wallet {
    return new Wallet({
      id: doc._id.toString(),
      ownerId: doc.userId,
      balance: doc.coins ?? Wallet.INITIAL_BONUS,
      currency: 'TC',
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.updatedAt ?? new Date(),
      totalEarned: doc.totalEarned ?? Wallet.INITIAL_BONUS,
      totalSpent: doc.totalSpent ?? 0
    })
  }

  /**
   * Créer un nouveau wallet pour un utilisateur
   */
  async create (ownerId: string): Promise<Wallet> {
    await connectMongooseToDatabase()

    // Vérifier si le wallet existe déjà
    const existingPlayer = await Player.findOne({ userId: ownerId })

    if (existingPlayer !== null) {
      return this.mapToDomain(existingPlayer)
    }

    // Créer un nouveau player/wallet
    const player = await Player.create({
      userId: ownerId,
      coins: Wallet.INITIAL_BONUS,
      totalMonstersCreated: 0,
      totalEarned: Wallet.INITIAL_BONUS,
      totalSpent: 0
    })

    return this.mapToDomain(player)
  }

  /**
   * Récupérer le wallet d'un utilisateur par son ID
   */
  async findByOwnerId (ownerId: string): Promise<Wallet | null> {
    await connectMongooseToDatabase()

    const player = await Player.findOne({ userId: ownerId })

    if (player === null) {
      return null
    }

    return this.mapToDomain(player)
  }

  /**
   * Récupérer un wallet par son ID
   */
  async findById (walletId: string): Promise<Wallet | null> {
    await connectMongooseToDatabase()

    const player = await Player.findById(walletId)

    if (player === null) {
      return null
    }

    return this.mapToDomain(player)
  }

  /**
   * Mettre à jour un wallet
   */
  async update (wallet: Wallet): Promise<Wallet> {
    await connectMongooseToDatabase()

    const player = await Player.findByIdAndUpdate(
      wallet.id,
      {
        coins: wallet.balance,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (player === null) {
      throw new Error(`Wallet with ID ${wallet.id} not found`)
    }

    return this.mapToDomain(player)
  }

  /**
   * Supprimer un wallet (pour cleanup/tests)
   */
  async delete (walletId: string): Promise<void> {
    await connectMongooseToDatabase()

    await Player.findByIdAndDelete(walletId)
  }

  /**
   * Vérifier si un wallet existe pour un utilisateur
   */
  async exists (ownerId: string): Promise<boolean> {
    await connectMongooseToDatabase()

    const count = await Player.countDocuments({ userId: ownerId })

    return count > 0
  }
}
