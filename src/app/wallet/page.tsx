import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import WalletPageContent from '@/components/wallet/wallet-page-content'

/**
 * Page Wallet - Affichage du portefeuille utilisateur
 *
 * Responsabilités (SRP):
 * - Protection de la route (authentification)
 * - Récupération de la session
 * - Rendu du composant client WalletPageContent
 *
 * Architecture Next.js 15:
 * - Server Component (async)
 * - Utilise auth.api.getSession pour la session
 *
 * Sécurité:
 * - Redirection vers /sign-in si non connecté
 *
 * @returns {Promise<React.ReactNode>} Interface du wallet
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

  return <WalletPageContent session={session} />
}

export default WalletPage
