import type { ITamagotchiRepository } from '@/domain'

export class ApplyHealthDecayUseCase {
  constructor (private readonly repository: ITamagotchiRepository) {}

  async execute (tamagotchiId: string): Promise<void> {
    const tamagotchi = await this.repository.findById(tamagotchiId)
    if (tamagotchi == null) throw new Error('Tamagotchi not found')

    tamagotchi.decayHealth()
    await this.repository.update(tamagotchi)
  }

  async executeAll (): Promise<void> {
    const allTamagotchis = await this.repository.findAll()

    for (const tamagotchi of allTamagotchis) {
      tamagotchi.decayHealth()
      await this.repository.update(tamagotchi)
    }
  }
}
