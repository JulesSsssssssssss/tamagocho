/**
 * Configuration des Récompenses (Koins)
 *
 * Centralise tous les montants de Koins pour chaque action du jeu.
 * Principe: Aucune valeur magique dans le code - tout est ici.
 *
 * @module config/rewards
 */

/**
 * Récompenses pour les actions sur les monstres
 */
export const MONSTER_ACTION_REWARDS = {
  /** Koins gagnés pour nourrir un monstre */
  FEED: 10,

  /** Koins gagnés pour jouer avec un monstre */
  PLAY: 10,

  /** Koins gagnés pour endormir un monstre */
  SLEEP: 10,

  /** Koins gagnés pour nettoyer un monstre */
  CLEAN: 10,

  /** Koins gagnés pour soigner un monstre (si applicable) */
  HEAL: 20
} as const

/**
 * Récompenses pour les connexions et streaks
 */
export const LOGIN_REWARDS = {
  /** Koins pour la connexion quotidienne */
  DAILY_LOGIN: 25,

  /** Bonus pour 7 jours consécutifs */
  STREAK_7_DAYS: 100,

  /** Bonus pour 30 jours consécutifs */
  STREAK_30_DAYS: 500,

  /** Bonus initial pour un nouveau joueur */
  INITIAL_BONUS: 100
} as const

/**
 * Récompenses pour la progression du monstre
 */
export const PROGRESSION_REWARDS = {
  /** Koins de base pour un level up */
  LEVEL_UP_BASE: 50,

  /** Formule: LEVEL_UP_BASE + (niveau × LEVEL_UP_PER_LEVEL) */
  LEVEL_UP_PER_LEVEL: 50,

  /** Koins pour 7 jours de survie d'un monstre */
  SURVIVAL_7_DAYS: 75,

  /** Koins pour 30 jours de survie d'un monstre */
  SURVIVAL_30_DAYS: 300
} as const

/**
 * Calcule la récompense en Koins pour un level up
 *
 * Formule : Base + (niveau × multiplicateur)
 * Exemple : Niveau 5 → 50 + (5 × 50) = 300 Koins
 *
 * @param level - Nouveau niveau atteint par le monstre
 * @returns Montant de Koins à récompenser
 */
export function calculateLevelUpReward (level: number): number {
  if (level <= 0) {
    throw new Error('Level must be positive')
  }
  return PROGRESSION_REWARDS.LEVEL_UP_BASE + (level * PROGRESSION_REWARDS.LEVEL_UP_PER_LEVEL)
}

/**
 * Calcule la récompense en Koins basée sur le niveau du monstre
 * Utilisé après certaines actions (variante de la formule)
 *
 * @param monsterLevel - Niveau actuel du monstre
 * @returns Montant de Koins à récompenser
 */
export function calculateCoinsReward (monsterLevel: number): number {
  // Formule simple : niveau du monstre + 1
  return Math.max(2, monsterLevel + 1)
}

/**
 * Récompenses diverses
 */
export const MISC_REWARDS = {
  /** Koins pour une quête quotidienne complétée */
  DAILY_QUEST_COMPLETE: 50,

  /** Koins pour toutes les quêtes quotidiennes complétées */
  ALL_DAILY_QUESTS: 150,

  /** Koins bonus pour un événement spécial */
  SPECIAL_EVENT: 100
} as const

/**
 * Export groupé de toutes les récompenses
 */
export const REWARDS_CONFIG = {
  actions: MONSTER_ACTION_REWARDS,
  login: LOGIN_REWARDS,
  progression: PROGRESSION_REWARDS,
  misc: MISC_REWARDS
} as const

/**
 * Type helper pour les raisons de transactions
 */
export type RewardReason =
  | 'DAILY_LOGIN'
  | 'FEED_MONSTER'
  | 'PLAY_WITH_MONSTER'
  | 'HEAL_MONSTER'
  | 'REST_MONSTER'
  | 'LEVEL_UP'
  | 'STREAK_BONUS'
  | 'MONSTER_SURVIVAL'
  | 'INITIAL_BONUS'
  | 'QUEST_COMPLETE'
