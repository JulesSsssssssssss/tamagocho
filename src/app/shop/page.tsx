'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ShopItemDTO } from '@/application/use-cases/shop'
import type { ItemCategory, ItemRarity } from '@/shared/types/shop'
import type { DBMonster } from '@/shared/types/monster'
import { RARITY_COLORS } from '@/shared/types/shop'
import { ItemCard, MonsterSelectionModal, BackgroundCard, PurchaseNotification, type NotificationType } from '@/components/shop'
import { TEST_SHOP_ITEMS } from '@/shared/data/test-shop-items'
import PixelCoin from '@/components/dashboard/pixel-coin'

// Mode de développement : utiliser les données de test
const USE_TEST_DATA = process.env.NODE_ENV === 'development'

/**
 * Interface pour les notifications
 */
interface Notification {
  type: NotificationType
  title: string
  message: string
}

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
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // Modal de sélection de monstre
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopItemDTO | null>(null)
  const [monsters, setMonsters] = useState<DBMonster[]>([])
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Système de notifications
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  // Fonction pour afficher une notification
  const showNotif = (type: NotificationType, title: string, message: string): void => {
    setNotification({ type, title, message })
    setShowNotification(true)
  }

  // Fonction pour fermer la notification
  const closeNotification = (): void => {
    setShowNotification(false)
    setTimeout(() => {
      setNotification(null)
    }, 300) // Attendre la fin de l'animation
  }

  // Fonction pour ouvrir le modal de sélection de monstre
  const handleOpenPurchaseModal = (item: ShopItemDTO): void => {
    // Vérifier si l'utilisateur a assez de monnaie
    if (userBalance < item.price) {
      showNotif(
        'error',
        'Solde insuffisant',
        `Prix de l'item : ${item.price} TC\nVotre solde : ${userBalance} TC\n\nIl vous manque ${item.price - userBalance} TC.`
      )
      return
    }

    setSelectedItem(item)
    setIsModalOpen(true)
  }

  // Fonction pour gérer l'achat d'un item avec sélection du monstre
  const handlePurchaseWithMonster = async (monsterId: string): Promise<void> => {
    if (selectedItem === null) return

    setIsPurchasing(true)
    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          monsterId,
          price: selectedItem.price // Envoyer le prix pour éviter les incohérences
        })
      })

      const data = await response.json()

      if (data.success === true) {
        // Mettre à jour le solde avec la balance retournée par l'API
        if (data.data.remainingBalance !== undefined) {
          setUserBalance(data.data.remainingBalance)
        } else {
          // Sinon recharger le wallet
          await loadWallet()
        }

        // Fermer le modal
        setIsModalOpen(false)
        setSelectedItem(null)

        // Afficher le message de succès avec notification stylisée
        const itemType = selectedItem.category === 'background' ? 'Fond d\'écran' : 'Accessoire'
        showNotif(
          'success',
          'Achat réussi !',
          `${itemType} "${selectedItem.name}" acheté et équipé avec succès !`
        )
      } else {
        // Distinguer les différents types d'erreurs
        const errorMessage = data.error ?? 'Erreur lors de l\'achat'
        const itemType = selectedItem.category === 'background' ? 'fond d\'écran' : 'accessoire'
        
        if (errorMessage.toLowerCase().includes('already owns') || errorMessage.toLowerCase().includes('possède déjà')) {
          // Item déjà possédé
          showNotif(
            'warning',
            `${selectedItem.name} déjà possédé`,
            `Ce monstre possède déjà cet ${itemType}. Rendez-vous dans l'inventaire pour l'équiper.`
          )
        } else if (errorMessage.toLowerCase().includes('insufficient') || errorMessage.toLowerCase().includes('insuffisant')) {
          // Solde insuffisant
          showNotif(
            'error',
            'Solde insuffisant',
            errorMessage
          )
        } else {
          // Autre erreur
          showNotif(
            'error',
            'Erreur',
            errorMessage
          )
        }
      }
    } catch (error) {
      console.error('Error purchasing item:', error)
      showNotif(
        'error',
        'Erreur technique',
        'Une erreur s\'est produite lors de l\'achat. Veuillez réessayer.'
      )
    } finally {
      setIsPurchasing(false)
    }
  }

  // Fonction pour gérer l'achat d'un item (ancienne version - utilisée pour la compatibilité)
  const handlePurchase = async (itemId: string): Promise<void> => {
    // Trouver l'item
    const item = items.find(i => i.id === itemId)
    if (item === undefined) return

    // Ouvrir le modal de sélection de monstre
    handleOpenPurchaseModal(item)
  }

  // Fonction pour charger le wallet depuis l'API
  const loadWallet = async (): Promise<void> => {
    try {
      const response = await fetch('/api/wallet')
      if (response.ok) {
        const data = await response.json()
        if (data.success === true) {
          setUserBalance(data.data.balance)
        }
      }
    } catch (error) {
      console.error('Error loading wallet:', error)
    }
  }

  // Fonction pour charger les données
  const loadData = async (): Promise<void> => {
    try {
      // Charger le wallet en premier
      await loadWallet()

      // En mode développement, utiliser les données de test
      if (USE_TEST_DATA) {
        let filteredItems = [...TEST_SHOP_ITEMS]

        // Appliquer les filtres
        if (selectedCategory !== undefined) {
          filteredItems = filteredItems.filter(item => item.category === selectedCategory)
        }
        if (selectedRarity !== undefined) {
          filteredItems = filteredItems.filter(item => item.rarity === selectedRarity)
        }

        setItems(filteredItems)
        setLoading(false)

        // Charger les monstres de test (en vrai, récupérer depuis l'API)
        const monstersRes = await fetch('/api/monsters')
        if (monstersRes.ok) {
          const monstersData = await monstersRes.json()
          setMonsters(monstersData)
        }

        return
      }

      // En production, charger depuis l'API
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

      // Charger les monstres
      const monstersRes = await fetch('/api/monsters')
      if (monstersRes.ok) {
        const monstersData = await monstersRes.json()
        setMonsters(monstersData)
      }
    } catch (error) {
      console.error('Error loading shop data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Charger les items et le wallet
  useEffect(() => {
    void loadData()
  }, [selectedCategory, selectedRarity])

  // Rafraîchir le wallet quand l'utilisateur revient sur la page
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (!document.hidden) {
        void loadWallet()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const categories: Array<{ value: ItemCategory, label: string, icon: string }> = [
    { value: 'hat', label: 'Chapeaux', icon: '🎩' },
    { value: 'glasses', label: 'Lunettes', icon: '👓' },
    { value: 'shoes', label: 'Chaussures', icon: '👟' },
    { value: 'background', label: 'Fonds', icon: '🖼️' }
  ]

  const rarities: Array<{ value: ItemRarity, label: string, color: string }> = [
    { value: 'common', label: 'Commun', color: RARITY_COLORS.common },
    { value: 'rare', label: 'Rare', color: RARITY_COLORS.rare },
    { value: 'epic', label: 'Épique', color: RARITY_COLORS.epic },
    { value: 'legendary', label: 'Légendaire', color: RARITY_COLORS.legendary }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Effet de grille rétro en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none' />

      {/* Particules pixel-art - jaunes comme le dashboard */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Hero section - Style dashboard */}
          <div className='relative w-full overflow-hidden rounded-3xl bg-slate-900/90 backdrop-blur-sm p-8 md:p-12 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]'>
            {/* Effet de grille rétro */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40' />

            {/* Particules animées */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
              <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
              <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
              <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
            </div>

            {/* Pixels dans les coins */}
            <div className='absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />

            {/* Affichage du solde en haut à droite - Style dashboard */}
            <div className='absolute top-6 right-6 z-10'>
              <button
                onClick={() => { router.push('/wallet') }}
                className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] flex items-center gap-3 transform hover:scale-110 transition-all duration-200 active:scale-95 cursor-pointer hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] group'
                aria-label='Voir mon portefeuille'
              >
                <PixelCoin size={40} />
                <div className='flex flex-col'>
                  <span className='text-xs text-yellow-400/70 font-bold uppercase tracking-wider group-hover:text-yellow-300 transition-colors' style={{ fontFamily: 'monospace' }}>
                    Coins
                  </span>
                  <span className='text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                    {userBalance.toLocaleString()}
                  </span>
                </div>
                <span className='text-sm opacity-0 group-hover:opacity-100 transition-opacity'>👉</span>
              </button>
            </div>

            {/* Contenu principal */}
            <div className='relative z-10 max-w-4xl'>
              {/* Bouton retour */}
              <button
                onClick={() => { router.push('/dashboard') }}
                className='mb-6 bg-slate-950/90 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-yellow-500/50 text-yellow-400 font-bold hover:border-yellow-300 hover:text-yellow-200 transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]'
                style={{
                  fontFamily: 'monospace',
                  imageRendering: 'pixelated',
                  textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                }}
              >
                ← Retour au Dashboard
              </button>

              {/* Titre principal */}
              <div className='mb-4'>
                <h1
                  className='text-5xl md:text-6xl font-black text-white mb-2 tracking-tight'
                  style={{
                    textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated'
                  }}
                >
                  🛍️ BOUTIQUE 🛍️
                </h1>
                <div className='h-2 w-48 bg-yellow-400/60 rounded-sm' style={{ imageRendering: 'pixelated' }} />
              </div>

              {/* Message d'introduction */}
              <div className='bg-slate-950/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700/50 max-w-2xl'>
                <p className='text-white text-lg md:text-xl font-bold mb-2' style={{ fontFamily: 'monospace' }}>
                  🎨 Équipe tes monstres avec style !
                </p>
                <p className='text-white/80 text-sm md:text-base font-bold' style={{ fontFamily: 'monospace' }}>
                  Achète des chapeaux, lunettes, chaussures et fonds d'écran pour personnaliser tes créatures ! 🎩👓👟🖼️
                </p>
              </div>
            </div>
          </div>

          {/* Filtres */}
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
                      ? 'bg-yellow-500/90 border-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
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
                        ? 'bg-yellow-500/90 border-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
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
                      ? 'bg-yellow-500/90 border-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
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

          {/* Message de succès */}
          {purchaseSuccess && (
            <div className='bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border-4 border-green-500/50 text-center'>
              <p className='text-green-400 text-xl font-bold' style={{ fontFamily: 'monospace' }}>
                ✅ Achat réussi ! L'item a été ajouté à votre inventaire.
              </p>
            </div>
          )}

          {/* Grille d'items */}
          <div>
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
                        item.category === 'background'
                          ? (
                              <BackgroundCard
                                key={item.id}
                                item={item}
                                userBalance={userBalance}
                                onPurchase={handlePurchase}
                              />
                            )
                          : (
                              <ItemCard
                                key={item.id}
                                item={item}
                                userBalance={userBalance}
                                onPurchase={handlePurchase}
                              />
                            )
                      ))}
                    </div>
                    )
            }
          </div>
        </div>

        {/* Modal de sélection de monstre */}
        <MonsterSelectionModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false) }}
          onSelectMonster={(monsterId) => { void handlePurchaseWithMonster(monsterId) }}
          monsters={monsters}
          itemName={selectedItem?.name ?? ''}
          isLoading={isPurchasing}
        />

        {/* Notification de succès/erreur */}
        {notification !== null && (
          <PurchaseNotification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={showNotification}
            onClose={closeNotification}
          />
        )}
      </div>
    </div>
  )
}
