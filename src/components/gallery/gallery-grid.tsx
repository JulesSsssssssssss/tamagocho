/**
 * GalleryGrid - Grille d'affichage des monstres publics
 *
 * Responsabilités (SRP):
 * - Afficher une grille responsive de GalleryCard
 * - Gérer l'état de chargement (skeleton)
 * - Gérer l'état vide (aucun monstre)
 *
 * Props: monsters, loading, error
 * État: Aucun (contrôlé par le parent)
 * Performance: React.memo pour éviter les re-renders inutiles
 */

import { memo } from 'react'
import type { PublicMonster } from '@/shared/types/gallery'
import { GalleryCard } from './gallery-card'

interface GalleryGridProps {
  monsters: PublicMonster[]
  loading: boolean
  error?: string
}

/**
 * Skeleton de chargement pour une carte
 */
const SkeletonCard = memo(function SkeletonCard (): React.ReactNode {
  return (
    <div className='p-4 bg-slate-900/90 backdrop-blur-sm rounded-xl border-4 border-slate-700/30 animate-pulse relative'>
      {/* Grille pixel art */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 rounded-xl pointer-events-none' />

      <div className='relative space-y-3'>
        {/* Header skeleton */}
        <div className='flex items-center justify-between'>
          <div className='h-6 bg-slate-700 rounded w-2/3' />
          <div className='h-6 w-6 bg-slate-700 rounded' />
        </div>

        {/* Badges skeleton */}
        <div className='flex gap-2'>
          <div className='h-6 bg-slate-700 rounded w-20' />
          <div className='h-6 bg-slate-700 rounded w-24' />
        </div>

        {/* Traits skeleton */}
        <div className='flex gap-1'>
          <div className='h-5 bg-slate-700 rounded w-16' />
          <div className='h-5 bg-slate-700 rounded w-20' />
          <div className='h-5 bg-slate-700 rounded w-14' />
        </div>

        {/* Footer skeleton */}
        <div className='pt-3 border-t-2 border-slate-600/50 flex items-center justify-between'>
          <div className='h-4 bg-slate-700 rounded w-24' />
          <div className='h-4 bg-slate-700 rounded w-20' />
        </div>
      </div>
    </div>
  )
})

/**
 * État vide (aucun monstre)
 */
const EmptyState = memo(function EmptyState (): React.ReactNode {
  return (
    <div className='col-span-full flex flex-col items-center justify-center py-16 px-4'>
      <div className='text-8xl mb-4'>🌍</div>
      <h3 className='text-2xl font-bold text-yellow-400 mb-2 font-mono tracking-wider' style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.8)' }}>
        AUCUN MONSTRE PUBLIC
      </h3>
      <p className='text-gray-400 text-center max-w-md font-mono text-sm'>
        Il n'y a pas encore de monstres publics correspondant à vos critères.
        <br />
        Revenez plus tard ou modifiez vos filtres !
      </p>
    </div>
  )
})

/**
 * État d'erreur
 */
const ErrorState = memo(function ErrorState ({ error }: { error: string }): React.ReactNode {
  return (
    <div className='col-span-full flex flex-col items-center justify-center py-16 px-4'>
      <div className='text-8xl mb-4'>❌</div>
      <h3 className='text-2xl font-bold text-red-400 mb-2 font-mono tracking-wider' style={{ textShadow: '0 0 20px rgba(248, 113, 113, 0.8)' }}>
        ERREUR DE CHARGEMENT
      </h3>
      <p className='text-gray-400 text-center max-w-md font-mono text-sm'>
        {error}
      </p>
    </div>
  )
})

/**
 * Composant GalleryGrid - Optimisé avec React.memo
 */
export const GalleryGrid = memo(function GalleryGridComponent ({
  monsters,
  loading,
  error
}: GalleryGridProps): React.ReactNode {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {/* État de chargement */}
      {loading && (error === undefined || error === '') && (
        <>
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </>
      )}

      {/* État d'erreur */}
      {(error !== undefined && error !== '') && !loading && (
        <ErrorState error={error} />
      )}

      {/* État vide */}
      {!loading && (error === undefined || error === '') && monsters.length === 0 && (
        <EmptyState />
      )}

      {/* Grille de monstres */}
      {!loading && (error === undefined || error === '') && monsters.length > 0 && (
        <>
          {monsters.map((monster) => (
            <GalleryCard key={monster.id} monster={monster} />
          ))}
        </>
      )}
    </div>
  )
})
