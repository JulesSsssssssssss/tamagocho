'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../button'

/**
 * Props du composant CreatureHeader
 */
interface CreatureHeaderProps {
  /** Nom de la créature */
  name: string
  /** Niveau de la créature */
  level: number
}

/**
 * En-tête de la page créature
 *
 * Responsabilités (SRP) :
 * - Affichage du nom et niveau de la créature
 * - Bouton de retour au dashboard
 *
 * Optimisation (OCP) :
 * - Composant pur mémoïsé
 * - Ne re-render que si name ou level change
 *
 * @param {CreatureHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête de la créature
 *
 * @example
 * ```tsx
 * <CreatureHeader name="Piko" level={5} />
 * ```
 */
const CreatureHeader = memo(function CreatureHeader ({
  name,
  level
}: CreatureHeaderProps): React.ReactNode {
  const router = useRouter()

  return (
    <header className='bg-slate-800/60 rounded-3xl p-6 shadow-lg ring-1 ring-yellow-500/20'>
      <div className='flex items-center justify-between gap-4'>
        {/* Bouton retour */}
        <Button
          onClick={() => { router.push('/dashboard') }}
          variant='ghost'
          size='sm'
          className='shrink-0 text-white hover:text-yellow-400'
        >
          ← Retour
        </Button>

        {/* Nom et niveau */}
        <div className='flex-1 text-center'>
          <h1 className='text-3xl font-bold text-white mb-1 font-mono tracking-wider'>
            {name}
          </h1>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-sm text-white font-mono'>Niveau</span>
            <span className='inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-400 ring-1 ring-yellow-500/30 font-mono'>
              <span aria-hidden='true'>⭐</span>
              {level}
            </span>
          </div>
        </div>

        {/* Spacer pour centrage */}
        <div className='w-20 shrink-0' />
      </div>
    </header>
  )
})

export default CreatureHeader
