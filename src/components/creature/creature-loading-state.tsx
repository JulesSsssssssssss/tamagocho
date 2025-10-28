import { memo } from 'react'

/**
 * Composant d'état de chargement pour la page créature
 *
 * Responsabilités (SRP) :
 * - Affichage d'un skeleton/loader pendant le chargement
 * - Feedback visuel pour l'utilisateur
 *
 * Optimisation (OCP) :
 * - Composant pur mémoïsé
 * - Pas de props, toujours stable
 *
 * @returns {React.ReactNode} État de chargement
 *
 * @example
 * ```tsx
 * if (isLoading) return <CreatureLoadingState />
 * ```
 */
const CreatureLoadingState = memo(function CreatureLoadingState (): React.ReactNode {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
      <div className='w-full max-w-2xl space-y-6'>
        {/* Header skeleton */}
        <div className='bg-white rounded-3xl p-6 shadow-lg animate-pulse'>
          <div className='flex items-center gap-4'>
            <div className='h-16 w-16 bg-slate-200 rounded-full' />
            <div className='flex-1 space-y-2'>
              <div className='h-6 bg-slate-200 rounded w-1/2' />
              <div className='h-4 bg-slate-200 rounded w-1/3' />
            </div>
          </div>
        </div>

        {/* Avatar skeleton */}
        <div className='bg-white rounded-3xl p-8 shadow-lg animate-pulse'>
          <div className='h-64 bg-slate-200 rounded-3xl' />
        </div>

        {/* Info skeleton */}
        <div className='bg-white rounded-3xl p-6 shadow-lg animate-pulse space-y-4'>
          <div className='h-4 bg-slate-200 rounded w-3/4' />
          <div className='h-4 bg-slate-200 rounded w-1/2' />
          <div className='h-4 bg-slate-200 rounded w-2/3' />
        </div>

        {/* Loading text */}
        <div className='text-center'>
          <p className='text-slate-600 font-medium'>
            Chargement de votre créature...
          </p>
        </div>
      </div>
    </div>
  )
})

export default CreatureLoadingState
