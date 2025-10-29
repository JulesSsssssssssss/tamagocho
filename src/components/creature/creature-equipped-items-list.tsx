'use client'

import { memo } from 'react'

interface EquippedItems {
  hat?: string | null
  glasses?: string | null
  shoes?: string | null
}

interface CreatureEquippedItemsListProps {
  equippedItems?: EquippedItems
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

const CreatureEquippedItemsList = memo(({ equippedItems }: CreatureEquippedItemsListProps) => {
  const items = [
    { category: 'hat', label: 'Chapeau', icon: '🎩', itemId: equippedItems?.hat },
    { category: 'glasses', label: 'Lunettes', icon: '👓', itemId: equippedItems?.glasses },
    { category: 'shoes', label: 'Chaussures', icon: '👟', itemId: equippedItems?.shoes }
  ]

  const equippedCount = items.filter(item => item.itemId).length

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
            {equippedCount}/3
          </span>
        </h3>

        <div className='space-y-3'>
          {items.map((item) => (
            <div
              key={item.category}
              className='flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border-2 border-slate-700/50 transition-all duration-300 hover:border-yellow-500/50'
            >
              <div className='flex items-center gap-3'>
                <span className='text-2xl' style={{ imageRendering: 'pixelated' }}>
                  {item.icon}
                </span>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-400 font-mono uppercase'>
                    {item.label}
                  </span>
                  {(item.itemId != null && item.itemId !== '')
                    ? <span className={`text-sm font-bold ${getRarityColor(item.itemId)}`}>
                      {formatItemName(item.itemId)}
                    </span>
                    : <span className='text-sm text-gray-500 italic'>
                      Aucun
                    </span>}
                </div>
              </div>
              {(item.itemId != null && item.itemId !== '')
                ? <span className='text-green-400 text-lg'>✓</span>
                : <span className='text-gray-600 text-lg'>○</span>}
            </div>
          ))}
        </div>

        {equippedCount === 0 && (
          <div className='mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 text-center'>
            <p className='text-xs text-gray-400 font-mono'>
              🛍️ Visite la boutique pour équiper ton monstre !
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

CreatureEquippedItemsList.displayName = 'CreatureEquippedItemsList'

export default CreatureEquippedItemsList
