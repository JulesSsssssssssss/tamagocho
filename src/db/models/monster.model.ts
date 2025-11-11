import mongoose, { type Document } from 'mongoose'

const { Schema } = mongoose

/**
 * Interface TypeScript pour le document Monster MongoDB
 */
export interface IMonsterDocument extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  traits: string
  state: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
  hunger: number
  energy: number
  happiness: number
  lastFed: Date | null
  lastPlayed: Date | null
  lastSlept: Date | null
  lastCleaned: Date | null
  equippedItems: {
    hat: string | null
    glasses: string | null
    shoes: string | null
  }
  equippedBackground?: string | null
  isPublic: boolean
  ownerId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const monsterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 1
  },
  xp: {
    type: Number,
    required: false,
    default: 0,
    min: 0
  },
  xpToNextLevel: {
    type: Number,
    required: false,
    default: 100
  },
  traits: {
    type: String, // JSON stringified MonsterDesign
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
    default: 'happy'
  },
  // Stats Tamagotchi (0-100)
  hunger: {
    type: Number,
    required: false,
    default: 50,
    min: 0,
    max: 100
  },
  energy: {
    type: Number,
    required: false,
    default: 50,
    min: 0,
    max: 100
  },
  happiness: {
    type: Number,
    required: false,
    default: 50,
    min: 0,
    max: 100
  },
  // Timestamps des dernières interactions
  lastFed: {
    type: Date,
    required: false,
    default: null
  },
  lastPlayed: {
    type: Date,
    required: false,
    default: null
  },
  lastSlept: {
    type: Date,
    required: false,
    default: null
  },
  lastCleaned: {
    type: Date,
    required: false,
    default: null
  },
  // Items équipés par le monstre
  equippedItems: {
    type: {
      hat: { type: String, required: false, default: null },
      glasses: { type: String, required: false, default: null },
      shoes: { type: String, required: false, default: null }
    },
    required: false,
    default: { hat: null, glasses: null, shoes: null }
  },
  // Background équipé (Feature 3.2)
  equippedBackground: {
    type: String,
    required: false,
    default: null
  },
  // Mode public pour galerie communautaire (Feature 3.1)
  isPublic: {
    type: Boolean,
    required: false,
    default: false
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
})

/**
 * Index MongoDB pour optimiser les requêtes fréquentes
 */
// Index pour findByOwner (Dashboard)
monsterSchema.index({ ownerId: 1, createdAt: -1 })

// Index pour la galerie publique avec filtres
monsterSchema.index({ isPublic: 1, level: -1 })
monsterSchema.index({ isPublic: 1, createdAt: -1 })

// Index pour filtre par état
monsterSchema.index({ state: 1 })

export default mongoose.models.Monster ?? mongoose.model<IMonsterDocument>('Monster', monsterSchema)
