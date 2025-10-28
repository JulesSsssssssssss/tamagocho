import type { Tamagotchi } from '../entities/Tamagotchi'

export interface ITamagotchiRepository {
  findById: (id: string) => Promise<Tamagotchi | null>
  findByOwnerId: (ownerId: string) => Promise<Tamagotchi[]>
  save: (tamagotchi: Tamagotchi) => Promise<Tamagotchi>
  delete: (id: string) => Promise<boolean>
  update: (tamagotchi: Tamagotchi) => Promise<Tamagotchi>
  findAll: () => Promise<Tamagotchi[]>
}
