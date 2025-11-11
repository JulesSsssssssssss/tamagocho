'use client'

import { useState, useMemo, memo } from 'react'
import type { DBMonster, MonsterTraits } from '@/shared/types/monster'
import { PixelMonster } from '@/components/monsters/pixel-monster'

/**
 * Parser les traits depuis JSON string
 * Optimisation : cette fonction est pure et sera utilisée dans useMemo
 */
function parseTraits (traitsString: string): MonsterTraits {
  try {
    return JSON.parse(traitsString) as MonsterTraits
  } catch {
    // Retourner des traits par défaut en cas d'erreur
    return {
      bodyColor: '#FFB5E8',
      accentColor: '#FF9CEE',
      eyeColor: '#2C2C2C',
      antennaColor: '#FFE66D',
      bobbleColor: '#FFE66D',
      cheekColor: '#FFB5D5',
      bodyStyle: 'round',
      eyeStyle: 'big',
      antennaStyle: 'single',
      accessory: 'none'
    }
  }
}

/**
 * Props du sous-composant MonsterCard
 */
interface MonsterCardProps {
  monster: DBMonster
  isSelected: boolean
  onSelect: (monsterId: string) => void
  isDisabled: boolean
}

/**
 * Sous-composant MonsterCard - Carte individuelle de monstre
 *
 * Optimisation (Performance):
 * - Extrait pour éviter re-render de toute la liste
 * - Mémoïsé avec React.memo
 * - useMemo pour parser les traits JSON une seule fois
 * - Ne re-render que si monster._id, isSelected ou isDisabled change
 */
const MonsterCard = memo(function MonsterCard ({
  monster,
  isSelected,
  onSelect,
  isDisabled
}: MonsterCardProps): React.ReactNode {
  // Optimisation : parser les traits une seule fois avec useMemo
  const traits = useMemo(() => parseTraits(monster.traits), [monster.traits])

  return (
    <button
      onClick={() => { onSelect(monster._id) }}
      disabled={isDisabled}
      className={`
        relative p-4 rounded-2xl border-4 transition-all transform hover:scale-105 active:scale-100
        ${isSelected
          ? 'bg-purple-500/30 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)]'
          : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {/* Badge de sélection */}
      {isSelected && (
        <div className='absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white'>
          <span className='text-white text-xs font-bold'>✓</span>
        </div>
      )}

      {/* Pixel Monster */}
      <div className='w-32 h-32 mx-auto mb-3'>
        <PixelMonster
          state={monster.state}
          traits={traits}
        />
      </div>

      {/* Nom du monstre */}
      <p
        className='text-white text-lg font-bold text-center'
        style={{
          fontFamily: 'monospace',
          textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
        }}
      >
        {monster.name}
      </p>

      {/* Stats */}
      <div className='mt-2 flex justify-center gap-2 text-xs'>
        <span className='text-yellow-400'>😊 {monster.happiness}</span>
        <span className='text-blue-400'>🍔 {monster.hunger}</span>
        <span className='text-green-400'>⚡ {monster.energy}</span>
      </div>
    </button>
  )
}, (prevProps, nextProps) =>
  prevProps.monster._id === nextProps.monster._id &&
  prevProps.isSelected === nextProps.isSelected &&
  prevProps.isDisabled === nextProps.isDisabled
)

/**
 * Props du MonsterSelectionModal
 */
export interface MonsterSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMonster: (monsterId: string) => void
  monsters: DBMonster[]
  itemName: string
  isLoading?: boolean
}

/**
 * Modal de sélection de monstre pour attribuer un item
 *
 * Responsabilités (SRP):
 * - Afficher la liste des monstres disponibles
 * - Permettre la sélection d'un monstre
 * - Confirmer l'attribution de l'item
 *
 * Optimisation (Performance):
 * - Mémoïsé avec React.memo
 * - Sous-composant MonsterCard extrait et mémoïsé
 * - useMemo pour parsing des traits JSON
 */
export const MonsterSelectionModal = memo(function MonsterSelectionModal ({
  isOpen,
  onClose,
  onSelectMonster,
  monsters,
  itemName,
  isLoading = false
}: MonsterSelectionModalProps): React.ReactNode {
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = (): void => {
    if (selectedMonsterId !== null) {
      onSelectMonster(selectedMonsterId)
    }
  }

  const selectedMonster = monsters.find(m => m._id === selectedMonsterId)

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div
        className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-900 border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.5)]'
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-600 to-fuchsia-600 p-6 border-b-4 border-purple-700'>
          <div className='flex justify-between items-center'>
            <div>
              <h2
                className='text-3xl font-black text-white'
                style={{
                  fontFamily: 'monospace',
                  textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
                }}
              >
                🎁 Choisir un monstre
              </h2>
              <p className='text-purple-200 mt-1' style={{ fontFamily: 'monospace' }}>
                Pour recevoir : <strong>{itemName}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='text-white hover:text-purple-200 transition-colors text-3xl font-bold disabled:opacity-50'
              style={{ fontFamily: 'monospace' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='overflow-y-auto max-h-[60vh] p-6'>
          {monsters.length === 0
            ? (
              <div className='text-center py-12'>
                <p className='text-white text-xl font-bold mb-2' style={{ fontFamily: 'monospace' }}>
                  😢 Aucun monstre disponible
                </p>
                <p className='text-gray-400' style={{ fontFamily: 'monospace' }}>
                  Créez d'abord un monstre pour lui attribuer des items !
                </p>
              </div>
              )
            : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {monsters.map((monster) => (
                  <MonsterCard
                    key={monster._id}
                    monster={monster}
                    isSelected={selectedMonsterId === monster._id}
                    onSelect={setSelectedMonsterId}
                    isDisabled={isLoading}
                  />
                ))}
              </div>
              )}
        </div>

        {/* Footer */}
        <div className='bg-slate-950/80 p-6 border-t-4 border-purple-700'>
          <div className='flex justify-between items-center gap-4'>
            <div className='flex-1'>
              {selectedMonster !== undefined && (
                <div className='text-purple-300' style={{ fontFamily: 'monospace' }}>
                  <span className='text-sm'>Sélectionné : </span>
                  <strong className='text-white text-lg'>{selectedMonster.name}</strong>
                </div>
              )}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={onClose}
                disabled={isLoading}
                className='px-6 py-3 rounded-xl font-bold border-4 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                style={{
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                Annuler
              </button>

              <button
                onClick={handleConfirm}
                disabled={selectedMonsterId === null || isLoading}
                className='px-6 py-3 rounded-xl font-bold border-4 border-purple-500 bg-purple-600 text-white hover:bg-purple-500 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                style={{
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                {isLoading
                  ? (
                    <span className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Achat...
                    </span>
                    )
                  : (
                      '✅ Confirmer l\'achat'
                    )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.isOpen === nextProps.isOpen &&
  prevProps.isLoading === nextProps.isLoading &&
  prevProps.itemName === nextProps.itemName &&
  prevProps.monsters.length === nextProps.monsters.length
)

export default MonsterSelectionModal
