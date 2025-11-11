'use client'

import { useState, memo } from 'react'
import type { ShopItemDTO } from '@/application/use-cases/shop'
import { RARITY_LABELS, RARITY_COLORS } from '@/shared/types/shop'
import { PixelBackground } from './pixel-background'
import type { BackgroundType } from '@/shared/types/shop'

/**
 * Props du composant BackgroundCard
 */
export interface BackgroundCardProps {
  item: ShopItemDTO
  userBalance: number
  onPurchase: (itemId: string) => Promise<void>
  disabled?: boolean
}

/**
 * Composant BackgroundCard - Affiche un fond d'écran de la boutique
 *
 * Responsabilités (SRP):
 * - Afficher les détails d'un fond d'écran (nom, prix, rareté)
 * - Afficher le rendu pixel art du fond
 * - Gérer l'interaction d'achat
 * - Indiquer si le fond est achetable
 *
 * Optimisation (Performance):
 * - Mémoïsé avec React.memo et comparateur personnalisé
 * - Re-render uniquement si item.id, userBalance ou disabled changent
 */
export const BackgroundCard = memo(function BackgroundCard ({
  item,
  userBalance,
  onPurchase,
  disabled = false
}: BackgroundCardProps): React.ReactNode {
  const [isPurchasing, setIsPurchasing] = useState(false)

  const canAfford = userBalance >= item.price
  const isDisabled = disabled || !item.isAvailable || isPurchasing

  const handlePurchase = async (): Promise<void> => {
    if (isDisabled || !canAfford) return

    setIsPurchasing(true)
    try {
      await onPurchase(item.id)
    } finally {
      setIsPurchasing(false)
    }
  }

  const rarityColor = RARITY_COLORS[item.rarity]
  const rarityLabel = RARITY_LABELS[item.rarity]

  // Vérifier que l'item a un backgroundType
  if (item.backgroundType == null) {
    console.error('BackgroundCard: item.backgroundType is null or undefined', item)
    return null
  }

  return (
    <div
      className='group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 active:scale-100'
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        border: `4px solid ${rarityColor}40`,
        boxShadow: `0 0 20px ${rarityColor}30`
      }}
    >
      {/* Effet de brillance sur hover */}
      <div
        className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${rarityColor}10 50%, transparent 100%)`
        }}
      />

      {/* Badge de rareté */}
      <div
        className='absolute top-3 right-3 z-10 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-sm'
        style={{
          backgroundColor: `${rarityColor}90`,
          color: '#FFFFFF',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          border: `2px solid ${rarityColor}`,
          fontFamily: 'monospace',
          imageRendering: 'pixelated'
        }}
      >
        {rarityLabel}
      </div>

      {/* Aperçu du fond pixel art */}
      <div
        className='relative overflow-hidden'
        style={{
          height: '280px',
          background: `radial-gradient(circle, ${rarityColor}10 0%, transparent 70%)`
        }}
      >
        <PixelBackground
          backgroundType={item.backgroundType}
          className='w-full h-full'
        />
      </div>

      {/* Informations du fond */}
      <div className='relative p-5 space-y-3'>
        {/* Nom du fond */}
        <h3
          className='text-xl font-black text-white text-center'
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontFamily: 'monospace'
          }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p className='text-sm text-gray-400 text-center line-clamp-2 min-h-[2.5rem]'>
          {item.description}
        </p>

        {/* Prix */}
        <div className='flex items-center justify-center gap-2 py-2'>
          <div
            className='text-2xl font-black'
            style={{
              color: canAfford ? '#F59E0B' : '#EF4444',
              textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              fontFamily: 'monospace'
            }}
          >
            {item.price}
          </div>
          <div className='text-lg text-yellow-500 font-bold'>TC</div>
        </div>

        {/* Bouton d'achat */}
        <button
          onClick={() => { void handlePurchase() }}
          disabled={isDisabled || !canAfford}
          className='w-full py-3 px-4 rounded-xl font-black uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            backgroundColor: canAfford && !isDisabled ? rarityColor : '#374151',
            color: '#FFFFFF',
            textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            fontFamily: 'monospace',
            imageRendering: 'pixelated',
            border: `3px solid ${canAfford && !isDisabled ? rarityColor : '#4B5563'}`,
            boxShadow: canAfford && !isDisabled
              ? `0 0 15px ${rarityColor}50`
              : 'none',
            transform: 'translateZ(0)'
          }}
        >
          {isPurchasing
            ? (
              <span className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ACHAT...
              </span>
              )
            : !item.isAvailable
                ? (
                    'INDISPONIBLE'
                  )
                : !canAfford
                    ? (
                        'FONDS INSUFFISANTS'
                      )
                    : (
                        '🛒 ACHETER'
                      )}
        </button>

        {/* Message si pas assez de fonds */}
        {!canAfford && item.isAvailable && (
          <div className='text-xs text-red-400 text-center font-bold'>
            Il vous manque {item.price - userBalance} TC
          </div>
        )}
      </div>

      {/* Pixels décoratifs dans les coins */}
      <div
        className='absolute top-1 left-1 w-2 h-2 rounded-sm'
        style={{ backgroundColor: rarityColor, imageRendering: 'pixelated' }}
      />
      <div
        className='absolute top-1 right-1 w-2 h-2 rounded-sm'
        style={{ backgroundColor: rarityColor, imageRendering: 'pixelated' }}
      />
      <div
        className='absolute bottom-1 left-1 w-2 h-2 rounded-sm'
        style={{ backgroundColor: rarityColor, imageRendering: 'pixelated' }}
      />
      <div
        className='absolute bottom-1 right-1 w-2 h-2 rounded-sm'
        style={{ backgroundColor: rarityColor, imageRendering: 'pixelated' }}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparateur personnalisé
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.userBalance === nextProps.userBalance &&
    prevProps.disabled === nextProps.disabled
  )
})

export default BackgroundCard
