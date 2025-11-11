/**
 * GalleryFilters - Composant de filtrage pour la galerie
 *
 * Responsabilités (SRP):
 * - Afficher les contrôles de filtrage (niveau, état, tri)
 * - Gérer les changements de filtres
 * - Bouton de réinitialisation
 *
 * Props: filters, onFiltersChange, onReset
 * État: Aucun (contrôlé par le parent)
 * Performance: React.memo pour éviter les re-renders inutiles
 */

import { memo, useCallback } from 'react'
import type { GalleryFilters as GalleryFiltersType } from '@/shared/types/gallery'
import { MONSTER_STATES } from '@/shared/types/monster'
import PixelButton from '@/components/ui/pixel-button'

interface GalleryFiltersProps {
  filters: GalleryFiltersType
  onFiltersChange: (filters: GalleryFiltersType) => void
  onReset: () => void
}

/**
 * Composant GalleryFilters - Optimisé avec React.memo
 */
export const GalleryFilters = memo(function GalleryFiltersComponent ({
  filters,
  onFiltersChange,
  onReset
}: GalleryFiltersProps): React.ReactNode {
  // Gestion du changement de niveau min
  const handleMinLevelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onFiltersChange({
      ...filters,
      minLevel: value !== '' ? parseInt(value, 10) : undefined
    })
  }, [filters, onFiltersChange])

  // Gestion du changement de niveau max
  const handleMaxLevelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onFiltersChange({
      ...filters,
      maxLevel: value !== '' ? parseInt(value, 10) : undefined
    })
  }, [filters, onFiltersChange])

  // Gestion du changement d'état
  const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFiltersChange({
      ...filters,
      state: value !== '' ? value as any : undefined
    })
  }, [filters, onFiltersChange])

  // Gestion du changement de tri
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFiltersChange({
      ...filters,
      sortBy: value !== '' ? value as any : undefined
    })
  }, [filters, onFiltersChange])

  return (
    <div className='p-4'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-bold text-yellow-400 flex items-center gap-2 font-mono tracking-wider' style={{ textShadow: '0 0 15px rgba(234, 179, 8, 0.8)' }}>
            <span>🔍</span>
            <span>FILTRES</span>
          </h3>
          <PixelButton
            size='sm'
            variant='ghost'
            onClick={onReset}
            icon='🔄'
          >
            Réinitialiser
          </PixelButton>
        </div>

        {/* Filtres */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Niveau Min */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-white font-mono tracking-wider'>
              NIVEAU MIN
            </label>
            <input
              type='number'
              min='1'
              max='100'
              value={filters.minLevel ?? ''}
              onChange={handleMinLevelChange}
              placeholder='1'
              className='w-full px-3 py-2 bg-slate-800 text-white border-2 border-slate-600 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-200 font-mono'
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Niveau Max */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-white font-mono tracking-wider'>
              NIVEAU MAX
            </label>
            <input
              type='number'
              min='1'
              max='100'
              value={filters.maxLevel ?? ''}
              onChange={handleMaxLevelChange}
              placeholder='100'
              className='w-full px-3 py-2 bg-slate-800 text-white border-2 border-slate-600 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-200 font-mono'
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* État */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-white font-mono tracking-wider'>
              ÉTAT
            </label>
            <select
              value={filters.state ?? ''}
              onChange={handleStateChange}
              className='w-full px-3 py-2 bg-slate-800 text-white border-2 border-slate-600 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-200 cursor-pointer font-mono uppercase'
              style={{ imageRendering: 'pixelated' }}
            >
              <option value=''>TOUS</option>
              {MONSTER_STATES.map((state) => (
                <option key={state} value={state} className='uppercase'>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className='space-y-2'>
            <label className='block text-xs font-bold text-white font-mono tracking-wider'>
              TRIER PAR
            </label>
            <select
              value={filters.sortBy ?? 'newest'}
              onChange={handleSortChange}
              className='w-full px-3 py-2 bg-slate-800 text-white border-2 border-slate-600 rounded-lg focus:border-yellow-500 focus:outline-none transition-all duration-200 cursor-pointer font-mono'
              style={{ imageRendering: 'pixelated' }}
            >
              <option value='newest'>PLUS RÉCENTS</option>
              <option value='oldest'>PLUS ANCIENS</option>
              <option value='level'>NIVEAU ↓</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
})
