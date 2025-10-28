import { DEFAULT_MONSTER_LEVEL, DEFAULT_MONSTER_STATE, type MonsterTraits } from '@/shared/types/monster'
import type { CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'

export interface CreateMonsterFormDraft {
  name: string
}

export type CreateMonsterFormErrors = Partial<Record<'name' | 'design', string>>

export interface CreateMonsterValidationResult {
  errors: CreateMonsterFormErrors
  values?: CreateMonsterFormValues
}

export const createInitialFormDraft = (): CreateMonsterFormDraft => ({
  name: ''
})

export function validateCreateMonsterForm (
  draft: CreateMonsterFormDraft,
  traits: MonsterTraits | null
): CreateMonsterValidationResult {
  const trimmedName = draft.name.trim()

  const errors: CreateMonsterFormErrors = {}

  if (trimmedName.length === 0) errors.name = 'Le nom est requis.'
  if (traits == null) errors.design = 'Générez votre créature avant de poursuivre.'

  if (Object.keys(errors).length > 0 || traits == null) {
    return { errors }
  }

  return {
    errors: {},
    values: {
      name: trimmedName,
      traits: { ...traits },
      level: DEFAULT_MONSTER_LEVEL,
      state: DEFAULT_MONSTER_STATE
    }
  }
}
