import { type Wallet } from '../entities/Wallet'
import { type Transaction, type TransactionReason, type TransactionType } from '../entities/Transaction'

/**
 * Interface du repository Wallet (abstraction)
 *
 * Principe DIP (Dependency Inversion):
 * - Le domain définit l'interface
 * - L'infrastructure l'implémente
 * - Les use cases dépendent de l'interface, pas de l'implémentation
 *
 * Principe ISP (Interface Segregation):
 * - Interface focalisée sur les opérations wallet uniquement
 */
export interface IWalletRepository {
  /**
   * Créer un nouveau wallet pour un utilisateur
   */
  create: (ownerId: string) => Promise<Wallet>

  /**
   * Récupérer le wallet d'un utilisateur par son ID
   */
  findByOwnerId: (ownerId: string) => Promise<Wallet | null>

  /**
   * Récupérer un wallet par son ID
   */
  findById: (walletId: string) => Promise<Wallet | null>

  /**
   * Mettre à jour un wallet
   */
  update: (wallet: Wallet) => Promise<Wallet>

  /**
   * Supprimer un wallet (pour cleanup/tests)
   */
  delete: (walletId: string) => Promise<void>

  /**
   * Vérifier si un wallet existe pour un utilisateur
   */
  exists: (ownerId: string) => Promise<boolean>
}

/**
 * Interface du repository Transaction (abstraction)
 *
 * Principe ISP:
 * - Interface focalisée sur les opérations transaction uniquement
 * - Séparée de IWalletRepository
 */
export interface ITransactionRepository {
  /**
   * Créer une nouvelle transaction
   */
  create: (
    walletId: string,
    type: TransactionType,
    amount: number,
    reason: TransactionReason,
    description?: string,
    metadata?: Record<string, any>
  ) => Promise<Transaction>

  /**
   * Récupérer une transaction par son ID
   */
  findById: (transactionId: string) => Promise<Transaction | null>

  /**
   * Récupérer toutes les transactions d'un wallet
   */
  findByWalletId: (
    walletId: string,
    options?: {
      limit?: number
      offset?: number
      type?: TransactionType
    }
  ) => Promise<Transaction[]>

  /**
   * Récupérer les transactions récentes d'un wallet
   */
  findRecentByWalletId: (walletId: string, limit?: number) => Promise<Transaction[]>

  /**
   * Compter le nombre total de transactions d'un wallet
   */
  countByWalletId: (walletId: string) => Promise<number>

  /**
   * Récupérer les transactions par type et raison
   */
  findByTypeAndReason: (
    walletId: string,
    type: TransactionType,
    reason: TransactionReason
  ) => Promise<Transaction[]>
}

/**
 * Interface combinée pour des opérations transactionnelles
 * (pattern Unit of Work simplifié)
 */
export interface IWalletService {
  /**
   * Obtenir ou créer le wallet d'un utilisateur
   */
  getOrCreateWallet: (ownerId: string) => Promise<Wallet>

  /**
   * Ajouter des coins avec création de transaction
   * @returns Le wallet mis à jour et la transaction créée
   */
  addCoins: (
    ownerId: string,
    amount: number,
    reason: TransactionReason,
    description?: string,
    metadata?: Record<string, any>
  ) => Promise<{ wallet: Wallet, transaction: Transaction }>

  /**
   * Dépenser des coins avec création de transaction
   * @returns Le wallet mis à jour et la transaction créée
   */
  spendCoins: (
    ownerId: string,
    amount: number,
    reason: TransactionReason,
    description?: string,
    metadata?: Record<string, any>
  ) => Promise<{ wallet: Wallet, transaction: Transaction }>

  /**
   * Récupérer le wallet et ses transactions récentes
   */
  getWalletWithTransactions: (
    ownerId: string,
    transactionLimit?: number
  ) => Promise<{
    wallet: Wallet
    transactions: Transaction[]
    totalTransactions: number
  }>
}
