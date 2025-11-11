/**
 * Types pour la galerie communautaire de monstres
 *
 * Feature 3.2: Page Galerie Communautaire
 */

import type { MonsterState } from './monster'
import type { Tamagotchi } from '@/domain/entities/Tamagotchi'

/**
 * Monstre enrichi avec items équipés (depuis MongoDB)
 */
export interface EnrichedMonster {
  tamagotchi: Tamagotchi
  equippedItems: {
    hat: string | null
    glasses: string | null
    shoes: string | null
  }
  equippedBackground: string | null
}

/**
 * Filtres disponibles pour la galerie
 */
export interface GalleryFilters {
  /** Filtrer par niveau minimum */
  minLevel?: number
  /** Filtrer par niveau maximum */
  maxLevel?: number
  /** Filtrer par état du monstre */
  state?: MonsterState
  /** Tri: 'newest' (date DESC) | 'oldest' (date ASC) | 'level' (niveau DESC) */
  sortBy?: 'newest' | 'oldest' | 'level'
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  /** Numéro de page (commence à 1) */
  page: number
  /** Nombre d'éléments par page (défaut: 12) */
  limit: number
}

/**
 * Monstre public pour affichage galerie
 * (version allégée sans données sensibles)
 */
export interface PublicMonster {
  /** ID du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Niveau du monstre */
  level: number
  /** État émotionnel actuel */
  state: MonsterState
  /** Traits visuels (JSON stringifié) */
  traits: string
  /** Items équipés */
  equippedItems?: {
    hat: string | null
    glasses: string | null
    shoes: string | null
  }
  /** Fond d'écran équipé */
  equippedBackground?: string | null
  /** Nom du créateur (anonymisé si nécessaire) */
  creatorName: string
  /** Date de création */
  createdAt: Date
}

/**
 * Réponse API de la galerie
 */
export interface GalleryResponse {
  /** Liste des monstres publics */
  monsters: PublicMonster[]
  /** Nombre total de monstres correspondant aux filtres */
  total: number
  /** Page actuelle */
  page: number
  /** Nombre d'éléments par page */
  limit: number
  /** Y a-t-il une page suivante ? */
  hasMore: boolean
  /** Nombre total de pages */
  totalPages: number
}

/**
 * Paramètres de requête galerie (URL query params)
 */
export interface GalleryQueryParams {
  page?: string
  limit?: string
  minLevel?: string
  maxLevel?: string
  state?: string
  sortBy?: string
}
