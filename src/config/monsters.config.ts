/**
 * Configuration des Monstres
 *
 * Centralise toutes les constantes liées aux monstres :
 * - Prix de création
 * - Statistiques de base
 * - Limites et seuils
 * - Configuration du système de niveaux
 *
 * @module config/monsters
 */

/**
 * Configuration de la tarification des monstres
 */
export const MONSTER_PRICING = {
  /** Nombre de monstres gratuits au début */
  FREE_MONSTERS_COUNT: 2,

  /** Prix de base pour le premier monstre payant (3ème monstre) */
  BASE_PRICE: 50,

  /** Augmentation du prix pour chaque monstre supplémentaire */
  PRICE_INCREMENT: 50
} as const

/**
 * Calcule le prix d'un nouveau monstre
 *
 * Système de tarification :
 * - Monstre 1 : Gratuit (0 pièces)
 * - Monstre 2 : Gratuit (0 pièces)
 * - Monstre 3 : 50 pièces
 * - Monstre 4 : 100 pièces
 * - Formule : (n - 2) × 50 pour n > 2
 *
 * @param currentMonsterCount - Nombre de monstres déjà créés
 * @returns Prix en pièces pour le prochain monstre
 */
export function calculateMonsterPrice (currentMonsterCount: number): number {
  if (currentMonsterCount < MONSTER_PRICING.FREE_MONSTERS_COUNT) {
    return 0
  }
  const paidMonstersCount = currentMonsterCount - MONSTER_PRICING.FREE_MONSTERS_COUNT
  return MONSTER_PRICING.BASE_PRICE + (paidMonstersCount * MONSTER_PRICING.PRICE_INCREMENT)
}

/**
 * Statistiques de base d'un monstre
 */
export const MONSTER_BASE_STATS = {
  /** Niveau de départ */
  INITIAL_LEVEL: 1,

  /** Expérience de départ */
  INITIAL_XP: 0,

  /** Bonheur de départ (0-100) */
  INITIAL_HAPPINESS: 50,

  /** Faim de départ (0-100) */
  INITIAL_HUNGER: 50,

  /** Énergie de départ (0-100) */
  INITIAL_ENERGY: 50
} as const

/**
 * Limites et seuils des statistiques
 */
export const MONSTER_STAT_LIMITS = {
  /** Valeur minimale d'une stat */
  MIN_STAT: 0,

  /** Valeur maximale d'une stat */
  MAX_STAT: 100,

  /** Seuil critique (monstre en danger) */
  CRITICAL_THRESHOLD: 20,

  /** Seuil bas (avertissement) */
  LOW_THRESHOLD: 40,

  /** Seuil élevé (monstre content) */
  HIGH_THRESHOLD: 70
} as const

/**
 * Configuration du système de niveaux
 */
export const MONSTER_LEVELING = {
  /** XP requis pour le niveau 2 */
  BASE_XP_REQUIRED: 100,

  /** Multiplicateur d'XP par niveau (exponentiel) */
  XP_MULTIPLIER: 1.5,

  /** Niveau maximum atteignable */
  MAX_LEVEL: 100,

  /** XP gagnée par action de base */
  XP_PER_ACTION: 10,

  /** XP bonus pour action parfaite */
  XP_BONUS_PERFECT: 5
} as const

/**
 * Calcule l'XP requise pour atteindre un niveau
 *
 * Formule : BASE_XP × (MULTIPLIER ^ (niveau - 1))
 * Exemple : Niveau 3 → 100 × (1.5 ^ 2) = 225 XP
 *
 * @param level - Niveau cible
 * @returns XP requise pour atteindre ce niveau
 */
export function calculateXpRequired (level: number): number {
  if (level <= 1) return 0
  return Math.floor(
    MONSTER_LEVELING.BASE_XP_REQUIRED * Math.pow(MONSTER_LEVELING.XP_MULTIPLIER, level - 2)
  )
}

/**
 * Calcule le niveau à partir de l'XP totale
 *
 * @param totalXp - XP totale accumulée
 * @returns Niveau actuel du monstre
 */
export function calculateLevelFromXp (totalXp: number): number {
  let level = 1
  let xpForNextLevel = MONSTER_LEVELING.BASE_XP_REQUIRED

  while (totalXp >= xpForNextLevel && level < MONSTER_LEVELING.MAX_LEVEL) {
    level++
    xpForNextLevel += calculateXpRequired(level)
  }

  return level
}

/**
 * Configuration de la décroissance des stats au fil du temps
 */
export const MONSTER_DECAY = {
  /** Baisse de faim par heure */
  HUNGER_DECAY_PER_HOUR: 5,

  /** Baisse de bonheur par heure */
  HAPPINESS_DECAY_PER_HOUR: 3,

  /** Baisse d'énergie par heure */
  ENERGY_DECAY_PER_HOUR: 4,

  /** Intervalle de mise à jour (en ms) */
  UPDATE_INTERVAL: 3600000 // 1 heure
} as const

/**
 * Configuration des actions sur les monstres
 */
export const MONSTER_ACTIONS = {
  /** Restauration de faim par action "nourrir" */
  FEED_HUNGER_RESTORE: 20,

  /** Bonus de bonheur par action "nourrir" */
  FEED_HAPPINESS_BONUS: 5,

  /** Restauration de bonheur par action "jouer" */
  PLAY_HAPPINESS_RESTORE: 25,

  /** Coût d'énergie par action "jouer" */
  PLAY_ENERGY_COST: 10,

  /** Restauration d'énergie par action "dormir" */
  SLEEP_ENERGY_RESTORE: 30,

  /** Restauration de bonheur par action "nettoyer" */
  CLEAN_HAPPINESS_RESTORE: 15
} as const

/**
 * Configuration des limites du joueur
 */
export const PLAYER_LIMITS = {
  /** Nombre maximum de monstres par joueur */
  MAX_MONSTERS: 10,

  /** Longueur minimale du nom d'un monstre */
  MIN_NAME_LENGTH: 3,

  /** Longueur maximale du nom d'un monstre */
  MAX_NAME_LENGTH: 20
} as const

/**
 * Export groupé
 */
export const MONSTERS_CONFIG = {
  pricing: MONSTER_PRICING,
  baseStats: MONSTER_BASE_STATS,
  limits: MONSTER_STAT_LIMITS,
  leveling: MONSTER_LEVELING,
  decay: MONSTER_DECAY,
  actions: MONSTER_ACTIONS,
  playerLimits: PLAYER_LIMITS
} as const
