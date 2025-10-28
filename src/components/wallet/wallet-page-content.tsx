'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

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

  // Pour l'instant, données mockées - sera remplacé par les vraies données
  const walletData = {
    balance: 1234,
    totalEarned: 5678,
    totalSpent: 4444,
    currency: 'TC'
  }

  const handleGoBack = (): void => {
    router.push('/dashboard')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      {/* Effet de grille en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none' />

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        <div className='max-w-5xl mx-auto space-y-6'>
          {/* Header avec bouton retour */}
          <div className='flex items-center justify-between'>
            <button
              onClick={handleGoBack}
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <span className='text-xl'>←</span>
              <span className='font-medium'>Retour au dashboard</span>
            </button>
          </div>

          {/* Hero Section - Solde principal */}
          <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 p-8 shadow-2xl'>
            {/* Effets décoratifs */}
            <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[size:3rem_3rem]' />
            <div className='absolute top-4 right-4 text-6xl opacity-20'>🪙</div>
            <div className='absolute bottom-4 left-4 text-5xl opacity-20'>💰</div>

            <div className='relative space-y-4'>
              <div className='flex items-center gap-3'>
                <span className='text-5xl'>💰</span>
                <h1 className='text-3xl md:text-4xl font-black text-white' style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                  Mon Portefeuille
                </h1>
              </div>

              <div className='space-y-2'>
                <p className='text-white/80 font-medium text-sm uppercase tracking-wide'>Solde actuel</p>
                <p className='text-6xl md:text-7xl font-black text-white' style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
                  {walletData.balance.toLocaleString()} <span className='text-4xl'>🪙</span>
                </p>
                <p className='text-white/90 font-bold text-lg'>TamaCoins</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Total Gagné */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium mb-1'>Total Gagné</p>
                  <p className='text-3xl font-bold text-green-600'>
                    +{walletData.totalEarned.toLocaleString()} 🪙
                  </p>
                </div>
                <div className='text-5xl'>📈</div>
              </div>
            </div>

            {/* Total Dépensé */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium mb-1'>Total Dépensé</p>
                  <p className='text-3xl font-bold text-red-600'>
                    -{walletData.totalSpent.toLocaleString()} 🪙
                  </p>
                </div>
                <div className='text-5xl'>📉</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Actions rapides</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button className='flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95'>
                <span className='text-2xl'>➕</span>
                <span>Ajouter des coins</span>
              </button>
              <button className='flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95'>
                <span className='text-2xl'>➖</span>
                <span>Retirer des coins</span>
              </button>
            </div>
          </div>

          {/* Historique des transactions (à implémenter) */}
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Historique récent</h2>
            <div className='text-center py-8 text-gray-500'>
              <div className='text-5xl mb-3'>📜</div>
              <p>Aucune transaction pour le moment</p>
              <p className='text-sm mt-2'>Les transactions apparaîtront ici</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPageContent
