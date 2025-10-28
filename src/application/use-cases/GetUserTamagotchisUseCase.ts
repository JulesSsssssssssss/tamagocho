import type { ITamagotchiRepository, Tamagotchi } from '@/domain'

export class GetUserTamagotchisUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  async execute (userId: string): Promise<Tamagotchi[]> {
    return await this.repository.findByOwnerId(userId)
  }
}
