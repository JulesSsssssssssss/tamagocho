'use client'

/**
 * Page Gallery - Galerie communautaire des monstres publics
 *
 * Responsabilités (SRP):
 * - Afficher la galerie des monstres publics
 * - Gérer les filtres et la pagination
 * - Appeler l'API /api/gallery
 *
 * État: filters, page, monsters, loading, error
 * Performance: useCallback pour les handlers, React.memo sur les composants enfants
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GalleryFilters as GalleryFiltersType, PublicMonster, GalleryResponse } from '@/shared/types/gallery'
import { GalleryFilters, GalleryGrid } from '@/components/gallery'
import PixelButton from '@/components/ui/pixel-button'
import { useQuestProgress } from '@/hooks/use-quest-progress'

// Force dynamic rendering pour useSearchParams
export const dynamic = 'force-dynamic'

/**
 * Composant de pagination
 */
function Pagination ({
  currentPage,
  totalPages,
  hasMore,
  onPageChange
}: {
  currentPage: number
  totalPages: number
  hasMore: boolean
  onPageChange: (page: number) => void
}): React.ReactNode {
  return (
    <div className='flex items-center justify-center gap-4'>
      {/* Bouton Précédent */}
      <PixelButton
        size='md'
        variant='ghost'
        onClick={() => { onPageChange(currentPage - 1) }}
        disabled={currentPage <= 1}
        icon='◀️'
      >
        Précédent
      </PixelButton>

      {/* Indicateur de page */}
      <div className='relative px-6 py-3 bg-slate-800 rounded-xl border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'>
        {/* Pixels dans les coins */}
        <div className='absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute bottom-1 right-1 w-2 h-2 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />

        <span className='text-yellow-400 font-bold font-mono tracking-wider' style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.8)' }}>
          PAGE {currentPage} / {totalPages}
        </span>
      </div>

      {/* Bouton Suivant */}
      <PixelButton
        size='md'
        variant='ghost'
        onClick={() => { onPageChange(currentPage + 1) }}
        disabled={!hasMore}
        icon='▶️'
      >
        Suivant
      </PixelButton>
    </div>
  )
}

/**
 * Page Galerie Communautaire
 */
export default function GalleryPage (): React.ReactNode {
  const router = useRouter()
  const { trackVisitGallery } = useQuestProgress()

  // Track visit à la gallery (une seule fois au montage)
  useEffect(() => {
    trackVisitGallery()
  }, [trackVisitGallery])

  // États
  const [monsters, setMonsters] = useState<PublicMonster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  // Filtres par défaut (ne pas utiliser searchParams pour éviter l'erreur de build)
  const [filters, setFilters] = useState<GalleryFiltersType>({
    minLevel: undefined,
    maxLevel: undefined,
    state: undefined,
    sortBy: 'newest'
  })

  // Fonction pour construire l'URL avec les query params
  const buildQueryString = useCallback((page: number, currentFilters: GalleryFiltersType): string => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', '12')

    if (currentFilters.minLevel !== undefined) {
      params.set('minLevel', currentFilters.minLevel.toString())
    }
    if (currentFilters.maxLevel !== undefined) {
      params.set('maxLevel', currentFilters.maxLevel.toString())
    }
    if (currentFilters.state !== undefined) {
      params.set('state', currentFilters.state)
    }
    if (currentFilters.sortBy !== undefined) {
      params.set('sortBy', currentFilters.sortBy)
    }

    return params.toString()
  }, [])

  // Fonction pour récupérer les monstres
  const fetchMonsters = useCallback(async (page: number, currentFilters: GalleryFiltersType): Promise<void> => {
    setLoading(true)
    setError(undefined)

    try {
      const queryString = buildQueryString(page, currentFilters)
      const response = await fetch(`/api/gallery?${queryString}`)

      if (!response.ok) {
        throw new Error('Failed to fetch gallery')
      }

      const data: GalleryResponse = await response.json()

      setMonsters(data.monsters)
      setTotal(data.total)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setHasMore(data.hasMore)
    } catch (err) {
      console.error('Error fetching gallery:', err)
      setError('Impossible de charger la galerie. Veuillez réessayer.')
      setMonsters([])
    } finally {
      setLoading(false)
    }
  }, [buildQueryString])

  // Effet: Récupérer les monstres au chargement et quand les filtres changent
  useEffect(() => {
    void fetchMonsters(currentPage, filters)
  }, [currentPage, filters, fetchMonsters])

  // Handler: Changement de filtres
  const handleFiltersChange = useCallback((newFilters: GalleryFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset à la page 1

    // Mise à jour de l'URL
    const queryString = buildQueryString(1, newFilters)
    router.push(`/gallery?${queryString}`)
  }, [buildQueryString, router])

  // Handler: Reset des filtres
  const handleResetFilters = useCallback(() => {
    const defaultFilters: GalleryFiltersType = { sortBy: 'newest' }
    setFilters(defaultFilters)
    setCurrentPage(1)
    router.push('/gallery')
  }, [router])

  // Handler: Changement de page
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)

    // Mise à jour de l'URL
    const queryString = buildQueryString(page, filters)
    router.push(`/gallery?${queryString}`)

    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [buildQueryString, filters, router])

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Effet de grille rétro en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none' />

      {/* Particules pixel-art - jaunes comme dans creature */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
        <div className='absolute bottom-1/4 right-1/4 w-3 h-3 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '2s' }} />
        <div className='absolute top-1/2 left-1/3 w-2 h-2 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '2.5s' }} />
      </div>

      {/* Contenu */}
      <div className='relative z-10 w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6'>
          {/* Header avec nom - Style creature */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-3 sm:border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
            {/* Pixels dans les coins */}
            <div className='absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />

            {/* Contenu header */}
            <div className='relative z-10'>
              {/* Bouton retour */}
              <div className='mb-3 sm:mb-4'>
                <PixelButton
                  size='md'
                  variant='ghost'
                  onClick={() => { router.push('/dashboard') }}
                  icon='←'
                >
                  Retour au Dashboard
                </PixelButton>
              </div>

              {/* Titre */}
              <div className='text-center'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 font-mono tracking-wider' style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.8)' }}>
                  <span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl'>🌍</span>
                  <span className='text-center break-words'>GALERIE COMMUNAUTAIRE</span>
                </h1>
                <p className='text-gray-300 text-xs sm:text-sm md:text-base font-mono'>
                  {total > 0 ? `${total} MONSTRES PUBLICS` : 'AUCUN MONSTRE PUBLIC'}
                </p>
              </div>
            </div>
          </div>

          {/* Filtres - Style creature */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-3 sm:border-4 border-slate-700/50 shadow-xl overflow-hidden relative'>
            {/* Grille pixel art en arrière-plan */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />
            <div className='relative z-10'>
              <GalleryFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Grille des monstres - Container avec bordure */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-3 sm:border-4 border-slate-700/50 shadow-xl relative'>
            {/* Grille pixel art en arrière-plan */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />
            {/* Effet de lueur */}
            <div className='absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent' />

            <div className='relative z-10'>
              <GalleryGrid
                monsters={monsters}
                loading={loading}
                error={error}
              />
            </div>
          </div>

          {/* Pagination - Style creature */}
          {!loading && (error === undefined || error === '') && monsters.length > 0 && (
            <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border-3 sm:border-4 border-slate-700/50 shadow-xl relative'>
              {/* Grille pixel art */}
              <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />
              <div className='relative z-10'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasMore={hasMore}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
