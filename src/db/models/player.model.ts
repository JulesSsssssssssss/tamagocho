import mongoose from 'mongoose'

const { Schema } = mongoose

/**
 * Schéma des données du joueur
 *
 * Stocke les informations de progression du joueur :
 * - Monnaie (coins)
 * - Statistiques globales
 * - Récompenses débloquées
 */
const playerSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  coins: {
    type: Number,
    required: false,
    default: 100, // Le joueur commence avec 100 pièces
    min: 0
  },
  totalMonstersCreated: {
    type: Number,
    required: false,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    required: false,
    default: 100, // Inclut le bonus initial
    min: 0
  },
  totalSpent: {
    type: Number,
    required: false,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.Player ?? mongoose.model('Player', playerSchema)
