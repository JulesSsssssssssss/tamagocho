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
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
