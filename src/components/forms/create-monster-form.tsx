'use client'

import { useEffect, useMemo, useState } from 'react'
import InputField from '../input'
import { PixelMonster } from '../monsters'
import { generateRandomTraits } from '@/services/monsters/monster-generator'
import {
  DEFAULT_MONSTER_STATE,
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

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [draft, setDraft] = useState<CreateMonsterFormDraft>(() => createInitialFormDraft())
  const [errors, setErrors] = useState<CreateMonsterFormErrors>({})
  const [traits, setTraits] = useState<MonsterTraits | null>(null)

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
      state: DEFAULT_MONSTER_STATE
    })
    setDraft(createInitialFormDraft())
    setTraits(null)
    setErrors({})
  }

  const handleCancel = (): void => {
    setDraft(createInitialFormDraft())
    setTraits(null)
    setErrors({})
    onCancel()
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      {/* Champ nom avec style pixel art */}
      <div className='space-y-2'>
        <label htmlFor='name' className='block text-sm font-bold text-yellow-400 uppercase tracking-wide'>
          Nom de votre créature
        </label>
        <InputField
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
      </div>

      {/* Prévisualisation du monstre - Style pixel art gaming */}
      <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 shadow-xl space-y-4'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-yellow-500 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
            <h3 className='text-lg font-bold text-yellow-400 uppercase tracking-wide'>🎨 Apparence du monstre</h3>
          </div>
          <button
            onClick={handleGenerateMonster}
            type='button'
            className='px-4 py-2 bg-slate-700 hover:bg-yellow-500 text-white hover:text-slate-900 rounded-lg border-2 border-slate-600 hover:border-yellow-400 transition-all duration-200 font-bold text-sm uppercase tracking-wide shadow-lg'
          >
            🎲 Régénérer
          </button>
        </div>

        <div className='relative group'>
          {/* Container du monstre avec grille pixel */}
          <div className='relative flex items-center justify-center rounded-2xl bg-slate-950/50 p-8 border-2 border-slate-700 min-h-[240px] overflow-hidden'>
            {/* Grille pixel-art en fond */}
            <div
              className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 pointer-events-none'
              style={{ imageRendering: 'pixelated' }}
            />

            {traits !== null
              ? (
                <div className='relative z-10 transform transition-transform duration-300 group-hover:scale-110'>
                  <PixelMonster traits={traits} state={DEFAULT_MONSTER_STATE} />
                </div>
                )
              : (
                <div className='relative z-10 flex flex-col items-center gap-3 text-gray-400'>
                  <div className='w-16 h-16 border-4 border-slate-700 border-t-yellow-500 rounded-lg animate-spin' />
                  <span className='text-sm font-bold uppercase tracking-wide'>Génération...</span>
                </div>
                )}
          </div>

          {/* Badge informatif avec style pixel */}
          <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-yellow-500 rounded-lg shadow-lg border-2 border-yellow-400'>
            <span className='text-xs font-bold text-slate-900 uppercase tracking-wider'>😊 Votre monstre sera heureux !</span>
          </div>
        </div>

        {errors.design !== undefined && (
          <div className='flex items-center gap-2 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl'>
            <span className='text-red-400 text-lg'>⚠️</span>
            <span className='text-sm text-red-400 font-bold'>
              {errors.design}
            </span>
          </div>
        )}
      </div>

      {/* Boutons d'action avec style pixel art gaming */}
      <div className='flex justify-end gap-3 pt-4'>
        <button
          onClick={handleCancel}
          type='button'
          className='px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border-2 border-slate-700 hover:border-slate-600 transition-all duration-200 font-bold uppercase tracking-wide'
        >
          Annuler
        </button>
        <button
          disabled={hasActiveErrors}
          type='submit'
          className='px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition-all duration-200 font-bold uppercase tracking-wide shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-500'
        >
          🎉 Créer ma créature
        </button>
      </div>
    </form>
  )
}

export default CreateMonsterForm
