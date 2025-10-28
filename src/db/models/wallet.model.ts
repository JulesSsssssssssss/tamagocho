import mongoose, { type Model } from 'mongoose'

/**
 * Interface TypeScript pour le Wallet
 */
export interface IWallet {
  _id: string
  ownerId: string
  balance: number
  currency: 'TC'
  createdAt: Date
  updatedAt: Date
  totalEarned: number
  totalSpent: number
}

/**
 * Schéma MongoDB pour le Wallet
 *
 * Responsabilités (SRP):
 * - Définition de la structure du wallet
 * - Validation des données
 * - Timestamps automatiques
 *
 * Règles métier:
 * - Balance ne peut pas être négatif
 * - Un utilisateur = un seul wallet (unique ownerId)
 * - Currency toujours 'TC' (TamaCoins)
 * - Total earned/spent pour statistiques
 */
const WalletSchema = new mongoose.Schema<IWallet>(
  {
    ownerId: {
      type: String,
      required: [true, 'Owner ID is required'],
      unique: true, // Un seul wallet par utilisateur
      index: true // Index pour recherche rapide
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Balance cannot be negative'],
      max: [999999, 'Balance cannot exceed 999,999 TC'],
      validate: {
        validator: Number.isInteger,
        message: 'Balance must be an integer'
      }
    },
    currency: {
      type: String,
      required: true,
      default: 'TC',
      enum: ['TC'], // Pour l'instant seulement TamaCoins
      immutable: true // Ne peut pas être changé après création
    },
    totalEarned: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total earned cannot be negative']
    },
    totalSpent: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total spent cannot be negative']
    }
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
    collection: 'wallets'
  }
)

// Index composé pour recherches fréquentes
WalletSchema.index({ ownerId: 1, createdAt: -1 })

/**
 * Méthode virtuelle pour calculer le ratio dépenses/gains
 */
WalletSchema.virtual('spendingRatio').get(function () {
  if (this.totalEarned === 0) return 0
  return (this.totalSpent / this.totalEarned) * 100
})

/**
 * Hook pre-save pour validation supplémentaire
 */
WalletSchema.pre('save', function (next) {
  // Vérifier que le balance n'est pas négatif
  if (this.balance < 0) {
    next(new Error('Balance cannot be negative'))
    return
  }

  // S'assurer que les totaux sont cohérents
  if (this.totalEarned < 0 || this.totalSpent < 0) {
    next(new Error('Total earned and total spent must be positive'))
    return
  }

  next()
})

/**
 * Méthode statique pour créer un wallet initial
 */
WalletSchema.statics.createInitialWallet = async function (ownerId: string): Promise<IWallet> {
  const existingWallet = await this.findOne({ ownerId })
  if (existingWallet !== null) {
    throw new Error('Wallet already exists for this user')
  }

  const wallet = new this({
    ownerId,
    balance: 100, // Bonus de démarrage: 100 TC
    currency: 'TC',
    totalEarned: 100, // Le bonus compte comme gain
    totalSpent: 0
  })

  return await wallet.save()
}

// Créer le modèle ou le récupérer si déjà existant (évite les erreurs en dev)
const Wallet: Model<IWallet> = mongoose.models.Wallet ?? mongoose.model<IWallet>('Wallet', WalletSchema)

export default Wallet
