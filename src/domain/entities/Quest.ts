/**
 * Entité Quest du Domain Layer
 *
 * Responsabilités (SRP):
 * - Représentation métier d'une quête journalière
 * - Validation des règles métier
 * - Gestion de la progression et de l'accomplissement
 *
 * Indépendant de:
 * - La base de données
 * - Le framework (Next.js)
 * - L'infrastructure
 */

/**
 * Types de quêtes disponibles
 */
export type QuestType =
  | 'FEED_MONSTER' // Nourrir son monstre X fois
  | 'LEVEL_UP_MONSTER' // Faire évoluer un monstre d'un niveau
  | 'INTERACT_MONSTERS' // Interagir avec X monstres différents
  | 'BUY_ITEM' // Acheter un accessoire dans la boutique
  | 'MAKE_MONSTER_PUBLIC' // Rendre un monstre public
  | 'PLAY_WITH_MONSTER' // Jouer avec son monstre X fois
  | 'SLEEP_MONSTER' // Faire dormir son monstre X fois
  | 'CLEAN_MONSTER' // Nettoyer son monstre X fois
  | 'VISIT_GALLERY' // Visiter la galerie X fois
  | 'EQUIP_ITEM' // Équiper un accessoire X fois

/**
 * Statut d'une quête
 */
export type QuestStatus = 'ACTIVE' | 'COMPLETED' | 'CLAIMED'

/**
 * Configuration d'un type de quête
 */
export interface QuestTypeConfig {
  type: QuestType
  description: string
  target: number // Objectif à atteindre
  reward: number // Koins gagnés
}

/**
 * Props pour créer une quête
 */
export interface QuestProps {
  id: string
  userId: string
  type: QuestType
  description: string
  target: number
  progress: number
  reward: number
  status: QuestStatus
  assignedAt: Date
  completedAt?: Date
  claimedAt?: Date
  expiresAt: Date
}

/**
 * Classe Quest - Entité du domaine
 */
export class Quest {
  private readonly _id: string
  private readonly _userId: string
  private readonly _type: QuestType
  private readonly _description: string
  private readonly _target: number
  private _progress: number
  private readonly _reward: number
  private _status: QuestStatus
  private readonly _assignedAt: Date
  private _completedAt?: Date
  private _claimedAt?: Date
  private readonly _expiresAt: Date

  // Constantes métier
  public static readonly MAX_DAILY_QUESTS = 3
  public static readonly MIN_REWARD = 10
  public static readonly MAX_REWARD = 100
  public static readonly MIN_TARGET = 1
  public static readonly MAX_TARGET = 10
  public static readonly QUEST_DURATION_HOURS = 24

  /**
   * Configurations par défaut des quêtes
   */
  public static readonly QUEST_CONFIGS: QuestTypeConfig[] = [
    {
      type: 'FEED_MONSTER',
      description: 'Nourris 5 fois ton monstre aujourd\'hui',
      target: 5,
      reward: 20
    },
    {
      type: 'LEVEL_UP_MONSTER',
      description: 'Fais évoluer un monstre d\'un niveau',
      target: 1,
      reward: 50
    },
    {
      type: 'INTERACT_MONSTERS',
      description: 'Interagis avec 3 monstres différents',
      target: 3,
      reward: 30
    },
    {
      type: 'BUY_ITEM',
      description: 'Achète un accessoire dans la boutique',
      target: 1,
      reward: 40
    },
    {
      type: 'MAKE_MONSTER_PUBLIC',
      description: 'Rends un monstre public',
      target: 1,
      reward: 15
    },
    {
      type: 'PLAY_WITH_MONSTER',
      description: 'Joue avec ton monstre 3 fois',
      target: 3,
      reward: 25
    },
    {
      type: 'SLEEP_MONSTER',
      description: 'Fais dormir ton monstre 2 fois',
      target: 2,
      reward: 20
    },
    {
      type: 'CLEAN_MONSTER',
      description: 'Nettoie ton monstre 3 fois',
      target: 3,
      reward: 25
    },
    {
      type: 'VISIT_GALLERY',
      description: 'Visite la galerie 5 fois',
      target: 5,
      reward: 15
    },
    {
      type: 'EQUIP_ITEM',
      description: 'Équipe 2 accessoires différents',
      target: 2,
      reward: 30
    }
  ]

  constructor (props: QuestProps) {
    this._id = props.id
    this._userId = props.userId
    this._type = props.type
    this._description = props.description
    this._target = props.target
    this._progress = props.progress
    this._reward = props.reward
    this._status = props.status
    this._assignedAt = props.assignedAt
    this._completedAt = props.completedAt
    this._claimedAt = props.claimedAt
    this._expiresAt = props.expiresAt

    this.validate()
  }

  // Getters
  get id (): string { return this._id }
  get userId (): string { return this._userId }
  get type (): QuestType { return this._type }
  get description (): string { return this._description }
  get target (): number { return this._target }
  get progress (): number { return this._progress }
  get reward (): number { return this._reward }
  get status (): QuestStatus { return this._status }
  get assignedAt (): Date { return this._assignedAt }
  get completedAt (): Date | undefined { return this._completedAt }
  get claimedAt (): Date | undefined { return this._claimedAt }
  get expiresAt (): Date { return this._expiresAt }

  /**
   * Validation des règles métier
   */
  private validate (): void {
    if (this._id === '' || this._id.trim() === '') {
      throw new Error('Quest ID cannot be empty')
    }

    if (this._userId === '' || this._userId.trim() === '') {
      throw new Error('User ID cannot be empty')
    }

    if (this._target < Quest.MIN_TARGET || this._target > Quest.MAX_TARGET) {
      throw new Error(`Target must be between ${Quest.MIN_TARGET} and ${Quest.MAX_TARGET}`)
    }

    if (this._progress < 0 || this._progress > this._target) {
      throw new Error('Progress cannot be negative or exceed target')
    }

    if (this._reward < Quest.MIN_REWARD || this._reward > Quest.MAX_REWARD) {
      throw new Error(`Reward must be between ${Quest.MIN_REWARD} and ${Quest.MAX_REWARD} TC`)
    }

    if (this._expiresAt <= this._assignedAt) {
      throw new Error('Expiration date must be after assignment date')
    }

    // Validation cohérence statut
    if (this._status === 'COMPLETED' && this._progress < this._target) {
      throw new Error('Cannot mark quest as completed when progress is not achieved')
    }

    if (this._status === 'CLAIMED' && this._completedAt === undefined) {
      throw new Error('Cannot claim a quest that was not completed')
    }
  }

  /**
   * Augmenter la progression de la quête
   * @param amount Montant à ajouter (par défaut 1)
   */
  public incrementProgress (amount: number = 1): void {
    if (this._status === 'CLAIMED') {
      throw new Error('Cannot update progress of a claimed quest')
    }

    if (amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Progress increment must be a positive integer')
    }

    if (this.isExpired()) {
      throw new Error('Cannot update progress of an expired quest')
    }

    this._progress = Math.min(this._progress + amount, this._target)

    // Auto-complétion si objectif atteint
    if (this._progress >= this._target && this._status === 'ACTIVE') {
      this.complete()
    }
  }

  /**
   * Marquer la quête comme complétée
   */
  private complete (): void {
    if (this._status !== 'ACTIVE') {
      throw new Error('Only active quests can be completed')
    }

    if (this._progress < this._target) {
      throw new Error('Cannot complete quest: target not reached')
    }

    if (this.isExpired()) {
      throw new Error('Cannot complete an expired quest')
    }

    this._status = 'COMPLETED'
    this._completedAt = new Date()
  }

  /**
   * Réclamer les récompenses de la quête
   */
  public claim (): number {
    if (this._status !== 'COMPLETED') {
      throw new Error('Only completed quests can be claimed')
    }

    if (this.isExpired()) {
      throw new Error('Cannot claim an expired quest')
    }

    this._status = 'CLAIMED'
    this._claimedAt = new Date()

    return this._reward
  }

  /**
   * Vérifier si la quête est expirée
   */
  public isExpired (): boolean {
    return new Date() > this._expiresAt
  }

  /**
   * Vérifier si la quête est complétée
   */
  public isCompleted (): boolean {
    return this._status === 'COMPLETED' || this._status === 'CLAIMED'
  }

  /**
   * Vérifier si la quête peut être réclamée
   */
  public canBeClaimed (): boolean {
    return this._status === 'COMPLETED' && !this.isExpired()
  }

  /**
   * Obtenir le pourcentage de progression
   */
  public getProgressPercentage (): number {
    return Math.round((this._progress / this._target) * 100)
  }

  /**
   * Obtenir le temps restant avant expiration (en heures)
   */
  public getHoursUntilExpiration (): number {
    const now = new Date()
    const diffMs = this._expiresAt.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return Math.max(0, Math.round(diffHours))
  }

  /**
   * Créer une nouvelle quête à partir d'une configuration
   */
  public static createFromConfig (
    userId: string,
    config: QuestTypeConfig,
    assignedAt: Date = new Date()
  ): Quest {
    const expiresAt = new Date(assignedAt)
    expiresAt.setHours(expiresAt.getHours() + Quest.QUEST_DURATION_HOURS)

    return new Quest({
      id: `quest_${userId}_${config.type}_${Date.now()}`,
      userId,
      type: config.type,
      description: config.description,
      target: config.target,
      progress: 0,
      reward: config.reward,
      status: 'ACTIVE',
      assignedAt,
      expiresAt
    })
  }

  /**
   * Obtenir une configuration de quête aléatoire
   */
  public static getRandomConfig (): QuestTypeConfig {
    const randomIndex = Math.floor(Math.random() * Quest.QUEST_CONFIGS.length)
    return Quest.QUEST_CONFIGS[randomIndex]
  }

  /**
   * Obtenir 3 configurations de quêtes uniques
   */
  public static getRandomUniqueConfigs (): QuestTypeConfig[] {
    const shuffled = [...Quest.QUEST_CONFIGS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Quest.MAX_DAILY_QUESTS)
  }

  /**
   * Conversion en objet simple pour persistance
   */
  public toJSON (): QuestProps {
    return {
      id: this._id,
      userId: this._userId,
      type: this._type,
      description: this._description,
      target: this._target,
      progress: this._progress,
      reward: this._reward,
      status: this._status,
      assignedAt: this._assignedAt,
      completedAt: this._completedAt,
      claimedAt: this._claimedAt,
      expiresAt: this._expiresAt
    }
  }
}
