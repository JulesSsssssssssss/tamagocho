import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import WalletClient from '@/components/wallet/wallet-client'
import { getWallet } from '@/actions/wallet.actions'

/**
 * Page Wallet - Boutique de Koins avec Stripe
 *
 * Responsabilités (SRP):
 * - Protection de la route (authentification)
 * - Récupération du wallet utilisateur
 * - Rendu du composant client WalletClient avec Stripe
 *
 * Architecture Next.js 15:
 * - Server Component (async)
 * - Utilise auth.api.getSession pour la session
 * - Appelle getWallet() pour récupérer le solde
 *
 * Sécurité:
 * - Redirection vers /sign-in si non connecté
 *
 * Features:
 * - Affichage du solde de Koins
 * - Packages d'achat via Stripe Checkout
 * - Design system: moccaccino, lochinvar, fuchsia-blue
 *
 * @returns {Promise<React.ReactNode>} Interface du wallet avec boutique
 *
 * @example
 * Route: /wallet
 * Accessible uniquement aux utilisateurs connectés
 */
async function WalletPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur (BetterAuth)
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupération du wallet
  const walletResponse = await getWallet()

  if (!walletResponse.success || walletResponse.wallet === undefined) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-moccaccino-50 via-lochinvar-50 to-fuchsia-blue-50'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>😢</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Erreur de chargement
          </h1>
          <p className='text-gray-600'>
            {walletResponse.error ?? 'Impossible de charger votre wallet.'}
          </p>
        </div>
      </div>
    )
  }

  return <WalletClient initialWallet={walletResponse.wallet} />
}

export default WalletPage
