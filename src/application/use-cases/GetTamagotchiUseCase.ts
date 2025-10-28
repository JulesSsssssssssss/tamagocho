import type { Tamagotchi, ITamagotchiRepository } from '@/domain'

export class GetTamagotchiUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  async execute (tamagotchiId: string): Promise<Tamagotchi | null> {
    return await this.repository.findById(tamagotchiId)
  }
}
