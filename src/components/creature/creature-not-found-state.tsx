'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../button'

/**
 * Composant d'état "créature introuvable"
 * 
 * Responsabilités (SRP) :
 * - Affichage du message "not found"
 * - Redirection vers le dashboard
 * 
 * Optimisation (OCP) :
 * - Composant pur mémoïsé
 * - Pas de props
 * 
 * @returns {React.ReactNode} État "introuvable"
 * 
 * @example
 * ```tsx
 * if (!creature) return <CreatureNotFoundState />
 * ```
 */
const CreatureNotFoundState = memo(function CreatureNotFoundState (): React.ReactNode {
  const router = useRouter()

  return (
    <div className='flex items-center justify-center min-h-screen p-8'>
      <div className='w-full max-w-md'>
        <div className='bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 text-center shadow-lg'>
          {/* Icon 404 */}
          <div className='mb-6 text-6xl' aria-hidden='true'>
            🔍
          </div>

          {/* Titre */}
          <h2 className='text-2xl font-bold text-slate-900 mb-4'>
            Créature introuvable
          </h2>

          {/* Description */}
          <p className='text-slate-600 mb-6'>
            Cette créature n'existe pas ou vous n'avez pas l'autorisation d'y accéder.
          </p>

          {/* Action */}
          <Button
            onClick={() => { router.push('/dashboard') }}
            variant='default'
            size='lg'
            className='w-full sm:w-auto'
          >
            ← Retour au dashboard
          </Button>
        </div>
      </div>
    </div>
  )
})

export default CreatureNotFoundState
