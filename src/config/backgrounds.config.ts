/**
 * Configuration des Arrière-plans (Backgrounds)
 *
 * Centralise tous les arrière-plans disponibles dans la boutique.
 * Chaque background change l'environnement du monstre.
 *
 * @module config/backgrounds
 */

import type { BackgroundType, ItemRarity } from '@/shared/types/shop'

/**
 * Interface pour la définition d'un arrière-plan
 */
export interface BackgroundDefinition {
  /** Nom de l'arrière-plan */
  name: string
  /** Description détaillée */
  description: string
  /** Type de background (détermine l'image utilisée) */
  backgroundType: BackgroundType
  /** Rareté (détermine le prix) */
  rarity: ItemRarity
  /** Chemin vers l'image (optionnel si généré dynamiquement) */
  imageUrl?: string
}

/**
 * Labels français pour les types de backgrounds
 */
export const BACKGROUND_TYPE_LABELS: Record<BackgroundType, string> = {
  day: 'Chambre - Jour',
  garden: 'Jardin - Jour',
  night: 'Toit - Nuit'
}

/**
 * Descriptions détaillées des types de backgrounds
 */
export const BACKGROUND_TYPE_DESCRIPTIONS: Record<BackgroundType, string> = {
  day: 'Une chambre confortable avec une belle fenêtre ensoleillée',
  garden: 'Un jardin verdoyant avec des arbres et des fleurs',
  night: 'Un toit urbain sous un ciel étoilé'
}

/**
 * Catalogue des arrière-plans disponibles
 */
export const BACKGROUNDS_CATALOG: BackgroundDefinition[] = [
  {
    name: 'Chambre Ensoleillée',
    description: 'Une chambre confortable baignée de lumière naturelle. Parfait pour le repos et la détente.',
    backgroundType: 'day',
    rarity: 'common',
    imageUrl: '/backgrounds/day.png'
  },
  {
    name: 'Jardin Verdoyant',
    description: 'Un magnifique jardin avec des arbres, des fleurs et une atmosphère apaisante.',
    backgroundType: 'garden',
    rarity: 'rare',
    imageUrl: '/backgrounds/garden.png'
  },
  {
    name: 'Toit Étoilé',
    description: 'Un toit urbain sous un ciel nocturne parsemé d\'étoiles. Romantique et mystérieux.',
    backgroundType: 'night',
    rarity: 'epic',
    imageUrl: '/backgrounds/night.png'
  }
]

/**
 * Helper : Récupérer un background par son type
 */
export function getBackgroundByType (type: BackgroundType): BackgroundDefinition | undefined {
  return BACKGROUNDS_CATALOG.find(bg => bg.backgroundType === type)
}

/**
 * Helper : Récupérer le label d'un type de background
 */
export function getBackgroundLabel (type: BackgroundType): string {
  return BACKGROUND_TYPE_LABELS[type]
}

/**
 * Helper : Récupérer la description d'un type de background
 */
export function getBackgroundDescription (type: BackgroundType): string {
  return BACKGROUND_TYPE_DESCRIPTIONS[type]
}

/**
 * Helper : Récupérer tous les types de backgrounds disponibles
 */
export function getAllBackgroundTypes (): BackgroundType[] {
  return ['day', 'garden', 'night']
}

/**
 * Export groupé
 */
export const BACKGROUNDS_CONFIG = {
  catalog: BACKGROUNDS_CATALOG,
  labels: BACKGROUND_TYPE_LABELS,
  descriptions: BACKGROUND_TYPE_DESCRIPTIONS
} as const
