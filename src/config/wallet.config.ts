/**
 * Configuration du Portefeuille (Wallet)
 *
 * Centralise toutes les constantes liées au système de monnaie :
 * - Koins de départ
 * - Limites de transactions
 * - Packages de Koins achetables
 *
 * @module config/wallet
 */

/**
 * Configuration des Koins de départ
 */
export const INITIAL_WALLET = {
  /** Koins de départ pour un nouveau joueur */
  INITIAL_COINS: 100,

  /** Bonus de premier jour */
  FIRST_DAY_BONUS: 0
} as const

/**
 * Limites de transactions
 */
export const TRANSACTION_LIMITS = {
  /** Montant minimum pour une transaction */
  MIN_AMOUNT: 1,

  /** Montant maximum pour une transaction */
  MAX_AMOUNT: 999999,

  /** Longueur maximale de la description */
  MAX_DESCRIPTION_LENGTH: 200
} as const

/**
 * Interface pour un package de Koins achetable
 */
export interface CoinPackage {
  /** Montant de Koins */
  amount: number
  /** Prix en EUR */
  price: number
  /** ID du produit Stripe */
  productId: string
  /** Badge promotionnel (optionnel) */
  badge?: string
}

/**
 * Packages de Koins disponibles à l'achat (Stripe)
 */
export const COIN_PACKAGES: CoinPackage[] = [
  {
    amount: 10,
    price: 0.5,
    productId: 'prod_TK94QD1MnpfYoI'
  },
  {
    amount: 50,
    price: 1,
    productId: 'prod_TK95YkJr7rxfl1',
    badge: 'Populaire'
  },
  {
    amount: 500,
    price: 2,
    productId: 'prod_TK953warb9g9Bc'
  },
  {
    amount: 1000,
    price: 3,
    productId: 'prod_TK95pionx5vowH',
    badge: 'Meilleure valeur'
  },
  {
    amount: 5000,
    price: 10,
    productId: 'prod_TK95lIiGhFmqBv',
    badge: 'Pack Premium'
  }
]

/**
 * Helper : Récupérer un package par son montant
 */
export function getPackageByAmount (amount: number): CoinPackage | undefined {
  return COIN_PACKAGES.find(pkg => pkg.amount === amount)
}

/**
 * Helper : Récupérer un package par son productId
 */
export function getPackageByProductId (productId: string): CoinPackage | undefined {
  return COIN_PACKAGES.find(pkg => pkg.productId === productId)
}

/**
 * Helper : Calculer le meilleur rapport qualité/prix
 * @returns Package avec le plus de Koins par euro
 */
export function getBestValuePackage (): CoinPackage {
  return COIN_PACKAGES.reduce((best, current) => {
    const currentValue = current.amount / current.price
    const bestValue = best.amount / best.price
    return currentValue > bestValue ? current : best
  })
}

/**
 * Export groupé
 */
export const WALLET_CONFIG = {
  initial: INITIAL_WALLET,
  limits: TRANSACTION_LIMITS,
  packages: COIN_PACKAGES
} as const
