import type { MonsterState, MonsterTraits } from '@/shared/types/monster'
import { MONSTER_STATES } from '@/shared/types/monster'

export interface ITamagotchiStats {
  health: number
  hunger: number
  happiness: number
  energy: number
}

export class Tamagotchi {
  private readonly id: string
  private readonly name: string
  private readonly traits: MonsterTraits
  private state: MonsterState
  private readonly stats: ITamagotchiStats
  private level: number
  private experience: number
  private lastActionAt: Date
  private readonly createdAt: Date
  private isDead: boolean
  private readonly ownerId: string
  public isPublic: boolean // Mode public pour galerie communautaire

  constructor (
    id: string,
    name: string,
    traits: MonsterTraits,
    state: MonsterState = 'happy',
    stats: ITamagotchiStats = {
      health: 100,
      hunger: 50,
      happiness: 75,
      energy: 80
    },
    level: number = 1,
    experience: number = 0,
    lastActionAt: Date = new Date(),
    createdAt: Date = new Date(),
    ownerId: string = '',
    isPublic: boolean = false
  ) {
    this.id = id
    this.name = name
    this.ownerId = ownerId
    this.traits = traits
    this.state = state
    this.stats = stats
    this.level = level
    this.experience = experience
    this.lastActionAt = lastActionAt
    this.createdAt = createdAt
    this.isDead = false
    this.isPublic = isPublic
    this.validateState()
  }

  // Getters
  getId (): string { return this.id }
  getName (): string { return this.name }
  getTraits (): MonsterTraits { return { ...this.traits } }
  getState (): MonsterState { return this.state }
  getStats (): Readonly<ITamagotchiStats> { return { ...this.stats } }
  getLevel (): number { return this.level }
  getExperience (): number { return this.experience }
  getLastActionAt (): Date { return this.lastActionAt }
  getCreatedAt (): Date { return this.createdAt }
  getIsDead (): boolean { return this.isDead }
  getOwnerId (): string { return this.ownerId }
  getIsPublic (): boolean { return this.isPublic }

  // Business Logic Methods
  feed (): void {
    if (this.isDead) throw new Error('Cannot feed a dead tamagotchi')

    this.stats.hunger = Math.max(0, this.stats.hunger - 30)
    this.stats.health = Math.min(100, this.stats.health + 5)
    this.updateLastAction()
    this.updateState()
  }

  play (): void {
    if (this.isDead) throw new Error('Cannot play with a dead tamagotchi')
    if (this.stats.energy < 20) throw new Error('Tamagotchi is too tired to play')

    this.stats.happiness = Math.min(100, this.stats.happiness + 25)
    this.stats.energy = Math.max(0, this.stats.energy - 20)
    this.stats.hunger = Math.min(100, this.stats.hunger + 15)
    this.experience += 10
    this.updateLastAction()
    this.updateState()
    this.checkLevelUp()
  }

  sleep (): void {
    if (this.isDead) throw new Error('Cannot sleep if dead')

    this.stats.energy = Math.min(100, this.stats.energy + 40)
    this.stats.health = Math.min(100, this.stats.health + 10)
    this.stats.hunger = Math.min(100, this.stats.hunger + 10)
    this.updateLastAction()
    this.updateState()
  }

  clean (): void {
    if (this.isDead) throw new Error('Cannot clean a dead tamagotchi')

    this.stats.health = Math.min(100, this.stats.health + 15)
    this.stats.happiness = Math.min(100, this.stats.happiness + 5)
    this.updateLastAction()
    this.updateState()
  }

  decayHealth (): void {
    if (this.isDead) return

    // Hunger reduces health
    if (this.stats.hunger > 80) {
      this.stats.health = Math.max(0, this.stats.health - 5)
    }

    // Low energy reduces health
    if (this.stats.energy < 20) {
      this.stats.health = Math.max(0, this.stats.health - 3)
    }

    // Low happiness reduces health
    if (this.stats.happiness < 20) {
      this.stats.health = Math.max(0, this.stats.health - 2)
    }

    // Increase hunger and reduce energy over time
    this.stats.hunger = Math.min(100, this.stats.hunger + 5)
    this.stats.energy = Math.max(0, this.stats.energy - 3)

    this.updateState()
    this.checkIfDead()
  }

  private checkIfDead (): void {
    if (this.stats.health <= 0) {
      this.isDead = true
      this.state = 'sad'
    }
  }

  private checkLevelUp (): void {
    const levelUpThreshold = this.level * 50
    if (this.experience >= levelUpThreshold) {
      this.level += 1
      this.experience -= levelUpThreshold
      this.stats.health = Math.min(100, this.stats.health + 20)
    }
  }

  private updateLastAction (): void {
    this.lastActionAt = new Date()
  }

  private updateState (): void {
    if (this.isDead) {
      this.state = 'sad'
      return
    }

    if (this.stats.hunger > 70) {
      this.state = 'hungry'
    } else if (this.stats.energy < 30) {
      this.state = 'sleepy'
    } else if (this.stats.happiness < 30) {
      this.state = 'sad'
    } else if (this.stats.happiness > 70) {
      this.state = 'happy'
    } else {
      this.state = 'happy'
    }
  }

  private validateState (): void {
    if (!MONSTER_STATES.includes(this.state)) {
      throw new Error(`Invalid state: ${this.state}`)
    }
  }

  isHealthy (): boolean {
    return this.stats.health > 50 && !this.isDead
  }

  isAlive (): boolean {
    return !this.isDead && this.stats.health > 0
  }

  toJSON (): {
    id: string
    name: string
    traits: MonsterTraits
    state: MonsterState
    stats: ITamagotchiStats
    level: number
    experience: number
    lastActionAt: Date
    createdAt: Date
    isDead: boolean
    ownerId: string
  } {
    return {
      id: this.id,
      name: this.name,
      traits: { ...this.traits },
      state: this.state,
      stats: this.stats,
      level: this.level,
      experience: this.experience,
      lastActionAt: this.lastActionAt,
      createdAt: this.createdAt,
      isDead: this.isDead,
      ownerId: this.ownerId
    }
  }
}
