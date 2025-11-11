/**
 * Table de tarification pour les packages de Koins
 *
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat.
 *
 * @remarks
 * - Les productId correspondent aux produits créés dans Stripe Dashboard
 * - Les prix sont en EUR
 * - Chaque clé représente le nombre de Koins que l'utilisateur recevra
 */

export interface PricingPackage {
  /** ID du produit Stripe */
  productId: string
  /** Prix en EUR */
  price: number
}

/**
 * Table de correspondance entre les montants de Koins et leurs prix
 *
 * @example
 * ```typescript
 * const package10 = pricingTable[10] // { productId: '...', price: 0.5 }
 * ```
 */
export const pricingTable: Record<number, PricingPackage> = {
  10: {
    productId: 'prod_TK94QD1MnpfYoI',
    price: 0.5
  },
  50: {
    productId: 'prod_TK95YkJr7rxfl1',
    price: 1
  },
  500: {
    productId: 'prod_TK953warb9g9Bc',
    price: 2
  },
  1000: {
    productId: 'prod_TK95pionx5vowH',
    price: 3
  },
  5000: {
    productId: 'prod_TK95lIiGhFmqBv',
    price: 10
  }
}
