/**
 * Constantes du système de monnaie
 */

// Monnaie de départ pour un nouveau joueur
export const INITIAL_COINS = 100

// Nombre de monstres gratuits au début
export const FREE_MONSTERS_COUNT = 2

// Prix de base pour le premier monstre payant (3ème monstre)
export const BASE_MONSTER_PRICE = 50

// Augmentation du prix pour chaque monstre supplémentaire
export const PRICE_INCREMENT = 50

// Récompense en coins pour chaque action effectuée sur un monstre
export const COINS_PER_ACTION = 10

/**
 * Calcule le prix d'un nouveau monstre en fonction du nombre déjà créé
 *
 * Système de tarification :
 * - Monstre 1 : Gratuit (0 pièces)
 * - Monstre 2 : Gratuit (0 pièces)
 * - Monstre 3 : 50 pièces
 * - Monstre 4 : 100 pièces
 * - Monstre 5 : 150 pièces
 * - Formule : (n - 2) × 50 pour n > 2
 *
 * @param {number} currentMonsterCount - Nombre de monstres déjà créés
 * @returns {number} Prix en pièces pour le prochain monstre
 *
 * @example
 * calculateMonsterPrice(0) // 0 (1er monstre gratuit)
 * calculateMonsterPrice(1) // 0 (2ème monstre gratuit)
 * calculateMonsterPrice(2) // 50 (3ème monstre)
 * calculateMonsterPrice(3) // 100 (4ème monstre)
 */
export function calculateMonsterPrice (currentMonsterCount: number): number {
  // Les 2 premiers monstres sont gratuits
  if (currentMonsterCount < FREE_MONSTERS_COUNT) {
    return 0
  }

  // À partir du 3ème monstre : (n - 2) × 50
  const paidMonstersCount = currentMonsterCount - FREE_MONSTERS_COUNT
  return BASE_MONSTER_PRICE + (paidMonstersCount * PRICE_INCREMENT)
}

/**
 * Calcule les pièces gagnées pour une action correcte
 *
 * @param {number} monsterLevel - Niveau du monstre
 * @returns {number} Nombre de pièces gagnées
 *
 * @example
 * calculateCoinsReward(1) // 2 pièces
 * calculateCoinsReward(5) // 5 pièces
 */
export function calculateCoinsReward (monsterLevel: number): number {
  // Récompense progressive : niveau × 1 (minimum 2)
  return Math.max(2, monsterLevel)
}
