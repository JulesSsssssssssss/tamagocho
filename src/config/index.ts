/**
 * Point d'entrée centralisé pour toutes les configurations
 *
 * Barrel export de tous les fichiers de configuration.
 * Permet d'importer facilement n'importe quelle config :
 *
 * @example
 * ```typescript
 * import { REWARDS_CONFIG, SHOP_CONFIG } from '@/config'
 * ```
 *
 * @module config
 */

// Récompenses (Koins)
export * from './rewards'

// Accessoires (Hats, Glasses, Shoes)
export * from './accessories.config'

// Arrière-plans (Backgrounds)
export * from './backgrounds.config'

// Quêtes journalières (fichier corrompu, temporairement désactivé)
// export * from './quests.config'

// Configuration des monstres
export * from './monsters.config'

// Configuration de la boutique
export * from './shop.config'

// Configuration du portefeuille
export * from './wallet.config'

// Configuration globale du jeu
export * from './game.config'

// Configuration des prix (Stripe) - déjà existante
export * from './pricing'
