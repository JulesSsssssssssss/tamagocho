/**
 * Configuration Globale du Jeu
 *
 * Centralise toutes les constantes de gameplay générales :
 * - Intervalles de temps
 * - Limites globales
 * - Paramètres de difficulté
 *
 * @module config/game
 */

/**
 * Intervalles de temps (en millisecondes)
 */
export const TIME_INTERVALS = {
  /** 1 seconde */
  ONE_SECOND: 1000,

  /** 1 minute */
  ONE_MINUTE: 60 * 1000,

  /** 1 heure */
  ONE_HOUR: 60 * 60 * 1000,

  /** 1 jour */
  ONE_DAY: 24 * 60 * 60 * 1000,

  /** Intervalle de mise à jour des stats des monstres */
  MONSTER_UPDATE_INTERVAL: 60 * 60 * 1000, // 1 heure

  /** Intervalle de sauvegarde automatique */
  AUTO_SAVE_INTERVAL: 5 * 60 * 1000, // 5 minutes

  /** Délai de cooldown entre actions */
  ACTION_COOLDOWN: 1000 // 1 seconde
} as const

/**
 * Configuration du système de jeu
 */
export const GAME_SETTINGS = {
  /** Nom du jeu */
  GAME_NAME: 'Tamagotcho',

  /** Version actuelle */
  VERSION: '1.0.0',

  /** Mode debug activé */
  DEBUG_MODE: process.env.NODE_ENV === 'development',

  /** Activer les logs détaillés */
  VERBOSE_LOGS: false
} as const

/**
 * Configuration des notifications
 */
export const NOTIFICATION_CONFIG = {
  /** Durée d'affichage des toasts (ms) */
  TOAST_DURATION: 3000,

  /** Durée d'affichage des toasts d'erreur (ms) */
  ERROR_TOAST_DURATION: 5000,

  /** Durée d'affichage des toasts de succès (ms) */
  SUCCESS_TOAST_DURATION: 2000,

  /** Nombre maximum de notifications simultanées */
  MAX_NOTIFICATIONS: 3
} as const

/**
 * Configuration de l'UI
 */
export const UI_CONFIG = {
  /** Durée des animations (ms) */
  ANIMATION_DURATION: 300,

  /** Durée des transitions longues (ms) */
  LONG_TRANSITION: 600,

  /** Délai avant affichage du loader */
  LOADER_DELAY: 500,

  /** Taille par défaut des canvas pixel art */
  DEFAULT_CANVAS_SIZE: 120
} as const

/**
 * Configuration de la pagination
 */
export const PAGINATION_CONFIG = {
  /** Nombre d'items par page dans la boutique */
  SHOP_ITEMS_PER_PAGE: 12,

  /** Nombre d'items par page dans l'inventaire */
  INVENTORY_ITEMS_PER_PAGE: 20,

  /** Nombre de transactions par page */
  TRANSACTIONS_PER_PAGE: 10
} as const

/**
 * Messages d'erreur standardisés
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur réseau. Vérifie ta connexion.',
  SERVER_ERROR: 'Erreur serveur. Réessaye plus tard.',
  UNAUTHORIZED: 'Tu dois être connecté pour faire ça.',
  INSUFFICIENT_FUNDS: 'Pas assez de Koins !',
  INVALID_INPUT: 'Données invalides.',
  NOT_FOUND: 'Ressource introuvable.',
  ALREADY_EXISTS: 'Existe déjà.',
  RATE_LIMIT: 'Trop de requêtes. Ralentis un peu !',
  UNKNOWN: 'Une erreur inconnue est survenue.'
} as const

/**
 * Messages de succès standardisés
 */
export const SUCCESS_MESSAGES = {
  MONSTER_CREATED: 'Monstre créé avec succès ! 🎉',
  MONSTER_FED: 'Monstre nourri ! 🍕',
  MONSTER_PLAYED: 'Monstre amusé ! 🎮',
  MONSTER_SLEPT: 'Monstre reposé ! 😴',
  MONSTER_CLEANED: 'Monstre propre ! ✨',
  ITEM_PURCHASED: 'Article acheté ! 🛒',
  ITEM_EQUIPPED: 'Article équipé ! 👔',
  COINS_ADDED: 'Koins ajoutés ! 💰',
  QUEST_COMPLETED: 'Quête terminée ! 🏆',
  LEVEL_UP: 'Niveau supérieur ! ⭐'
} as const

/**
 * Emojis standards utilisés dans le jeu
 */
export const GAME_EMOJIS = {
  COIN: '💰',
  MONSTER: '👾',
  FOOD: '🍕',
  PLAY: '🎮',
  SLEEP: '😴',
  CLEAN: '✨',
  SHOP: '🛒',
  HAT: '🎩',
  GLASSES: '👓',
  SHOES: '👟',
  BACKGROUND: '🖼️',
  QUEST: '📋',
  LEVEL_UP: '⭐',
  TROPHY: '🏆',
  FIRE: '🔥',
  HEART: '❤️',
  STAR: '⭐',
  WARNING: '⚠️',
  ERROR: '❌',
  SUCCESS: '✅'
} as const

/**
 * Export groupé
 */
export const GAME_CONFIG = {
  settings: GAME_SETTINGS,
  timeIntervals: TIME_INTERVALS,
  notifications: NOTIFICATION_CONFIG,
  ui: UI_CONFIG,
  pagination: PAGINATION_CONFIG,
  messages: {
    errors: ERROR_MESSAGES,
    success: SUCCESS_MESSAGES
  },
  emojis: GAME_EMOJIS
} as const
