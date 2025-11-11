import type { Tamagotchi, ITamagotchiRepository } from '@/domain'

export class PlayWithTamagotchiUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  async execute (tamagotchiId: string): Promise<Tamagotchi> {
    const tamagotchi = await this.repository.findById(tamagotchiId)
    if (tamagotchi == null) throw new Error('Tamagotchi not found')

    tamagotchi.play()
    return await this.repository.update(tamagotchi)
  }
}
