/**
 * Entité Wallet du Domain Layer
 *
 * Responsabilités (SRP):
 * - Représentation métier du wallet
 * - Règles de validation métier
 * - Calculs de statistiques
 *
 * Indépendant de:
 * - La base de données
 * - Le framework (Next.js)
 * - L'infrastructure
 */

export interface WalletProps {
  id: string
  ownerId: string
  balance: number
  currency: 'TC'
  createdAt: Date
  updatedAt: Date
  totalEarned: number
  totalSpent: number
}

/**
 * Classe Wallet - Entité du domaine
 */
export class Wallet {
  private readonly _id: string
  private readonly _ownerId: string
  private _balance: number
  private readonly _currency: 'TC'
  private readonly _createdAt: Date
  private _updatedAt: Date
  private _totalEarned: number
  private _totalSpent: number

  // Constantes métier
  public static readonly MAX_BALANCE = 999999
  public static readonly MIN_BALANCE = 0
  public static readonly CURRENCY = 'TC'
  public static readonly INITIAL_BONUS = 100

  constructor (props: WalletProps) {
    this._id = props.id
    this._ownerId = props.ownerId
    this._balance = props.balance
    this._currency = props.currency
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
    this._totalEarned = props.totalEarned
    this._totalSpent = props.totalSpent

    this.validate()
  }

  // Getters
  get id (): string { return this._id }
  get ownerId (): string { return this._ownerId }
  get balance (): number { return this._balance }
  get currency (): 'TC' { return this._currency }
  get createdAt (): Date { return this._createdAt }
  get updatedAt (): Date { return this._updatedAt }
  get totalEarned (): number { return this._totalEarned }
  get totalSpent (): number { return this._totalSpent }

  /**
   * Validation des règles métier
   */
  private validate (): void {
    if (this._balance < Wallet.MIN_BALANCE) {
      throw new Error('Balance cannot be negative')
    }

    if (this._balance > Wallet.MAX_BALANCE) {
      throw new Error(`Balance cannot exceed ${Wallet.MAX_BALANCE} TC`)
    }

    if (!Number.isInteger(this._balance)) {
      throw new Error('Balance must be an integer')
    }

    if (this._totalEarned < 0 || this._totalSpent < 0) {
      throw new Error('Total earned and spent must be positive')
    }
  }

  /**
   * Ajouter des coins au wallet
   * @param amount Montant à ajouter (doit être positif)
   */
  public addCoins (amount: number): void {
    if (amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Amount must be a positive integer')
    }

    const newBalance = this._balance + amount

    if (newBalance > Wallet.MAX_BALANCE) {
      throw new Error(`Cannot add ${amount} TC: would exceed maximum balance of ${Wallet.MAX_BALANCE} TC`)
    }

    this._balance = newBalance
    this._totalEarned += amount
    this._updatedAt = new Date()
  }

  /**
   * Dépenser des coins du wallet
   * @param amount Montant à dépenser (doit être positif)
   */
  public spendCoins (amount: number): void {
    if (amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Amount must be a positive integer')
    }

    if (this._balance < amount) {
      throw new Error(`Insufficient balance: have ${this._balance} TC, need ${amount} TC`)
    }

    this._balance -= amount
    this._totalSpent += amount
    this._updatedAt = new Date()
  }

  /**
   * Vérifier si le wallet a suffisamment de fonds
   */
  public hasSufficientBalance (amount: number): boolean {
    return this._balance >= amount
  }

  /**
   * Calculer le ratio dépenses/gains en pourcentage
   */
  public getSpendingRatio (): number {
    if (this._totalEarned === 0) return 0
    return (this._totalSpent / this._totalEarned) * 100
  }

  /**
   * Calculer le profit net (gains - dépenses)
   */
  public getNetProfit (): number {
    return this._totalEarned - this._totalSpent
  }

  /**
   * Créer un nouveau wallet avec bonus initial
   */
  public static createNew (ownerId: string): Wallet {
    return new Wallet({
      id: '', // Sera généré par la DB
      ownerId,
      balance: Wallet.INITIAL_BONUS,
      currency: Wallet.CURRENCY,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalEarned: Wallet.INITIAL_BONUS,
      totalSpent: 0
    })
  }

  /**
   * Convertir en objet simple pour persistance
   */
  public toObject (): WalletProps {
    return {
      id: this._id,
      ownerId: this._ownerId,
      balance: this._balance,
      currency: this._currency,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      totalEarned: this._totalEarned,
      totalSpent: this._totalSpent
    }
  }

  /**
   * Créer depuis un objet simple
   */
  public static fromObject (props: WalletProps): Wallet {
    return new Wallet(props)
  }
}
