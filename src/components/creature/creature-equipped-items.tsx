'use client'

import { memo } from 'react'
import { PixelItem } from '@/components/shop'
import type { ItemCategory } from '@/shared/types/shop'

/**
 * Props du composant CreatureEquippedItems
 */
interface CreatureEquippedItemsProps {
  /** Items équipés sur le monstre */
  equippedItems?: {
    hat?: string | null
    glasses?: string | null
    shoes?: string | null
  }
}

/**
 * Composant pour afficher les items équipés d'un monstre
 *
 * Responsabilités (SRP) :
 * - Affichage des items équipés (chapeau, lunettes, chaussures)
 * - Gestion des slots vides
 *
 * Design :
 * - Style pixel art cohérent avec le reste de l'application
 * - 3 slots avec icônes pour chaque type d'item
 * - Bordure jaune gaming pour correspondre au design général
 *
 * @param {CreatureEquippedItemsProps} props - Props du composant
 * @returns {React.ReactNode} Section des items équipés
 */
const CreatureEquippedItems = memo(function CreatureEquippedItems ({
  equippedItems
}: CreatureEquippedItemsProps): React.ReactNode {
  // Helper pour obtenir l'icône du slot vide
  const getEmptySlotIcon = (category: ItemCategory): string => {
    switch (category) {
      case 'hat':
        return '🎩'
      case 'glasses':
        return '👓'
      case 'shoes':
        return '👟'
      default:
        return '❓'
    }
  }

  // Helper pour obtenir le label du slot
  const getSlotLabel = (category: ItemCategory): string => {
    switch (category) {
      case 'hat':
        return 'CHAPEAU'
      case 'glasses':
        return 'LUNETTES'
      case 'shoes':
        return 'CHAUSSURES'
      default:
        return 'ITEM'
    }
  }

  // Extraire les IDs des items ou déterminer la catégorie depuis l'ID de test
  const hatId = equippedItems?.hat
  const glassesId = equippedItems?.glasses
  const shoesId = equippedItems?.shoes

  // Helper pour extraire la rareté depuis l'ID de test
  const getRarityFromTestId = (itemId: string): 'common' | 'rare' | 'epic' | 'legendary' => {
    if (itemId.includes('_legendary_')) return 'legendary'
    if (itemId.includes('_epic_')) return 'epic'
    if (itemId.includes('_rare_')) return 'rare'
    return 'common'
  }

  return (
    <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
      {/* Coins pixel jaunes */}
      <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

      <h3 className='text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono tracking-wider'>
        <span className='text-xl md:text-2xl'>👕</span>
        ÉQUIPEMENT
      </h3>

      <div className='grid grid-cols-3 gap-3'>
        {/* Slot Chapeau */}
        <div className='flex flex-col items-center gap-2'>
          <div className='w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-slate-700 flex items-center justify-center p-2 relative overflow-hidden'>
            {hatId !== null && hatId !== undefined
              ? (
                <PixelItem
                  category='hat'
                  rarity={getRarityFromTestId(hatId)}
                />
                )
              : (
                <span className='text-3xl opacity-30'>{getEmptySlotIcon('hat')}</span>
                )}
          </div>
          <span className='text-xs font-mono text-slate-400 tracking-wider'>
            {getSlotLabel('hat')}
          </span>
        </div>

        {/* Slot Lunettes */}
        <div className='flex flex-col items-center gap-2'>
          <div className='w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-slate-700 flex items-center justify-center p-2 relative overflow-hidden'>
            {glassesId !== null && glassesId !== undefined
              ? (
                <PixelItem
                  category='glasses'
                  rarity={getRarityFromTestId(glassesId)}
                />
                )
              : (
                <span className='text-3xl opacity-30'>{getEmptySlotIcon('glasses')}</span>
                )}
          </div>
          <span className='text-xs font-mono text-slate-400 tracking-wider'>
            {getSlotLabel('glasses')}
          </span>
        </div>

        {/* Slot Chaussures */}
        <div className='flex flex-col items-center gap-2'>
          <div className='w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-slate-700 flex items-center justify-center p-2 relative overflow-hidden'>
            {shoesId !== null && shoesId !== undefined
              ? (
                <PixelItem
                  category='shoes'
                  rarity={getRarityFromTestId(shoesId)}
                />
                )
              : (
                <span className='text-3xl opacity-30'>{getEmptySlotIcon('shoes')}</span>
                )}
          </div>
          <span className='text-xs font-mono text-slate-400 tracking-wider'>
            {getSlotLabel('shoes')}
          </span>
        </div>
      </div>

      {/* Message si aucun item équipé */}
      {hatId === null && glassesId === null && shoesId === null && (
        <p className='text-center text-sm text-slate-500 mt-4 font-mono'>
          Aucun item équipé. Visite la boutique ! 🛍️
        </p>
      )}
    </div>
  )
})

export default CreatureEquippedItems
