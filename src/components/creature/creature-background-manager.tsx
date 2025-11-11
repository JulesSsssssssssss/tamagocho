'use client'

import { useState, useEffect, useCallback } from 'react'
import { PixelBackground } from '@/components/shop'
import type { BackgroundType } from '@/shared/types/shop'

/**
 * Interface pour un fond d'écran de l'inventaire
 */
interface BackgroundInventoryItem {
  id: string
  itemId: string
  monsterId: string
  ownerId: string
  name: string
  description: string
  category: 'background'
  backgroundType: BackgroundType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEquipped: boolean
  purchasedAt: string
}

/**
 * Props du composant CreatureBackgroundManager
 */
interface CreatureBackgroundManagerProps {
  /** ID de la créature */
  creatureId: string
  /** Callback appelé quand un fond est équipé/déséquipé */
  onBackgroundChange?: () => void
}

/**
 * Composant pour gérer les fonds d'écran d'une créature
 *
 * Responsabilités (SRP) :
 * - Afficher les fonds disponibles dans l'inventaire
 * - Permettre d'équiper/déséquiper un fond
 * - Feedback visuel des actions
 *
 * Features :
 * - Grille de fonds d'écran
 * - Clic pour équiper/déséquiper
 * - Badge "Équipé" sur le fond actif
 * - Preview du fond
 *
 * @param {CreatureBackgroundManagerProps} props - Props du composant
 * @returns {React.ReactNode} Interface de gestion de fonds
 */
export function CreatureBackgroundManager ({
  creatureId,
  onBackgroundChange
}: CreatureBackgroundManagerProps): React.ReactNode {
  const [backgrounds, setBackgrounds] = useState<BackgroundInventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Charger les fonds d'écran de la créature
  const fetchBackgrounds = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🎨 Chargement des fonds pour creature:', creatureId)
      const response = await fetch(`/api/inventory/${creatureId}`)
      const data = await response.json()

      console.log('📦 Réponse inventaire:', data)

      if (data.success) {
        // Filtrer uniquement les backgrounds
        const bgItems = data.data.filter((item: any) => item.category === 'background')
        console.log('🖼️ Fonds trouvés:', bgItems)
        setBackgrounds(bgItems)
      } else {
        setError(data.error ?? 'Erreur lors du chargement des fonds')
      }
    } catch (err) {
      setError('Impossible de charger les fonds d\'écran')
      console.error('Erreur chargement backgrounds:', err)
    } finally {
      setIsLoading(false)
    }
  }, [creatureId])

  // Charger les fonds au montage
  useEffect(() => {
    void fetchBackgrounds()
  }, [fetchBackgrounds])

  // Équiper ou déséquiper un fond
  const handleToggleEquip = async (background: BackgroundInventoryItem): Promise<void> => {
    try {
      setActionLoading(background.id)

      const endpoint = background.isEquipped
        ? '/api/inventory/remove-background'
        : '/api/inventory/equip-background'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monsterId: creatureId,
          inventoryItemId: background.id
        })
      })

      const data = await response.json()

      if (data.success) {
        // Recharger les fonds
        await fetchBackgrounds()
        // Notifier le parent
        onBackgroundChange?.()
      } else {
        setError(data.error ?? 'Erreur lors de l\'action')
      }
    } catch (err) {
      setError('Impossible d\'effectuer l\'action')
      console.error('Erreur toggle fond d\'écran:', err)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-blue-500/50 shadow-xl'>
        <div className='flex items-center justify-center gap-3 text-blue-300'>
          <div className='w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin' />
          <span className='font-bold' style={{ fontFamily: 'monospace' }}>
            Chargement des fonds...
          </span>
        </div>
      </div>
    )
  }

  if (error != null) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-red-500/50 shadow-xl'>
        <p className='text-red-400 text-center font-bold' style={{ fontFamily: 'monospace' }}>
          ❌ {error}
        </p>
      </div>
    )
  }

  if (backgrounds.length === 0) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 shadow-xl'>
        <div className='text-center space-y-2'>
          <p className='text-2xl'>🖼️</p>
          <p className='text-slate-400 font-bold' style={{ fontFamily: 'monospace' }}>
            Aucun fond d'écran disponible
          </p>
          <p className='text-slate-500 text-sm' style={{ fontFamily: 'monospace' }}>
            Achetez des fonds dans la boutique !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-blue-500/50 shadow-xl space-y-6'>
      {/* Titre */}
      <div className='flex items-center justify-between'>
        <h3
          className='text-2xl font-black text-blue-300 flex items-center gap-2'
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            fontFamily: 'monospace'
          }}
        >
          🖼️ FONDS D'ÉCRAN
        </h3>
        <span
          className='text-sm text-blue-400/70 font-bold'
          style={{ fontFamily: 'monospace' }}
        >
          {backgrounds.length} disponible{backgrounds.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Grille de fonds */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {backgrounds.length === 0 && (
          <div className='col-span-full text-center text-blue-400 py-4' style={{ fontFamily: 'monospace' }}>
            🔍 Aucun fond chargé (vérifiez la console)
          </div>
        )}
        {backgrounds.map((bg) => {
          console.log('🔍 Fond trouvé:', bg)
          console.log('🎨 backgroundType:', bg.backgroundType)

          // Sécurité : ne pas afficher si backgroundType est invalide
          if (!bg.backgroundType) {
            console.warn('⚠️ Background item without backgroundType:', bg)
            // Afficher quand même avec un message d'erreur
            return (
              <div key={bg.id} className='p-4 bg-red-900/30 rounded-lg border-2 border-red-500 text-red-300' style={{ fontFamily: 'monospace' }}>
                <p className='font-bold'>❌ Erreur: backgroundType manquant</p>
                <p className='text-xs'>{bg.name}</p>
                <pre className='text-xs mt-2 overflow-auto'>{JSON.stringify(bg, null, 2)}</pre>
              </div>
            )
          }

          return (
            <button
              key={bg.id}
              onClick={() => { void handleToggleEquip(bg) }}
              disabled={actionLoading === bg.id}
              className='group relative bg-slate-800/50 rounded-xl p-3 border-4 border-slate-700/50 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {/* Badge "Équipé" */}
              {bg.isEquipped && (
                <div
                  className='absolute -top-2 -right-2 z-10 px-3 py-1 bg-green-500 text-white text-xs font-black rounded-lg border-2 border-white shadow-lg'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '1px 1px 0px rgba(0,0,0,0.5)'
                  }}
                >
                  ✓ ÉQUIPÉ
                </div>
              )}

              {/* Aperçu du fond */}
              <div className='aspect-[2/3] overflow-hidden rounded-lg mb-3 border-2 border-slate-600 group-hover:border-blue-400 transition-all'>
                <PixelBackground
                  backgroundType={bg.backgroundType}
                  className='w-full h-full'
                />
              </div>

              {/* Infos */}
              <div className='space-y-1'>
                <p
                  className='text-white font-bold text-sm truncate'
                  style={{ fontFamily: 'monospace' }}
                >
                  {bg.name}
                </p>
                <p
                  className='text-slate-400 text-xs line-clamp-2'
                  style={{ fontFamily: 'monospace' }}
                >
                  {bg.description}
                </p>
              </div>

              {/* Bouton d'action */}
              <div className='mt-3 pt-3 border-t-2 border-slate-700/50'>
                {actionLoading === bg.id
                  ? (
                    <div className='flex items-center justify-center gap-2 text-blue-400'>
                      <div className='w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin' />
                      <span className='text-xs font-bold' style={{ fontFamily: 'monospace' }}>
                        Chargement...
                      </span>
                    </div>
                    )
                  : (
                    <span
                      className={`text-xs font-bold ${
                      bg.isEquipped ? 'text-red-400' : 'text-blue-400'
                    }`}
                      style={{ fontFamily: 'monospace' }}
                    >
                      {bg.isEquipped ? '❌ RETIRER' : '✅ ÉQUIPER'}
                    </span>
                    )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CreatureBackgroundManager
