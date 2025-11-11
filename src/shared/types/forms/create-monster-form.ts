import type { MonsterState, MonsterTraits } from '@/shared/types/monster'

export interface CreateMonsterFormValues {
  name: string
  traits: MonsterTraits
  level: number
  state: MonsterState
}

export interface CreateMonsterFormProps {
  onSubmit: (values: CreateMonsterFormValues) => void
  onCancel: () => void
}
