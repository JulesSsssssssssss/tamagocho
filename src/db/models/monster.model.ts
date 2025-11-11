import mongoose from 'mongoose'

const { Schema } = mongoose

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

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
