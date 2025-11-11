'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import PixelCoin from '@/components/dashboard/pixel-coin'
import { getWallet } from '@/actions/wallet.actions'

/**
 * Type de session inféré depuis BetterAuth client
 */
type Session = typeof authClient.$Infer.Session

/**
 * Props du composant WalletPageContent
 */
interface WalletPageContentProps {
  /** Session utilisateur courante */
  session: Session
}

/**
 * Interface pour les données du wallet
 */
interface WalletData {
  balance: number
  totalEarned: number
  totalSpent: number
  currency: 'TC'
}

/**
 * Composant principal de la page Wallet
 *
 * Responsabilités (SRP):
 * - Affichage du solde du wallet
 * - Affichage des statistiques
 * - Historique des transactions
 * - Actions (ajouter/retirer des coins)
 *
 * @param {WalletPageContentProps} props - Props du composant
 * @returns {React.ReactNode} Interface du wallet
 */
function WalletPageContent ({ session }: WalletPageContentProps): React.ReactNode {
  const router = useRouter()
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données du wallet au montage
  useEffect(() => {
    const loadWallet = async (): Promise<void> => {
      const result = await getWallet()

      if (result.success && result.wallet != null) {
        setWalletData({
          balance: result.wallet.balance,
          totalEarned: result.wallet.totalEarned,
          totalSpent: result.wallet.totalSpent,
          currency: result.wallet.currency
        })
      } else {
        setError(result.error ?? 'Failed to load wallet')
      }

      setLoading(false)
    }

    void loadWallet()
  }, [])

  const handleGoBack = (): void => {
    router.push('/dashboard')
  }

  // État de chargement
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-pulse'>💰</div>
          <p className='text-white font-bold text-xl' style={{ fontFamily: 'monospace' }}>
            Chargement du wallet...
          </p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error != null || walletData == null) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center'>
        <div className='text-center bg-red-900/50 backdrop-blur-sm p-8 rounded-2xl border-4 border-red-700'>
          <div className='text-6xl mb-4'>❌</div>
          <p className='text-white font-bold text-xl mb-2' style={{ fontFamily: 'monospace' }}>
            Erreur
          </p>
          <p className='text-red-300' style={{ fontFamily: 'monospace' }}>
            {error ?? 'Failed to load wallet'}
          </p>
          <button
            onClick={handleGoBack}
            className='mt-6 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors'
            style={{ fontFamily: 'monospace' }}
          >
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none' style={{ imageRendering: 'pixelated' }} />

      {/* Particules animées pixel art */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-20 w-3 h-3 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-40 right-32 w-4 h-4 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-32 left-1/3 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-400/10 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        <div className='max-w-5xl mx-auto space-y-6'>
          {/* Header avec bouton retour - Style pixel art */}
          <div className='flex items-center justify-between'>
            <button
              onClick={handleGoBack}
              className='flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border-4 border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg'
              style={{ fontFamily: 'monospace' }}
            >
              <span className='text-2xl'>←</span>
              <span className='font-bold uppercase tracking-wider text-sm'>Retour</span>
            </button>
          </div>

          {/* Hero Section - Solde principal - Style pixel art */}
          <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-blue-600 via-moccaccino-500 to-lochinvar-600 p-8 md:p-12 shadow-2xl'>
            {/* Effet de grille rétro */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30' />

            {/* Particules animées */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
              <div className='absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
              <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-white/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
              <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-white/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
            </div>

            <div className='relative space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-slate-900/50 rounded-2xl border-4 border-slate-700'>
                  <PixelCoin size={64} />
                </div>
                <h1 className='text-4xl md:text-5xl font-black text-white uppercase tracking-tight' style={{ fontFamily: 'monospace', textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
                  Portefeuille
                </h1>
              </div>

              <div className='space-y-3 bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border-4 border-slate-700'>
                <p className='text-yellow-400/80 font-bold text-sm uppercase tracking-widest' style={{ fontFamily: 'monospace' }}>
                  Solde actuel
                </p>
                <div className='flex items-center gap-4'>
                  <p className='text-6xl md:text-7xl font-black text-yellow-400' style={{ fontFamily: 'monospace', textShadow: '4px 4px 0px rgba(0,0,0,0.4)' }}>
                    {walletData.balance.toLocaleString()}
                  </p>
                  <PixelCoin size={56} />
                </div>
                <p className='text-yellow-300/90 font-bold text-xl uppercase tracking-wide' style={{ fontFamily: 'monospace' }}>
                  TamaCoins
                </p>
              </div>

              {/* Bouton retour au Dashboard - Style pixel art */}
              <div className='flex justify-center pt-2'>
                <button
                  onClick={handleGoBack}
                  className='group flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 px-8 py-4 rounded-2xl border-4 border-slate-700 hover:border-yellow-400/50 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-yellow-400/20'
                  style={{ fontFamily: 'monospace', imageRendering: 'pixelated' }}
                >
                  <span className='text-3xl group-hover:scale-110 transition-transform duration-300'>🏠</span>
                  <span className='font-black uppercase tracking-wider text-lg group-hover:text-yellow-400 transition-colors duration-300'>
                    Retour au Dashboard
                  </span>
                  <span className='text-2xl group-hover:translate-x-1 transition-transform duration-300'>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques - Style pixel art */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Total Gagné */}
            <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-slate-700 hover:border-green-500/50 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <p className='text-slate-400 text-sm font-bold uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
                    Total Gagné
                  </p>
                  <div className='flex items-center gap-2'>
                    <p className='text-3xl font-black text-green-400' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
                      +{walletData.totalEarned.toLocaleString()}
                    </p>
                    <PixelCoin size={32} />
                  </div>
                </div>
                <div className='text-5xl'>📈</div>
              </div>
            </div>

            {/* Total Dépensé */}
            <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-slate-700 hover:border-red-500/50 transition-all duration-300'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <p className='text-slate-400 text-sm font-bold uppercase tracking-wider' style={{ fontFamily: 'monospace' }}>
                    Total Dépensé
                  </p>
                  <div className='flex items-center gap-2'>
                    <p className='text-3xl font-black text-red-400' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
                      -{walletData.totalSpent.toLocaleString()}
                    </p>
                    <PixelCoin size={32} />
                  </div>
                </div>
                <div className='text-5xl'>📉</div>
              </div>
            </div>
          </div>

          {/* Actions - Style pixel art */}
          <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-slate-700'>
            <h2 className='text-2xl font-black text-white mb-6 uppercase tracking-wide' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
              Actions rapides
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button className='flex items-center justify-center gap-3 bg-gradient-to-br from-green-600 to-emerald-700 text-white font-black py-5 px-6 rounded-xl border-4 border-green-800 hover:border-green-500 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide' style={{ fontFamily: 'monospace' }}>
                <span className='text-3xl'>➕</span>
                <span>Ajouter</span>
              </button>
              <button className='flex items-center justify-center gap-3 bg-gradient-to-br from-red-600 to-rose-700 text-white font-black py-5 px-6 rounded-xl border-4 border-red-800 hover:border-red-500 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide' style={{ fontFamily: 'monospace' }}>
                <span className='text-3xl'>➖</span>
                <span>Retirer</span>
              </button>
            </div>
          </div>

          {/* Historique des transactions - Style pixel art */}
          <div className='bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-4 border-slate-700'>
            <h2 className='text-2xl font-black text-white mb-6 uppercase tracking-wide' style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
              Historique récent
            </h2>
            <div className='text-center py-12 text-slate-400'>
              <div className='text-6xl mb-4'>📜</div>
              <p className='font-bold text-lg' style={{ fontFamily: 'monospace' }}>
                Aucune transaction
              </p>
              <p className='text-sm mt-2 text-slate-500' style={{ fontFamily: 'monospace' }}>
                Les transactions apparaîtront ici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPageContent
