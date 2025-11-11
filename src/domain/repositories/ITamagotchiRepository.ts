import type { Tamagotchi } from '../entities/Tamagotchi'
import type { GalleryFilters, PaginationParams, EnrichedMonster } from '@/shared/types/gallery'

export interface ITamagotchiRepository {
  findById: (id: string) => Promise<Tamagotchi | null>
  findByOwnerId: (ownerId: string) => Promise<Tamagotchi[]>
  save: (tamagotchi: Tamagotchi) => Promise<Tamagotchi>
  delete: (id: string) => Promise<boolean>
  update: (tamagotchi: Tamagotchi) => Promise<Tamagotchi>
  findAll: () => Promise<Tamagotchi[]>
  findPublicMonsters: (filters: GalleryFilters, pagination: PaginationParams) => Promise<{ monsters: EnrichedMonster[], total: number }>
}
