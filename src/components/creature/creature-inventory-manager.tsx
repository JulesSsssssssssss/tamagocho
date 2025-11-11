'use client'

import { useState, useEffect, useCallback } from 'react'
import { PixelItem } from '@/components/shop'
import type { ItemCategory } from '@/shared/types/shop'

/**
 * Interface pour un item de l'inventaire
 */
interface InventoryItemDTO {
  id: string
  itemId: string
  monsterId: string
  ownerId: string
  name: string
  description: string
  category: ItemCategory
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  imageUrl?: string
  isEquipped: boolean
  purchasedAt: string
}

/**
 * Props du composant CreatureInventoryManager
 */
interface CreatureInventoryManagerProps {
  /** ID de la créature */
  creatureId: string
  /** Callback appelé quand un item est équipé/déséquipé */
  onInventoryChange?: () => void
}

/**
 * Composant pour gérer l'inventaire d'une créature
 *
 * Responsabilités (SRP) :
 * - Afficher l'inventaire complet de la créature
 * - Permettre d'équiper/déséquiper des items
 * - Feedback visuel des actions
 *
 * Features :
 * - Grille d'items par catégorie
 * - Clic sur un item pour équiper/déséquiper
 * - Badge "Équipé" sur les items actifs
 * - Loading states et gestion d'erreurs
 *
 * @param {CreatureInventoryManagerProps} props - Props du composant
 * @returns {React.ReactNode} Interface de gestion d'inventaire
 */
export function CreatureInventoryManager ({
  creatureId,
  onInventoryChange
}: CreatureInventoryManagerProps): React.ReactNode {
  const [items, setItems] = useState<InventoryItemDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Charger l'inventaire de la créature
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/inventory/${creatureId}`)
      const data = await response.json()

      if (data.success) {
        setItems(data.data)
      } else {
        setError(data.error ?? 'Erreur lors du chargement de l\'inventaire')
      }
    } catch (err) {
      setError('Impossible de charger l\'inventaire')
      console.error('Erreur chargement inventaire:', err)
    } finally {
      setIsLoading(false)
    }
  }, [creatureId])

  // Charger l'inventaire au montage
  useEffect(() => {
    void fetchInventory()
  }, [fetchInventory])

  // Équiper ou déséquiper un item
  const handleToggleEquip = async (item: InventoryItemDTO): Promise<void> => {
    try {
      setActionLoading(item.id)

      const endpoint = item.isEquipped ? '/api/inventory/unequip' : '/api/inventory/equip'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monsterId: creatureId,
          inventoryItemId: item.id
        })
      })

      const data = await response.json()

      if (data.success) {
        // Recharger l'inventaire
        await fetchInventory()
        // Notifier le parent
        onInventoryChange?.()
      } else {
        setError(data.error ?? 'Erreur lors de l\'action')
      }
    } catch (err) {
      setError('Impossible d\'effectuer l\'action')
      console.error('Erreur toggle équipement:', err)
    } finally {
      setActionLoading(null)
    }
  }

  // Grouper les items par catégorie
  const itemsByCategory = items.reduce<Record<ItemCategory, InventoryItemDTO[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    { hat: [], glasses: [], shoes: [] }
  )

  // Labels des catégories
  const categoryLabels: Record<ItemCategory, string> = {
    hat: 'CHAPEAUX',
    glasses: 'LUNETTES',
    shoes: 'CHAUSSURES'
  }

  // Icônes des catégories
  const categoryIcons: Record<ItemCategory, string> = {
    hat: '🎩',
    glasses: '👓',
    shoes: '👟'
  }

  if (isLoading) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-purple-500/50 shadow-xl'>
        <div className='flex items-center justify-center gap-3 text-purple-300'>
          <div className='w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin' />
          <span className='font-mono text-sm'>Chargement de l\'inventaire...</span>
        </div>
      </div>
    )
  }

  if (error !== null) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-red-500/50 shadow-xl'>
        <p className='text-red-400 font-mono text-sm text-center'>{error}</p>
        <button
          onClick={() => void fetchInventory()}
          className='mt-4 w-full px-4 py-2 bg-red-500 text-white font-mono rounded-lg hover:bg-red-600 transition-colors'
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 shadow-xl'>
        <div className='text-center text-slate-400 font-mono'>
          <p className='text-4xl mb-4'>📦</p>
          <p className='text-sm'>Aucun accessoire dans l\'inventaire</p>
          <p className='text-xs mt-2 opacity-70'>Achetez des items dans la boutique !</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] relative'>
      {/* Coins pixel violets */}
      <div className='absolute top-0 left-0 w-4 h-4 bg-purple-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-0 right-0 w-4 h-4 bg-purple-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 left-0 w-4 h-4 bg-purple-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 right-0 w-4 h-4 bg-purple-400' style={{ imageRendering: 'pixelated' }} />

      <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono tracking-wider'>
        <span className='text-2xl'>🎒</span>
        INVENTAIRE ({items.length})
      </h3>

      <div className='space-y-6'>
        {(['hat', 'glasses', 'shoes'] as ItemCategory[]).map((category) => {
          const categoryItems = itemsByCategory[category]

          if (categoryItems.length === 0) return null

          return (
            <div key={category}>
              <h4 className='text-sm font-mono text-purple-300 mb-3 flex items-center gap-2 tracking-wider'>
                <span>{categoryIcons[category]}</span>
                {categoryLabels[category]} ({categoryItems.length})
              </h4>

              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                {categoryItems.map((item) => {
                  const isProcessing = actionLoading === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => void handleToggleEquip(item)}
                      disabled={isProcessing}
                      className={`
                        relative group
                        bg-slate-800/50 rounded-xl border-2 
                        p-3 aspect-square
                        transition-all duration-300
                        ${item.isEquipped
                          ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                          : 'border-slate-700 hover:border-purple-500'
                        }
                        ${isProcessing ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-105'}
                      `}
                    >
                      {/* Badge "Équipé" */}
                      {item.isEquipped && (
                        <div className='absolute -top-2 -right-2 bg-green-500 text-white text-xs font-mono px-2 py-1 rounded-full shadow-lg z-10'>
                          ✓ ÉQUIPÉ
                        </div>
                      )}

                      {/* Indicateur de chargement */}
                      {isProcessing && (
                        <div className='absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-xl z-10'>
                          <div className='w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin' />
                        </div>
                      )}

                      {/* Item visuel */}
                      <div className='w-full h-full flex items-center justify-center'>
                        <PixelItem
                          category={item.category}
                          rarity={item.rarity}
                        />
                      </div>

                      {/* Tooltip au survol */}
                      <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border-2 border-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20'>
                        <p className='text-xs font-mono text-white font-bold'>{item.name}</p>
                        <p className='text-xs font-mono text-purple-300 mt-1'>
                          {item.isEquipped ? 'Cliquez pour déséquiper' : 'Cliquez pour équiper'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Légende en bas */}
      <div className='mt-6 pt-4 border-t-2 border-slate-700/50'>
        <p className='text-xs font-mono text-slate-400 text-center'>
          💡 Cliquez sur un accessoire pour l\'équiper ou le déséquiper
        </p>
      </div>
    </div>
  )
}

export default CreatureInventoryManager
