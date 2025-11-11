/**
 * Entité Transaction du Domain Layer
 *
 * Responsabilités (SRP):
 * - Représentation métier d'une transaction
 * - Immuabilité (une fois créée, ne peut être modifiée)
 * - Validation des règles métier
 */

export type TransactionType = 'EARN' | 'SPEND'

export type TransactionReason =
  // Gains
  | 'DAILY_LOGIN'
  | 'FEED_MONSTER'
  | 'PLAY_WITH_MONSTER'
  | 'HEAL_MONSTER'
  | 'REST_MONSTER'
  | 'LEVEL_UP'
  | 'STREAK_BONUS'
  | 'MONSTER_SURVIVAL'
  | 'INITIAL_BONUS'
  | 'QUEST_REWARD'
  // Dépenses
  | 'CREATE_MONSTER'
  | 'PREMIUM_FOOD'
  | 'ENERGY_POTION'
  | 'HAPPINESS_POTION'
  | 'RENAME_MONSTER'
  | 'UNLOCK_COLOR'
  | 'UNLOCK_PATTERN'
  | 'REVIVE_MONSTER'
  | 'BOOST_XP'
  // Admin
  | 'ADMIN_ADD'
  | 'ADMIN_REMOVE'

export interface TransactionProps {
  id: string
  walletId: string
  type: TransactionType
  amount: number
  reason: TransactionReason
  description?: string
  metadata?: Record<string, any>
  createdAt: Date
}

/**
 * Classe Transaction - Entité du domaine (IMMUABLE)
 */
export class Transaction {
  private readonly _id: string
  private readonly _walletId: string
  private readonly _type: TransactionType
  private readonly _amount: number
  private readonly _reason: TransactionReason
  private readonly _description?: string
  private readonly _metadata?: Record<string, any>
  private readonly _createdAt: Date

  constructor (props: TransactionProps) {
    this._id = props.id
    this._walletId = props.walletId
    this._type = props.type
    this._amount = props.amount
    this._reason = props.reason
    this._description = props.description
    this._metadata = props.metadata
    this._createdAt = props.createdAt

    this.validate()
  }

  // Getters (read-only, pas de setters car immuable)
  get id (): string { return this._id }
  get walletId (): string { return this._walletId }
  get type (): TransactionType { return this._type }
  get amount (): number { return this._amount }
  get reason (): TransactionReason { return this._reason }
  get description (): string | undefined { return this._description }
  get metadata (): Record<string, any> | undefined { return this._metadata }
  get createdAt (): Date { return this._createdAt }

  /**
   * Validation des règles métier
   */
  private validate (): void {
    if (this._amount <= 0) {
      throw new Error('Transaction amount must be positive')
    }

    if (!Number.isInteger(this._amount)) {
      throw new Error('Transaction amount must be an integer')
    }

    if (this._description !== undefined && this._description.length > 200) {
      throw new Error('Transaction description cannot exceed 200 characters')
    }
  }

  /**
   * Obtenir le montant avec signe (+ ou -)
   */
  public getSignedAmount (): string {
    return this._type === 'EARN' ? `+${this._amount}` : `-${this._amount}`
  }

  /**
   * Vérifier si c'est un gain
   */
  public isEarning (): boolean {
    return this._type === 'EARN'
  }

  /**
   * Vérifier si c'est une dépense
   */
  public isSpending (): boolean {
    return this._type === 'SPEND'
  }

  /**
   * Obtenir une description lisible de la raison
   */
  public getReasonLabel (): string {
    const labels: Record<TransactionReason, string> = {
      // Gains
      DAILY_LOGIN: 'Connexion quotidienne',
      FEED_MONSTER: 'Nourrir un monstre',
      PLAY_WITH_MONSTER: 'Jouer avec un monstre',
      HEAL_MONSTER: 'Soigner un monstre',
      REST_MONSTER: 'Repos d\'un monstre',
      LEVEL_UP: 'Montée de niveau',
      STREAK_BONUS: 'Bonus de série',
      MONSTER_SURVIVAL: 'Survie de monstre',
      INITIAL_BONUS: 'Bonus de bienvenue',
      // Dépenses
      CREATE_MONSTER: 'Créer un monstre',
      PREMIUM_FOOD: 'Nourriture premium',
      ENERGY_POTION: 'Potion d\'énergie',
      HAPPINESS_POTION: 'Potion de bonheur',
      RENAME_MONSTER: 'Renommer un monstre',
      UNLOCK_COLOR: 'Débloquer une couleur',
      UNLOCK_PATTERN: 'Débloquer un motif',
      REVIVE_MONSTER: 'Réanimer un monstre',
      BOOST_XP: 'Boost d\'XP',
      // Admin
      ADMIN_ADD: 'Ajout administrateur',
      ADMIN_REMOVE: 'Retrait administrateur'
    }

    return labels[this._reason]
  }

  /**
   * Créer une nouvelle transaction (factory method)
   */
  public static create (
    walletId: string,
    type: TransactionType,
    amount: number,
    reason: TransactionReason,
    description?: string,
    metadata?: Record<string, any>
  ): Transaction {
    return new Transaction({
      id: '', // Sera généré par la DB
      walletId,
      type,
      amount,
      reason,
      description,
      metadata,
      createdAt: new Date()
    })
  }

  /**
   * Convertir en objet simple pour persistance
   */
  public toObject (): TransactionProps {
    return {
      id: this._id,
      walletId: this._walletId,
      type: this._type,
      amount: this._amount,
      reason: this._reason,
      description: this._description,
      metadata: this._metadata,
      createdAt: this._createdAt
    }
  }

  /**
   * Créer depuis un objet simple
   */
  public static fromObject (props: TransactionProps): Transaction {
    return new Transaction(props)
  }
}

/**
 * Constantes pour les montants de transactions courantes
 */
export const TRANSACTION_AMOUNTS = {
  // Gains
  DAILY_LOGIN: 25,
  FEED_MONSTER: 10,
  PLAY_WITH_MONSTER: 15,
  HEAL_MONSTER: 20,
  REST_MONSTER: 5,
  LEVEL_UP_BASE: 50, // + 50 par niveau
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  MONSTER_SURVIVAL_7_DAYS: 75,
  MONSTER_SURVIVAL_30_DAYS: 300,
  INITIAL_BONUS: 100,

  // Dépenses
  CREATE_MONSTER_COMMON: 200,
  CREATE_MONSTER_RARE: 500,
  CREATE_MONSTER_LEGENDARY: 1000,
  PREMIUM_FOOD: 30,
  ENERGY_POTION: 40,
  HAPPINESS_POTION: 50,
  RENAME_MONSTER: 50,
  UNLOCK_COLOR: 100,
  UNLOCK_PATTERN: 150,
  REVIVE_MONSTER: 500,
  BOOST_XP: 100
} as const
