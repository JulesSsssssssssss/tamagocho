import type { Tamagotchi, ITamagotchiRepository } from '@/domain'

export class CleanTamagotchiUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  async execute (tamagotchiId: string): Promise<Tamagotchi> {
    const tamagotchi = await this.repository.findById(tamagotchiId)
    if (tamagotchi == null) throw new Error('Tamagotchi not found')

    tamagotchi.clean()
    return await this.repository.update(tamagotchi)
  }
}
