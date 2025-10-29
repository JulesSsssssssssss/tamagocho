'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ShopItemDTO } from '@/application/use-cases/shop'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'
import { RARITY_LABELS, RARITY_COLORS } from '@/shared/types/shop'

/**
 * Page de la boutique - Style pixel art gaming
 */
export default function ShopPage (): React.ReactNode {
  const router = useRouter()
  const [items, setItems] = useState<ShopItemDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [userBalance, setUserBalance] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>()
  const [selectedRarity, setSelectedRarity] = useState<ItemRarity | undefined>()

  // Charger les items et le wallet
  useEffect(() => {
    async function loadData (): Promise<void> {
      try {
        // Charger les items
        const params = new URLSearchParams()
        if (selectedCategory !== undefined) {
          params.append('category', selectedCategory)
        }
        if (selectedRarity !== undefined) {
          params.append('rarity', selectedRarity)
        }
        params.append('availableOnly', 'true')

        const itemsRes = await fetch(`/api/shop/items?${params.toString()}`)
        const itemsData = await itemsRes.json()
        if (itemsData.success === true) {
          setItems(itemsData.data)
        }

        // Charger le wallet (TODO: remplacer par la vraie route)
        setUserBalance(1000) // Placeholder
      } catch (error) {
        console.error('Error loading shop data:', error)
      } finally {
        setLoading(false)
      }
    }
    void loadData()
  }, [selectedCategory, selectedRarity])

  const categories: Array<{ value: ItemCategory, label: string, icon: string }> = [
    { value: 'hat', label: 'Chapeaux', icon: '🎩' },
    { value: 'glasses', label: 'Lunettes', icon: '👓' },
    { value: 'shoes', label: 'Chaussures', icon: '👟' }
  ]

  const rarities: Array<{ value: ItemRarity, label: string, color: string }> = [
    { value: 'common', label: 'Commun', color: RARITY_COLORS.common },
    { value: 'rare', label: 'Rare', color: RARITY_COLORS.rare },
    { value: 'epic', label: 'Épique', color: RARITY_COLORS.epic },
    { value: 'legendary', label: 'Légendaire', color: RARITY_COLORS.legendary }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6'>
      {/* Header avec style pixel art */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='relative overflow-hidden rounded-3xl bg-slate-900/90 backdrop-blur-sm p-8 border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]'>
          {/* Grille rétro */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40' />

          {/* Pixels dans les coins */}
          <div className='absolute top-2 left-2 w-4 h-4 bg-purple-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
          <div className='absolute top-2 right-2 w-4 h-4 bg-purple-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
          <div className='absolute bottom-2 left-2 w-4 h-4 bg-purple-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
          <div className='absolute bottom-2 right-2 w-4 h-4 bg-purple-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />

          <div className='relative z-10 flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => { router.push('/dashboard') }}
                className='bg-slate-950/90 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-purple-500/50 text-purple-400 font-bold hover:border-purple-300 hover:text-purple-200 transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                style={{
                  fontFamily: 'monospace',
                  imageRendering: 'pixelated',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                ← Retour
              </button>
              <div>
                <h1
                  className='text-4xl md:text-5xl font-black text-white tracking-tight'
                  style={{
                    textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated'
                  }}
                >
                  🛍️ BOUTIQUE
                </h1>
                <div className='h-2 w-32 bg-purple-400/60 rounded-sm mt-2' style={{ imageRendering: 'pixelated' }} />
              </div>
            </div>

            {/* Affichage du solde */}
            <div className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center gap-3'>
              <span className='text-3xl'>🪙</span>
              <div className='flex flex-col'>
                <span className='text-xs text-yellow-400/70 font-bold uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
                  Solde
                </span>
                <span className='text-2xl font-bold text-yellow-400' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                  {userBalance.toLocaleString()} TC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className='max-w-7xl mx-auto mb-6'>
        <div className='bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50'>
          {/* Filtres par catégorie */}
          <div className='mb-4'>
            <p className='text-white font-bold mb-3 text-sm uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
              🎨 Catégories
            </p>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => { setSelectedCategory(undefined) }}
                className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-110 active:scale-95 border-4 backdrop-blur-sm ${
                  selectedCategory === undefined
                    ? 'bg-purple-500/90 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                    : 'bg-slate-800/70 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/90'
                }`}
                style={{
                  fontFamily: 'monospace',
                  imageRendering: 'pixelated',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { setSelectedCategory(cat.value) }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-110 active:scale-95 border-4 backdrop-blur-sm flex items-center gap-2 ${
                    selectedCategory === cat.value
                      ? 'bg-purple-500/90 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                      : 'bg-slate-800/70 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/90'
                  }`}
                  style={{
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                  }}
                >
                  <span style={{ imageRendering: 'pixelated' }}>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtres par rareté */}
          <div>
            <p className='text-white font-bold mb-3 text-sm uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
              ⭐ Rareté
            </p>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => { setSelectedRarity(undefined) }}
                className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-110 active:scale-95 border-4 backdrop-blur-sm ${
                  selectedRarity === undefined
                    ? 'bg-purple-500/90 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                    : 'bg-slate-800/70 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/90'
                }`}
                style={{
                  fontFamily: 'monospace',
                  imageRendering: 'pixelated',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                Tous
              </button>
              {rarities.map((rarity) => (
                <button
                  key={rarity.value}
                  onClick={() => { setSelectedRarity(rarity.value) }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-110 active:scale-95 border-4 backdrop-blur-sm ${
                    selectedRarity === rarity.value
                      ? 'text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                      : 'bg-slate-800/70 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/90'
                  }`}
                  style={{
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                    ...(selectedRarity === rarity.value
                      ? {
                          backgroundColor: rarity.color,
                          borderColor: rarity.color
                        }
                      : {})
                  }}
                >
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grille d'items */}
      <div className='max-w-7xl mx-auto'>
        {
          loading
            ? (
              <div className='text-center text-white text-2xl font-bold' style={{ fontFamily: 'monospace' }}>
                ⏳ Chargement...
              </div>
              )
            : items.length === 0
              ? (
                <div className='bg-slate-950/60 backdrop-blur-sm rounded-2xl p-12 border-4 border-slate-700/50 text-center'>
                  <p className='text-white text-2xl font-bold mb-2' style={{ fontFamily: 'monospace' }}>
                    😢 Aucun item disponible
                  </p>
                  <p className='text-slate-400' style={{ fontFamily: 'monospace' }}>
                    Essayez de changer les filtres
                  </p>
                </div>
                )
              : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 hover:border-purple-500/50 transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] group'
                    >
                      {/* Badge de rareté */}
                      <div className='flex justify-between items-start mb-4'>
                        <div
                          className='px-3 py-1 rounded-lg font-bold text-xs uppercase'
                          style={{
                            fontFamily: 'monospace',
                            backgroundColor: RARITY_COLORS[item.rarity],
                            color: 'white'
                          }}
                        >
                          {RARITY_LABELS[item.rarity]}
                        </div>
                        <div className='text-2xl'>
                          {item.category === 'hat' && '🎩'}
                          {item.category === 'glasses' && '👓'}
                          {item.category === 'shoes' && '👟'}
                        </div>
                      </div>

                      {/* Image placeholder */}
                      <div className='bg-slate-800/50 rounded-xl h-40 mb-4 flex items-center justify-center border-2 border-slate-700'>
                        <span className='text-6xl'>
                          {item.category === 'hat' && '🎩'}
                          {item.category === 'glasses' && '👓'}
                          {item.category === 'shoes' && '👟'}
                        </span>
                      </div>

                      {/* Nom */}
                      <h3 className='text-white font-bold text-lg mb-2' style={{ fontFamily: 'monospace' }}>
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className='text-slate-400 text-sm mb-4' style={{ fontFamily: 'monospace' }}>
                        {item.description}
                      </p>

                      {/* Prix et bouton */}
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl'>🪙</span>
                          <span className='text-yellow-400 font-bold text-xl' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                            {item.price}
                          </span>
                        </div>
                        <button
                          className='bg-purple-500/90 backdrop-blur-sm hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl transition-all transform hover:scale-110 active:scale-95 border-4 border-purple-400/80 hover:border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:border-slate-600'
                          style={{
                            fontFamily: 'monospace',
                            imageRendering: 'pixelated',
                            textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                          }}
                          disabled={userBalance < item.price}
                        >
                          💰 Acheter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )
        }
      </div>
    </div>
  )
}
