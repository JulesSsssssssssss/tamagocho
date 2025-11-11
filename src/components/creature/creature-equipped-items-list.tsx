'use client'

import { memo, useState, useEffect } from 'react'
import type { ItemCategory } from '@/shared/types/shop'
import type { DBMonster } from '@/shared/types/monster'
import { BackgroundSelectionModal } from './background-selection-modal'

interface EquippedItems {
  hat?: string | null
  glasses?: string | null
  shoes?: string | null
}

interface CreatureEquippedItemsListProps {
  equippedItems?: EquippedItems
  creatureId: string
  onItemChange?: () => void
}

interface InventoryItemWithDetails {
  id: string
  itemId: string
  category: string
  isEquipped: boolean
  name: string
  description: string
  rarity: string
  price: number
}

/**
 * Formate le nom d'un item à partir de son ID
 * Exemple: "test_hat_epic_1" → "Chapeau Épique"
 */
function formatItemName (itemId: string): string {
  const parts = itemId.split('_')
  if (parts.length < 3) return itemId

  const category = parts[1] // hat, glasses, shoes
  const rarity = parts[2] // common, rare, epic, legendary

  const categoryNames: Record<string, string> = {
    hat: 'Chapeau',
    glasses: 'Lunettes',
    shoes: 'Chaussures'
  }

  const rarityNames: Record<string, string> = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  }

  const categoryName = categoryNames[category] ?? category
  const rarityName = rarityNames[rarity] ?? rarity

  return `${categoryName} ${rarityName}`
}

/**
 * Retourne la couleur associée à la rareté
 */
function getRarityColor (itemId: string): string {
  if (itemId.includes('_legendary_')) return 'text-yellow-400'
  if (itemId.includes('_epic_')) return 'text-purple-400'
  if (itemId.includes('_rare_')) return 'text-blue-400'
  return 'text-gray-300'
}

const CreatureEquippedItemsList = memo(({ equippedItems, creatureId, onItemChange }: CreatureEquippedItemsListProps) => {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showItemSelector, setShowItemSelector] = useState<ItemCategory | null>(null)
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  const [loadingBackground, setLoadingBackground] = useState(false)
  const [inventory, setInventory] = useState<InventoryItemWithDetails[]>([])
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [monsterData, setMonsterData] = useState<DBMonster | null>(null)

  // Charger les données du monstre au montage
  useEffect(() => {
    void loadMonsterData()
  }, [creatureId])

  // Fonction pour charger les données du monstre
  const loadMonsterData = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${creatureId}`)

      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status)
        return
      }

      const monster = await response.json()

      // La route /api/monster retourne directement le monstre
      if (monster && monster._id) {
        setMonsterData(monster)
      } else {
        console.error('❌ Données monstre invalides:', monster)
      }
    } catch (err) {
      console.error('❌ Erreur chargement monstre:', err)
    }
  }

  // Charger l'inventaire du monstre au montage et quand le modal s'ouvre
  useEffect(() => {
    if (showItemSelector !== null) {
      // Toujours recharger quand on ouvre le modal
      void loadInventory()
    }
  }, [showItemSelector])

  // Fonction pour charger l'inventaire
  const loadInventory = async (): Promise<void> => {
    try {
      setLoadingInventory(true)
      console.log('🔍 Chargement inventaire pour:', creatureId)

      const response = await fetch(`/api/inventory/${creatureId}`)
      const data = await response.json()

      console.log('📦 Réponse API inventaire:', data)

      if (data.success) {
        console.log('✅ Inventaire chargé:', data.data.length, 'items')
        console.log('Items détails:', data.data)
        setInventory(data.data)
      } else {
        console.error('❌ Erreur API:', data.error)
      }
    } catch (err) {
      console.error('❌ Erreur chargement inventaire:', err)
    } finally {
      setLoadingInventory(false)
    }
  }

  // Fonction pour équiper ou déséquiper un item
  const handleToggleItem = async (category: ItemCategory, itemId: string | null): Promise<void> => {
    try {
      setLoadingCategory(category)
      setError(null)
      setShowItemSelector(null) // Fermer le sélecteur

      const action = itemId === null ? 'Déséquipement' : 'Équipement'
      console.log(`🔄 ${action}:`, { category, itemId, creatureId })

      // Appel à l'API toggle
      const response = await fetch('/api/monster/toggle-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monsterId: creatureId,
          category,
          itemId
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error ?? `Erreur lors du ${action.toLowerCase()}`)
      }

      console.log(`✅ ${action} réussi`)

      // Recharger l'inventaire pour mettre à jour les items disponibles
      await loadInventory()

      // Notifier le parent pour rafraîchir le monstre
      onItemChange?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error('Erreur toggle:', err)
    } finally {
      setLoadingCategory(null)
    }
  }

  const items = [
    { category: 'hat', label: 'Chapeau', icon: '🎩', itemId: equippedItems?.hat },
    { category: 'glasses', label: 'Lunettes', icon: '👓', itemId: equippedItems?.glasses },
    { category: 'shoes', label: 'Chaussures', icon: '👟', itemId: equippedItems?.shoes }
  ]

  const equippedCount = items.filter(item => item.itemId).length
  const hasBackground = monsterData?.equippedBackground != null && monsterData.equippedBackground !== ''

  return (
    <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative overflow-hidden'>
      {/* Coins pixel jaunes */}
      <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

      <div className='p-4 md:p-6'>
        <h3 className='text-base md:text-lg font-bold text-white mb-4 flex items-center justify-between font-mono tracking-wider'>
          <span className='flex items-center gap-2'>
            <span className='text-xl md:text-2xl'>👔</span>
            ACCESSOIRES
          </span>
          <span className='text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-lg border border-yellow-500/30'>
            {equippedCount}/3 items
          </span>
        </h3>

        <div className='space-y-3'>
          {items.map((item) => {
            const isLoading = loadingCategory === item.category
            const isEquipped = item.itemId != null && item.itemId !== ''

            return (
              <button
                key={item.category}
                onClick={() => {
                  if (!isLoading) {
                    if (isEquipped) {
                      // Déséquiper
                      void handleToggleItem(item.category as ItemCategory, null)
                    } else {
                      // Ouvrir le sélecteur d'items
                      setShowItemSelector(item.category as ItemCategory)
                    }
                  }
                }}
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-between p-3 
                  bg-slate-800/50 rounded-xl border-2 
                  transition-all duration-300 relative group
                  ${isEquipped
                    ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                    : 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                  }
                  ${isLoading ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                <div className='flex items-center gap-3'>
                  <span className='text-2xl' style={{ imageRendering: 'pixelated' }}>
                    {item.icon}
                  </span>
                  <div className='flex flex-col items-start'>
                    <span className='text-xs text-gray-400 font-mono uppercase'>
                      {item.label}
                    </span>
                    {isEquipped
                      ? <span className={`text-sm font-bold ${getRarityColor(item.itemId!)}`}>
                        {formatItemName(item.itemId!)}
                      </span>
                      : <span className='text-sm text-blue-400 italic'>
                        Cliquer pour équiper
                      </span>}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {isLoading && (
                    <div className='w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin' />
                  )}
                  {isEquipped
                    ? <span className='text-green-400 text-lg'>✓</span>
                    : <span className='text-blue-400 text-lg'>+</span>}
                </div>

                {/* Tooltip au survol */}
                {!isLoading && (
                  <div className='absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 border-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border-blue-500'>
                    <p className='text-xs font-mono text-white font-bold'>
                      {isEquipped ? '🗑️ Cliquer pour déséquiper' : '➕ Cliquer pour choisir un item'}
                    </p>
                  </div>
                )}
              </button>
            )
          })}

          {/* Fond d'écran */}
          <button
            onClick={() => {
              if (!loadingBackground) {
                setShowBackgroundSelector(true)
              }
            }}
            disabled={loadingBackground}
            className={`
              w-full flex items-center justify-between p-3 
              bg-slate-800/50 rounded-xl border-2 
              transition-all duration-300 relative group
              ${hasBackground
                ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                : 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
              }
              ${loadingBackground ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            <div className='flex items-center gap-3'>
              <span className='text-2xl' style={{ imageRendering: 'pixelated' }}>
                🖼️
              </span>
              <div className='flex flex-col items-start'>
                <span className='text-xs text-gray-400 font-mono uppercase'>
                  Fond d&apos;écran
                </span>
                {hasBackground
                  ? <span className='text-sm font-bold text-purple-400'>
                    {monsterData?.equippedBackground}
                  </span>
                  : <span className='text-sm text-blue-400 italic'>
                    Cliquer pour équiper
                  </span>}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {loadingBackground && (
                <div className='w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin' />
              )}
              {hasBackground
                ? <span className='text-purple-400 text-lg'>✓</span>
                : <span className='text-blue-400 text-lg'>+</span>}
            </div>

            {/* Tooltip au survol */}
            {!loadingBackground && (
              <div className='absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900 border-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border-purple-500'>
                <p className='text-xs font-mono text-white font-bold'>
                  {hasBackground ? '🖼️ Gérer les fonds d\'écran' : '➕ Ajouter un fond d\'écran'}
                </p>
              </div>
            )}
          </button>
        </div>

        {error !== null && (
          <div className='mt-4 p-3 bg-red-900/30 rounded-lg border border-red-500/30 text-center'>
            <p className='text-xs text-red-400 font-mono'>{error}</p>
          </div>
        )}

        {equippedCount === 0 && (
          <div className='mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 text-center'>
            <p className='text-xs text-gray-400 font-mono'>
              🛍️ Visite la boutique pour équiper ton monstre !
            </p>
          </div>
        )}
      </div>

      {/* Modal de sélection de fond d'écran */}
      {showBackgroundSelector && (
        <BackgroundSelectionModal
          creatureId={creatureId}
          isOpen={showBackgroundSelector}
          onClose={() => { setShowBackgroundSelector(false) }}
          onBackgroundChange={() => {
            void loadMonsterData()
          }}
        />
      )}

      {/* Modal de sélection d'item */}
      {showItemSelector !== null && (
        <div
          className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setShowItemSelector(null)}
        >
          <div
            className='bg-slate-900 rounded-2xl border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.5)] max-w-lg w-full max-h-[80vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-bold text-white font-mono tracking-wider'>
                    CHOISIR UN ITEM
                  </h3>
                  <p className='text-xs text-gray-400 mt-1'>
                    {inventory.filter(item => item.category === showItemSelector && !item.isEquipped).length} item(s) disponible(s)
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => void loadInventory()}
                    disabled={loadingInventory}
                    className='text-gray-400 hover:text-white transition-colors text-xl disabled:opacity-50'
                    title='Rafraîchir'
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => setShowItemSelector(null)}
                    className='text-gray-400 hover:text-white transition-colors text-xl'
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className='space-y-2'>
                {loadingInventory
                  ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin' />
                    </div>
                    )
                  : inventory
                    .filter(item => item.category === showItemSelector && !item.isEquipped)
                    .length === 0
                    ? (
                      <div className='text-center py-8'>
                        <p className='text-gray-400 text-sm font-mono'>
                          🛍️ Aucun item disponible
                        </p>
                        <p className='text-gray-500 text-xs mt-2'>
                          Achète des items dans la boutique !
                        </p>
                      </div>
                      )
                    : inventory
                      .filter(item => item.category === showItemSelector && !item.isEquipped)
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => void handleToggleItem(showItemSelector, item.itemId)}
                          disabled={loadingCategory !== null}
                          className={`
                              w-full flex items-center justify-between p-3 
                              bg-slate-800/50 rounded-xl border-2 border-slate-700
                              hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]
                              transition-all duration-300 cursor-pointer
                              hover:scale-[1.02] active:scale-[0.98]
                              ${loadingCategory !== null ? 'opacity-50 cursor-wait' : ''}
                            `}
                        >
                          <div className='flex flex-col items-start flex-1'>
                            <span className={`text-sm font-bold ${getRarityColor(item.itemId)}`}>
                              {item.name}
                            </span>
                            <span className='text-xs text-gray-400'>
                              {item.description}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='text-blue-400 text-lg'>→</span>
                          </div>
                        </button>
                      ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

CreatureEquippedItemsList.displayName = 'CreatureEquippedItemsList'

export default CreatureEquippedItemsList
