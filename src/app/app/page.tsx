import { redirect } from 'next/navigation'

/**
 * Page /app - Alias vers /dashboard
 *
 * Cette page redirige automatiquement vers /dashboard.
 * Elle sert de point d'entrée principal après connexion.
 *
 * Raison : Selon les specs Feature 2.1, après connexion on redirige vers /app
 * mais l'implémentation réelle est dans /dashboard
 *
 * @returns {never} Redirige toujours vers /dashboard
 */
export default async function AppPage (): Promise<never> {
  redirect('/dashboard')
}
