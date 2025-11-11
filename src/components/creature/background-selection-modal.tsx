'use client'

import { useState, useEffect } from 'react'
import { PixelBackground } from '@/components/shop'
import type { BackgroundType } from '@/shared/types/shop'

/**
 * Interface pour un fond d'écran de l'inventaire
 */
interface BackgroundInventoryItem {
  id: string
  itemId: string
  name: string
  description: string
  category: 'background'
  backgroundType: BackgroundType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isEquipped: boolean
}

/**
 * Props du composant BackgroundSelectionModal
 */
interface BackgroundSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  creatureId: string
  onBackgroundChange: () => void
}

/**
 * Composant Modal pour sélectionner un fond d'écran
 *
 * Responsabilités (SRP):
 * - Afficher tous les fonds disponibles dans l'inventaire
 * - Permettre de sélectionner/déséquiper un fond
 * - Feedback visuel et états de chargement
 */
export function BackgroundSelectionModal ({
  isOpen,
  onClose,
  creatureId,
  onBackgroundChange
}: BackgroundSelectionModalProps): React.ReactNode {
  const [backgrounds, setBackgrounds] = useState<BackgroundInventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Charger les fonds disponibles
  useEffect(() => {
    if (!isOpen) return

    const fetchBackgrounds = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/inventory/${creatureId}`)
        const data = await response.json()

        if (data.success) {
          const bgItems = data.data.filter((item: any) => item.category === 'background')
          setBackgrounds(bgItems)
        }
      } catch (error) {
        console.error('Error loading backgrounds:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBackgrounds()
  }, [isOpen, creatureId])

  // Équiper ou déséquiper un fond
  const handleSelectBackground = async (background: BackgroundInventoryItem | null): Promise<void> => {
    try {
      setActionLoading(background?.id ?? 'remove')

      if (background === null) {
        // Déséquiper le fond actuel
        const equippedBg = backgrounds.find(bg => bg.isEquipped)
        if (equippedBg != null) {
          const response = await fetch('/api/inventory/remove-background', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              monsterId: creatureId,
              inventoryItemId: equippedBg.id
            })
          })

          const data = await response.json()
          if (data.success) {
            onBackgroundChange()
            onClose()
          }
        }
      } else {
        // Équiper le fond sélectionné
        const response = await fetch('/api/inventory/equip-background', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monsterId: creatureId,
            inventoryItemId: background.id
          })
        })

        const data = await response.json()
        if (data.success) {
          onBackgroundChange()
          onClose()
        }
      }
    } catch (error) {
      console.error('Error toggling background:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <div
        className='bg-slate-900 rounded-2xl border-4 border-blue-500 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden'
        onClick={(e) => { e.stopPropagation() }}
      >
        {/* Header */}
        <div className='bg-slate-950/90 p-4 border-b-4 border-blue-500/50 flex items-center justify-between'>
          <h2
            className='text-2xl font-black text-blue-300 flex items-center gap-2'
            style={{
              textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              fontFamily: 'monospace'
            }}
          >
            🖼️ CHOISIR UN FOND D'ÉCRAN
          </h2>
          <button
            onClick={onClose}
            className='w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500 text-red-400 font-bold transition-all'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(80vh-80px)]'>
          {isLoading
            ? (
              <div className='flex items-center justify-center py-12'>
                <div className='w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin' />
              </div>
              )
            : backgrounds.length === 0
              ? (
                <div className='text-center py-12'>
                  <p className='text-2xl mb-2'>🖼️</p>
                  <p className='text-slate-400 font-bold' style={{ fontFamily: 'monospace' }}>
                    Aucun fond d'écran disponible
                  </p>
                  <p className='text-slate-500 text-sm mt-2' style={{ fontFamily: 'monospace' }}>
                    Achetez des fonds dans la boutique !
                  </p>
                </div>
                )
              : (
                <div className='space-y-4'>
                  {/* Option pour retirer le fond */}
                  <button
                    onClick={() => { void handleSelectBackground(null) }}
                    disabled={actionLoading === 'remove' || !backgrounds.some(bg => bg.isEquipped)}
                    className='w-full p-4 rounded-xl border-4 border-slate-700 bg-slate-800/50 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='w-24 h-36 bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-slate-600'>
                        <span className='text-4xl'>🚫</span>
                      </div>
                      <div className='flex-1 text-left'>
                        <p
                          className='text-white font-bold text-lg'
                          style={{ fontFamily: 'monospace' }}
                        >
                          Aucun fond
                        </p>
                        <p
                          className='text-slate-400 text-sm'
                          style={{ fontFamily: 'monospace' }}
                        >
                          Retirer le fond d'écran actuel
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Liste des fonds */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {backgrounds.map((bg) => {
                      if (!bg.backgroundType) return null

                      const isEquipped = bg.isEquipped
                      const isProcessing = actionLoading === bg.id

                      return (
                        <button
                          key={bg.id}
                          onClick={() => { void handleSelectBackground(bg) }}
                          disabled={isProcessing}
                          className={`relative p-3 rounded-xl border-4 transition-all ${
                            isEquipped
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-slate-700 bg-slate-800/50 hover:border-blue-400'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {/* Badge équipé */}
                          {isEquipped && (
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

                          {/* Preview */}
                          <div className='aspect-[2/3] overflow-hidden rounded-lg mb-3 border-2 border-slate-600'>
                            <PixelBackground
                              backgroundType={bg.backgroundType}
                              className='w-full h-full'
                            />
                          </div>

                          {/* Info */}
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

                          {/* Loading */}
                          {isProcessing && (
                            <div className='absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center'>
                              <div className='w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin' />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                )}
        </div>
      </div>
    </div>
  )
}

export default BackgroundSelectionModal
