import mongoose, { type Model } from 'mongoose'

/**
 * Types de transactions possibles
 */
export type TransactionType = 'EARN' | 'SPEND'

/**
 * Raisons de transactions prédéfinies
 */
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

/**
 * Interface TypeScript pour la Transaction
 */
export interface ITransaction {
  _id: string
  walletId: string
  type: TransactionType
  amount: number
  reason: TransactionReason
  description?: string
  metadata?: Record<string, any>
  createdAt: Date
}

/**
 * Schéma MongoDB pour les Transactions
 *
 * Responsabilités (SRP):
 * - Enregistrement de toutes les transactions
 * - Traçabilité complète (immuable)
 * - Metadata pour contexte supplémentaire
 *
 * Règles métier:
 * - Transactions immuables (pas de modification/suppression)
 * - Montant toujours positif (le type indique gain/dépense)
 * - Historique complet pour audit
 */
const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    walletId: {
      type: String,
      required: [true, 'Wallet ID is required'],
      index: true // Index pour recherche rapide
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['EARN', 'SPEND'],
      immutable: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be positive'],
      validate: {
        validator: Number.isInteger,
        message: 'Amount must be an integer'
      },
      immutable: true
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: [
        // Gains
        'DAILY_LOGIN',
        'FEED_MONSTER',
        'PLAY_WITH_MONSTER',
        'HEAL_MONSTER',
        'REST_MONSTER',
        'LEVEL_UP',
        'STREAK_BONUS',
        'MONSTER_SURVIVAL',
        'INITIAL_BONUS',
        'QUEST_REWARD',
        // Dépenses
        'CREATE_MONSTER',
        'PREMIUM_FOOD',
        'ENERGY_POTION',
        'HAPPINESS_POTION',
        'RENAME_MONSTER',
        'UNLOCK_COLOR',
        'UNLOCK_PATTERN',
        'REVIVE_MONSTER',
        'BOOST_XP',
        // Admin
        'ADMIN_ADD',
        'ADMIN_REMOVE'
      ],
      immutable: true
    },
    description: {
      type: String,
      required: false,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {}
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Pas de updatedAt (immuable)
    collection: 'transactions'
  }
)

// Index pour recherches fréquentes
TransactionSchema.index({ walletId: 1, createdAt: -1 })
TransactionSchema.index({ type: 1, createdAt: -1 })
TransactionSchema.index({ reason: 1, createdAt: -1 })

/**
 * Empêcher la modification des transactions (immuable)
 */
TransactionSchema.pre('save', function (next) {
  if (!this.isNew) {
    next(new Error('Transactions cannot be modified'))
    return
  }
  next()
})

/**
 * Empêcher la suppression des transactions
 */
TransactionSchema.pre('deleteOne', function (next) {
  next(new Error('Transactions cannot be deleted'))
})

TransactionSchema.pre('deleteMany', function (next) {
  next(new Error('Transactions cannot be deleted'))
})

/**
 * Méthode virtuelle pour formatter le montant avec signe
 */
TransactionSchema.virtual('signedAmount').get(function () {
  return this.type === 'EARN' ? `+${this.amount}` : `-${this.amount}`
})

/**
 * Méthode statique pour créer une transaction
 */
TransactionSchema.statics.createTransaction = async function (
  walletId: string,
  type: TransactionType,
  amount: number,
  reason: TransactionReason,
  description?: string,
  metadata?: Record<string, any>
): Promise<ITransaction> {
  const transaction = new this({
    walletId,
    type,
    amount,
    reason,
    description,
    metadata
  })

  return await transaction.save()
}

// Créer le modèle ou le récupérer si déjà existant
const Transaction: Model<ITransaction> = mongoose.models.Transaction ?? mongoose.model<ITransaction>('Transaction', TransactionSchema)

export default Transaction
