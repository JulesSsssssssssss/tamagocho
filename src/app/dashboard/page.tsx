import { getMonsters } from '@/actions/monsters/monsters.actions'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { getServerSessionSafely } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Force dynamic rendering (authenticated route)
export const dynamic = 'force-dynamic'

/**
 * Page Dashboard - Point d'entrée principal de l'espace utilisateur
 *
 * Responsabilités (SRP) :
 * - Récupération des données serveur (session + monstres)
 * - Protection de la route (redirection si non authentifié)
 * - Rendu du composant client DashboardContent
 *
 * Architecture Next.js 15 :
 * - Server Component (async)
 * - Utilise auth.api.getSession pour la session
 * - Utilise Server Actions pour les données
 *
 * Sécurité :
 * - Vérification d'authentification côté serveur
 * - Redirection automatique vers /sign-in si non connecté
 *
 * Performance :
 * - Chargement parallèle session/monsters possible
 * - Composant client séparé pour l'interactivité
 *
 * @returns {Promise<React.ReactNode>} Interface du dashboard
 *
 * @example
 * Route: /dashboard
 * Accessible uniquement aux utilisateurs connectés
 */
async function DashboardPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur (BetterAuth)
  const session = await getServerSessionSafely(async () => new Headers(await headers()))

  // Protection : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupération des monstres de l'utilisateur
  const monsters = await getMonsters()

  // Rendu du composant client avec les données
  return (
    <DashboardContent session={session} monsters={monsters} />
  )
}

export default DashboardPage
