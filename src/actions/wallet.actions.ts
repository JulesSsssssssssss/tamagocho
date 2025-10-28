'use server'

import { connectMongooseToDatabase } from '@/db'
import Player from '@/db/models/player.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { MongoTransactionRepository } from '@/infrastructure/repositories/MongoTransactionRepository'
import { type TransactionType, type TransactionReason } from '@/domain/entities/Transaction'
import { INITIAL_COINS } from '@/shared/types/coins'

/**
 * Server Actions pour le Wallet
 *
 * Application Layer - Use Cases via Server Actions
 *
 * Utilise la table Player existante pour les coins
 * + Table Transactions pour l'historique
 */

const transactionRepository = new MongoTransactionRepository()

/**
 * Récupérer le wallet d'un utilisateur
 *
 * Lit depuis la table Player.coins
 *
 * @returns {Promise} Wallet data ou erreur
 */
export async function getWallet (): Promise<{
  success: boolean
  wallet?: {
    id: string
    ownerId: string
    balance: number
    currency: 'TC'
    totalEarned: number
    totalSpent: number
    createdAt: Date
    updatedAt: Date
  }
  error?: string
}> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const { user } = session

    // Récupérer ou créer le Player
    let player = await Player.findOne({ userId: user.id }).exec()

    if (player === null || player === undefined) {
      // Créer un nouveau joueur avec les pièces de départ
      player = new Player({
        userId: user.id,
        coins: INITIAL_COINS,
        totalMonstersCreated: 0
      })
      await player.save()
    }

    // Pour totalEarned et totalSpent, on calcule depuis les transactions
    const transactions = await transactionRepository.findByWalletId(player._id.toString(), { limit: 1000 })
    
    const totalEarned = transactions
      .filter(t => t.type === 'EARN')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalSpent = transactions
      .filter(t => t.type === 'SPEND')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      success: true,
      wallet: {
        id: player._id.toString(),
        ownerId: user.id,
        balance: Number(player.coins ?? 0),
        currency: 'TC',
        totalEarned: totalEarned + INITIAL_COINS, // Inclure le bonus initial
        totalSpent,
        createdAt: player.createdAt,
        updatedAt: player.updatedAt
      }
    }
  } catch (error) {
    console.error('❌ Error getting wallet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get wallet'
    }
  }
}

/**
 * Ajouter des coins au wallet
 *
 * Utilise Player.coins au lieu de Wallet
 *
 * @param {number} amount - Montant à ajouter
 * @param {TransactionReason} reason - Raison de l'ajout
 * @param {string} description - Description optionnelle
 * @returns {Promise} Résultat de l'opération
 */
export async function addCoins (
  amount: number,
  reason: TransactionReason,
  description?: string
): Promise<{
    success: boolean
    newBalance?: number
    error?: string
  }> {
  try {
    // Validation
    if (amount <= 0 || !Number.isInteger(amount)) {
      return {
        success: false,
        error: 'Amount must be a positive integer'
      }
    }

    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const { user } = session

    // Récupérer le Player
    const player = await Player.findOne({ userId: user.id }).exec()

    if (player === null || player === undefined) {
      return {
        success: false,
        error: 'Player not found'
      }
    }

    const currentCoins = Number(player.coins ?? 0)
    const newBalance = currentCoins + amount

    // Vérifier max
    if (newBalance > 999999) {
      return {
        success: false,
        error: 'Cannot exceed maximum balance of 999,999 TC'
      }
    }

    // Mettre à jour
    player.coins = newBalance
    await player.save()

    // Créer la transaction
    await transactionRepository.create(
      player._id.toString(),
      'EARN',
      amount,
      reason,
      description,
      { userId: user.id }
    )

    return {
      success: true,
      newBalance
    }
  } catch (error) {
    console.error('❌ Error adding coins:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add coins'
    }
  }
}

/**
 * Retirer des coins du wallet
 *
 * Utilise Player.coins au lieu de Wallet
 *
 * @param {number} amount - Montant à retirer
 * @param {TransactionReason} reason - Raison du retrait
 * @param {string} description - Description optionnelle
 * @returns {Promise} Résultat de l'opération
 */
export async function spendCoins (
  amount: number,
  reason: TransactionReason,
  description?: string
): Promise<{
    success: boolean
    newBalance?: number
    error?: string
  }> {
  try {
    // Validation
    if (amount <= 0 || !Number.isInteger(amount)) {
      return {
        success: false,
        error: 'Amount must be a positive integer'
      }
    }

    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const { user } = session

    // Récupérer le Player
    const player = await Player.findOne({ userId: user.id }).exec()

    if (player === null || player === undefined) {
      return {
        success: false,
        error: 'Player not found'
      }
    }

    const currentCoins = Number(player.coins ?? 0)

    // Vérifier si assez de fonds
    if (currentCoins < amount) {
      return {
        success: false,
        error: `Insufficient funds. Balance: ${currentCoins} TC, Required: ${amount} TC`
      }
    }

    const newBalance = currentCoins - amount

    // Mettre à jour
    player.coins = newBalance
    await player.save()

    // Créer la transaction
    await transactionRepository.create(
      player._id.toString(),
      'SPEND',
      amount,
      reason,
      description,
      { userId: user.id }
    )

    return {
      success: true,
      newBalance
    }
  } catch (error) {
    console.error('❌ Error spending coins:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to spend coins'
    }
  }
}

/**
 * Récupérer l'historique des transactions
 *
 * @param {number} limit - Nombre de transactions à récupérer
 * @returns {Promise} Liste des transactions
 */
export async function getTransactions (
  limit: number = 20
): Promise<{
    success: boolean
    transactions?: Array<{
      id: string
      type: TransactionType
      amount: number
      reason: TransactionReason
      description?: string
      createdAt: Date
    }>
    error?: string
  }> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return {
        success: false,
        error: 'User not authenticated'
      }
    }

    const { user } = session

    // Récupérer le Player
    const player = await Player.findOne({ userId: user.id }).exec()

    if (player === null || player === undefined) {
      return {
        success: false,
        error: 'Player not found'
      }
    }

    // Récupérer les transactions
    const transactions = await transactionRepository.findRecentByWalletId(player._id.toString(), limit)

    return {
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        reason: t.reason,
        description: t.description,
        createdAt: t.createdAt
      }))
    }
  } catch (error) {
    console.error('❌ Error getting transactions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transactions'
    }
  }
}
