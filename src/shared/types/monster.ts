export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

export type MonsterStyle = 'round' | 'square' | 'tall' | 'wide'
export type EyeStyle = 'big' | 'small' | 'star' | 'sleepy'
export type AntennaStyle = 'single' | 'double' | 'curly' | 'none'
export type AccessoryStyle = 'horns' | 'ears' | 'tail' | 'none'

export interface MonsterTraits {
  bodyColor: string
  accentColor: string
  eyeColor: string
  antennaColor: string
  bobbleColor: string
  cheekColor: string
  bodyStyle: MonsterStyle
  eyeStyle: EyeStyle
  antennaStyle: AntennaStyle
  accessory: AccessoryStyle
}

export const DEFAULT_MONSTER_TRAITS: MonsterTraits = {
  bodyColor: '#FFB5E8',
  accentColor: '#FF9CEE',
  eyeColor: '#2C2C2C',
  antennaColor: '#FFE66D',
  bobbleColor: '#FFE66D',
  cheekColor: '#FFB5D5',
  bodyStyle: 'round',
  eyeStyle: 'big',
  antennaStyle: 'single',
  accessory: 'none'
}

// Constantes pour les stats Tamagotchi
export const DEFAULT_STAT_VALUE = 50
export const MIN_STAT_VALUE = 0
export const MAX_STAT_VALUE = 100

// Constantes pour le système d'XP et de leveling
export const DEFAULT_XP = 0
export const XP_PER_LEVEL = 100 // Chaque niveau nécessite niveau * 100 XP
export const XP_GAIN_PER_ACTION = 10 // XP gagné par action correcte
export const XP_LOSS_PER_WRONG_ACTION = 5 // XP perdu par action incorrecte

export interface MonsterListItem {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  traits: MonsterTraits
  state: MonsterState
  hunger: number
  energy: number
  happiness: number
  isPublic: boolean // Mode public pour galerie communautaire
}

export interface DBMonster {
  _id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  traits: string // JSON stringified MonsterTraits
  state: MonsterState
  hunger: number
  energy: number
  happiness: number
  lastFed: Date | null
  lastPlayed: Date | null
  lastSlept: Date | null
  lastCleaned: Date | null
  equippedItems?: {
    hat: string | null
    glasses: string | null
    shoes: string | null
  }
  equippedBackground?: string | null // ID du fond d'écran équipé
  isPublic: boolean // Mode public pour galerie communautaire (défaut: false)
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
