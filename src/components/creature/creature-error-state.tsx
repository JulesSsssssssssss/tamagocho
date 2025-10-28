'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../button'

/**
 * Props du composant CreatureErrorState
 */
interface CreatureErrorStateProps {
  /** Message d'erreur à afficher */
  message: string
  /** Fonction de retry optionnelle */
  onRetry?: () => void
}

/**
 * Composant d'état d'erreur pour la page créature
 * 
 * Responsabilités (SRP) :
 * - Affichage d'un message d'erreur clair
 * - Proposition d'actions (retry, retour dashboard)
 * 
 * Optimisation (OCP) :
 * - Composant mémoïsé
 * - Props stables
 * 
 * @param {CreatureErrorStateProps} props - Props du composant
 * @returns {React.ReactNode} État d'erreur
 * 
 * @example
 * ```tsx
 * if (error) return <CreatureErrorState message={error} onRetry={refresh} />
 * ```
 */
const CreatureErrorState = memo(function CreatureErrorState ({
  message,
  onRetry
}: CreatureErrorStateProps): React.ReactNode {
  const router = useRouter()

  return (
    <div className='flex items-center justify-center min-h-screen p-8'>
      <div className='w-full max-w-md'>
        <div className='bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center shadow-lg'>
          {/* Icon d'erreur */}
          <div className='mb-6 text-6xl' aria-hidden='true'>
            ⚠️
          </div>

          {/* Titre */}
          <h2 className='text-2xl font-bold text-red-900 mb-4'>
            Oups ! Une erreur s'est produite
          </h2>

          {/* Message d'erreur */}
          <p className='text-red-700 mb-6'>
            {message}
          </p>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {onRetry !== undefined && (
              <Button
                onClick={onRetry}
                variant='default'
                size='lg'
              >
                🔄 Réessayer
              </Button>
            )}
            <Button
              onClick={() => { router.push('/dashboard') }}
              variant='outline'
              size='lg'
            >
              ← Retour au dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureErrorState
