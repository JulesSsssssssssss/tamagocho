'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from '../button'
import InputField from '../input'
import { PixelMonster } from '../monsters'
import { generateRandomTraits } from '@/services/monsters/monster-generator'
import {
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterState,
  type MonsterTraits
} from '@/shared/types/monster'
import {
  type CreateMonsterFormProps
} from '@/shared/types/forms/create-monster-form'
import {
  createInitialFormDraft,
  type CreateMonsterFormDraft,
  type CreateMonsterFormErrors,
  validateCreateMonsterForm
} from '@/shared/validation/create-monster-form-validation'

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux 😊',
  sad: 'Triste 😢',
  angry: 'Fâché 😡',
  hungry: 'Affamé 😋',
  sleepy: 'Somnolent 😴'
}

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [draft, setDraft] = useState<CreateMonsterFormDraft>(() => createInitialFormDraft())
  const [errors, setErrors] = useState<CreateMonsterFormErrors>({})
  const [traits, setTraits] = useState<MonsterTraits | null>(null)
  const [previewState, setPreviewState] = useState<MonsterState>(DEFAULT_MONSTER_STATE)

  useEffect(() => {
    if (traits === null) {
      setTraits(generateRandomTraits())
    }
  }, [traits])

  const hasActiveErrors = useMemo(() => {
    return traits === null || Object.values(errors).some((value) => Boolean(value))
  }, [errors, traits])

  const handleGenerateMonster = (): void => {
    const nextTraits = generateRandomTraits()
    setTraits(nextTraits)
    setPreviewState(DEFAULT_MONSTER_STATE)
    setErrors((previous) => ({ ...previous, design: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const { errors: validationErrors, values } = validateCreateMonsterForm(draft, traits)

    if (values === undefined) {
      setErrors(validationErrors)
      return
    }

    onSubmit({
      ...values,
      state: previewState
    })
    setDraft(createInitialFormDraft())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)
    setErrors({})
  }

  const handleCancel = (): void => {
    setDraft(createInitialFormDraft())
    setTraits(null)
    setPreviewState(DEFAULT_MONSTER_STATE)
    setErrors({})
    onCancel()
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <InputField
        label='Nom'
        name='name'
        value={draft.name}
        onChangeText={(value: string) => {
          setDraft((previous) => ({ ...previous, name: value }))
          if (errors.name !== undefined) {
            setErrors((previous) => ({ ...previous, name: undefined }))
          }
        }}
        error={errors.name}
      />

      <section className='space-y-4 rounded-3xl border border-moccaccino-100 bg-white/60 p-4 shadow-inner'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-lg font-semibold text-gray-800'>Votre créature</h3>
          <Button onClick={handleGenerateMonster} type='button' variant='outline'>
            Générer mon monstre
          </Button>
        </div>

        <div className='flex items-center justify-center rounded-3xl bg-slate-50/70 p-4'>
          {traits !== null && (
            <PixelMonster traits={traits} state={previewState} />
          )}
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          {MONSTER_STATES.map((state) => (
            <Button
              key={state}
              type='button'
              size='sm'
              variant={state === previewState ? 'default' : 'ghost'}
              onClick={() => setPreviewState(state)}
            >
              {MONSTER_STATE_LABELS[state]}
            </Button>
          ))}
        </div>

        {errors.design !== undefined && (
          <span className='text-sm text-red-500'>
            {errors.design}
          </span>
        )}
      </section>

      <div className='flex justify-end gap-3'>
        <Button onClick={handleCancel} type='button' variant='ghost'>
          Annuler
        </Button>
        <Button disabled={hasActiveErrors} type='submit'>
          Créer
        </Button>
      </div>
    </form>
  )
}

export default CreateMonsterForm
