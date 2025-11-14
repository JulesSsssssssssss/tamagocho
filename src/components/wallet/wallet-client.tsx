'use client'

import { type DBWallet } from '@/actions/wallet.actions'
import { useState, useEffect } from 'react'
import type React from 'react'
import { pricingTable } from '@/config/pricing'
import PixelCoin from '@/components/dashboard/pixel-coin'
import { useRouter } from 'next/navigation'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * WalletClient - Composant d'achat de Tamacoins (Pixel Art)
 *
 * Architecture:
 * - Layer: Presentation (UI Component)
 * - Type: Client Component (interactivité Stripe)
 *
 * Responsabilités (SRP):
 * - Afficher le solde actuel de Tamacoins
 * - Présenter les packages d'achat disponibles
 * - Gérer les interactions utilisateur pour l'achat
 * - Rediriger vers Stripe Checkout
 *
 * Design System:
 * - Style: Pixel Art (comme le dashboard)
 * - Couleurs: moccaccino, lochinvar, fuchsia-blue
 * - Typographie: monospace pour l'effet rétro
 * - Bordures: style gaming 4px
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): React.ReactElement {
  const [wallet] = useState<DBWallet>(initialWallet)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  /**
   * Gère l'achat de Tamacoins via Stripe
   *
   * @param amount - Montant de Tamacoins à acheter
   */
  const handlePurchase = async (amount: number): Promise<void> => {
    setError(null)
    setIsPurchasing(true)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement')
      }

      const { url } = await response.json()

      if (url !== null && url !== undefined && url !== '') {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'achat de Tamacoins')
      setIsPurchasing(false)
    }
  }

  /**
   * Retour au Dashboard
   */
  const handleGoBack = (): void => {
    router.push('/dashboard')
  }

  // Packages d'achat avec le style pixel-art
  const packages = [
    {
      amount: 10,
      price: pricingTable[10].price,
      icon: '🪙',
      badge: 'Débutant',
      popular: false,
      borderColor: 'border-moccaccino-500',
      bgGradient: 'from-moccaccino-100 to-moccaccino-200'
    },
    {
      amount: 50,
      price: pricingTable[50].price,
      icon: '💰',
      badge: 'Populaire',
      popular: true,
      borderColor: 'border-lochinvar-500',
      bgGradient: 'from-lochinvar-100 to-lochinvar-200'
    },
    {
      amount: 500,
      price: pricingTable[500].price,
      icon: '💎',
      badge: 'Pro',
      popular: false,
      borderColor: 'border-fuchsia-blue-500',
      bgGradient: 'from-fuchsia-blue-100 to-fuchsia-blue-200'
    },
    {
      amount: 1000,
      price: pricingTable[1000].price,
      icon: '👑',
      badge: 'Royal',
      popular: false,
      borderColor: 'border-moccaccino-600',
      bgGradient: 'from-moccaccino-200 to-fuchsia-blue-200'
    },
    {
      amount: 5000,
      price: pricingTable[5000].price,
      icon: '🌟',
      badge: 'Légendaire',
      popular: false,
      borderColor: 'border-fuchsia-blue-600',
      bgGradient: 'from-fuchsia-blue-200 to-lochinvar-200'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 md:p-8'>
      {/* Effet de grille rétro en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none' />

      {/* Particules pixel-art */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      <div className='relative max-w-6xl mx-auto'>
        {/* En-tête pixel-art */}
        <div className='text-center mb-6 sm:mb-8 md:mb-12'>
          <h1
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 tracking-tight px-2'
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              imageRendering: 'pixelated'
            }}
          >
            💰 BOUTIQUE TAMACOINS 💰
          </h1>
          <div className='h-1.5 sm:h-2 w-32 sm:w-48 bg-yellow-400/60 rounded-sm mx-auto mb-3 sm:mb-4' style={{ imageRendering: 'pixelated' }} />
          <p className='text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-bold px-4' style={{ fontFamily: 'monospace' }}>
            🎮 Achète des Tamacoins pour ton aventure ! 🎮
          </p>
        </div>

        {/* Carte du solde actuel - Style pixel-art */}
        <div className='relative mb-6 sm:mb-8 md:mb-12'>
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border-3 sm:border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] p-4 sm:p-6 md:p-8 lg:p-10'>
            {/* Effet de pixels dans les coins */}
            <div className='absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />

            <div className='text-center'>
              {/* Bouton retour - même style que shop */}
              <div className='flex justify-start mb-4 sm:mb-6'>
                <button
                  onClick={handleGoBack}
                  className='bg-slate-950/90 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 border-3 sm:border-4 border-yellow-500/50 text-yellow-400 font-bold hover:border-yellow-300 hover:text-yellow-200 transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] text-xs sm:text-sm md:text-base w-full sm:w-auto'
                  style={{
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                  }}
                >
                  ← Retour au Dashboard
                </button>
              </div>

              <p className='text-xs sm:text-sm md:text-base font-bold text-yellow-400 uppercase tracking-widest mb-3 sm:mb-4' style={{ fontFamily: 'monospace' }}>
                💎 Ton Trésor Actuel 💎
              </p>
              <div className='flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-3 sm:mb-4'>
                <span className='sm:hidden'><PixelCoin size={32} /></span>
                <span className='hidden sm:block md:hidden'><PixelCoin size={48} /></span>
                <span className='hidden md:block'><PixelCoin size={64} /></span>
                <h2
                  className='text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-yellow-400'
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '4px 4px 0px rgba(0,0,0,0.5)'
                  }}
                >
                  {wallet.balance.toLocaleString('fr-FR')}
                </h2>
                <span className='sm:hidden'><PixelCoin size={32} /></span>
                <span className='hidden sm:block md:hidden'><PixelCoin size={48} /></span>
                <span className='hidden md:block'><PixelCoin size={64} /></span>
              </div>
              <p className='text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-white' style={{ fontFamily: 'monospace' }}>
                TAMACOINS
              </p>
            </div>
          </div>
        </div>

        {/* Message d'erreur pixel-art */}
        {error !== null && (
          <div className='bg-red-900/90 border-3 sm:border-4 border-red-500 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 md:mb-8 text-center text-sm sm:text-base md:text-lg font-bold shadow-xl' style={{ fontFamily: 'monospace' }}>
            <span className='text-2xl sm:text-3xl md:text-4xl mr-2 sm:mr-3'>⚠️</span>
            {error}
          </div>
        )}

        {/* Titre de la boutique */}
        <div className='text-center mb-4 sm:mb-6 md:mb-8'>
          <h2
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 mb-2 sm:mb-3 md:mb-4 px-2'
            style={{
              fontFamily: 'monospace',
              textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
            }}
          >
            🎁 CHOISIS TON PACK ! 🎁
          </h2>
          <p className='text-xs sm:text-sm md:text-base lg:text-xl text-white/90 font-bold px-4' style={{ fontFamily: 'monospace' }}>
            🔒 Paiement sécurisé par Stripe 🔒
          </p>
        </div>

        {/* Grille des packages - Style pixel-art */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12'>
          {packages.map((pkg) => (
            <div
              key={pkg.amount}
              className={`group relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border-4 ${pkg.borderColor} p-6 sm:p-8 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] ${
                pkg.popular ? 'ring-4 ring-yellow-400 transform scale-105 shadow-[0_0_40px_rgba(234,179,8,0.4)]' : ''
              }`}
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Badge populaire */}
              {pkg.popular && (
                <div className='absolute -top-4 -right-4 z-20'>
                  <div className='bg-yellow-500 text-slate-900 font-black text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-xl border-4 border-yellow-600 shadow-xl transform rotate-12 animate-bounce' style={{ fontFamily: 'monospace' }}>
                    ⭐ {pkg.badge} ⭐
                  </div>
                </div>
              )}

              {/* Badge du pack */}
              {!pkg.popular && (
                <div className='absolute top-3 sm:top-4 right-3 sm:right-4 z-10'>
                  <div className={`bg-gradient-to-br ${pkg.bgGradient} text-slate-900 font-black text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 ${pkg.borderColor} shadow-lg`} style={{ fontFamily: 'monospace' }}>
                    {pkg.badge}
                  </div>
                </div>
              )}

              {/* Pixels décoratifs dans les coins */}
              <div className='absolute top-2 left-2 w-3 h-3 bg-white/20 rounded-sm' style={{ imageRendering: 'pixelated' }} />
              <div className='absolute bottom-2 right-2 w-3 h-3 bg-white/20 rounded-sm' style={{ imageRendering: 'pixelated' }} />

              {/* Contenu */}
              <div className='relative text-center'>
                {/* Icon du pack */}
                <div className='text-5xl sm:text-7xl mb-4 sm:mb-6'>{pkg.icon}</div>

                {/* Montant de Tamacoins avec PixelCoin */}
                <div className='mb-4 sm:mb-6 flex items-center justify-center gap-3'>
                  <PixelCoin size={40} />
                  <div className={`bg-gradient-to-br ${pkg.bgGradient} text-slate-900 font-black text-3xl sm:text-5xl px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-4 ${pkg.borderColor} shadow-2xl`} style={{ fontFamily: 'monospace' }}>
                    {pkg.amount.toLocaleString('fr-FR')}
                  </div>
                </div>

                {/* Prix */}
                <div className='mb-6 sm:mb-8'>
                  <div
                    className='text-3xl sm:text-5xl font-black text-green-400 mb-2'
                    style={{
                      fontFamily: 'monospace',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                    }}
                  >
                    {pkg.price}€
                  </div>
                  <p className='text-xs sm:text-sm text-white/60 font-medium' style={{ fontFamily: 'monospace' }}>
                    = {(pkg.price / pkg.amount).toFixed(3)}€/coin
                  </p>
                </div>

                {/* Bouton d'achat pixel-art */}
                <button
                  onClick={() => { void handlePurchase(pkg.amount) }}
                  disabled={isPurchasing}
                  className={`w-full bg-gradient-to-br ${pkg.bgGradient} hover:brightness-110 text-slate-900 font-black text-base sm:text-xl py-4 sm:py-5 px-5 sm:px-6 rounded-xl border-4 ${pkg.borderColor} transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl active:scale-95 uppercase`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {isPurchasing
                    ? (
                      <span className='flex items-center justify-center gap-2 sm:gap-3'>
                        <span className='text-xl sm:text-2xl'>⏳</span>
                        <span>Chargement...</span>
                      </span>
                      )
                    : (
                      <span className='flex items-center justify-center gap-2 sm:gap-3'>
                        <span className='text-xl sm:text-2xl'>🛒</span>
                        <span>Acheter</span>
                        <span className='text-xl sm:text-2xl'>✨</span>
                      </span>
                      )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informations supplémentaires - Style pixel-art */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6'>
          {[
            { icon: '🔒', title: 'Sécurisé', text: 'Cryptage SSL Stripe' },
            { icon: '⚡', title: 'Instantané', text: 'Coins ajoutés immédiatement' },
            { icon: '💳', title: 'Tous moyens', text: 'CB, PayPal, Apple Pay' }
          ].map((item, index) => (
            <div
              key={index}
              className='bg-slate-800/90 backdrop-blur-sm rounded-2xl border-4 border-slate-600 p-5 sm:p-6 transform hover:scale-105 transition-all duration-200 hover:border-white/40'
              style={{ imageRendering: 'pixelated' }}
            >
              <div className='text-center'>
                <div className='text-4xl sm:text-5xl mb-2 sm:mb-3'>{item.icon}</div>
                <h3 className='text-lg sm:text-xl font-black text-white mb-1 sm:mb-2' style={{ fontFamily: 'monospace' }}>
                  {item.title}
                </h3>
                <p className='text-sm sm:text-base text-white/70 font-medium' style={{ fontFamily: 'monospace' }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
