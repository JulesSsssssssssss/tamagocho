import { NextResponse } from 'next/server'
import { TamagotchiRepository } from '@/infrastructure/repositories'
import { ApplyHealthDecayUseCase } from '@/application'

export async function POST (): Promise<NextResponse> {
  try {
    const repository = new TamagotchiRepository()
    const useCase = new ApplyHealthDecayUseCase(repository)

    // Apply health decay to all tamagotchis
    await useCase.executeAll()

    return NextResponse.json(
      { message: 'Health decay applied successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error applying health decay:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
