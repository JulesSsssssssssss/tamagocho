/**
 * Page des Quêtes Quotidiennes
 *
 * Responsabilités (SRP):
 * - Afficher les quêtes du jour en plein écran
 * - Permettre le claim des récompenses
 * - Afficher l'historique et les statistiques
 *
 * Architecture (Clean):
 * - Server Component pour l'authentification
 * - Client Component pour l'interactivité
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import QuestsPageContent from '@/components/quests/quests-page-content'

// Force dynamic rendering (authenticated route)
export const dynamic = 'force-dynamic'

/**
 * Page des quêtes quotidiennes (Server Component)
 */
export default async function QuestsPage (): Promise<React.ReactElement> {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/auth/sign-in')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Header */}
      <div className='bg-slate-800/50 backdrop-blur-sm border-b border-yellow-500/20 sticky top-0 z-10'>
        <div className='container mx-auto px-3 sm:px-4 py-4 sm:py-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
              <a
                href='/dashboard'
                className='text-yellow-400 hover:text-yellow-300 transition-colors font-mono text-xs sm:text-sm'
              >
                ← Retour au dashboard
              </a>
              <div className='hidden sm:block h-6 w-px bg-yellow-500/30' />
              <h1 className='text-xl sm:text-2xl md:text-3xl font-black text-white font-mono tracking-wider'>
                🎯 QUÊTES QUOTIDIENNES
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className='container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8'>
        <QuestsPageContent />
      </div>
    </div>
  )
}

/**
 * Métadonnées de la page
 */
export const metadata = {
  title: 'Quêtes Quotidiennes | Tamagocho',
  description: 'Complète tes quêtes quotidiennes et gagne des Tamacoins !'
}
