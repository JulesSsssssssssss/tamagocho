import { authClient } from '@/lib/auth-client'

/**
 * Hook personnalisé pour gérer la déconnexion utilisateur
 *
 * Responsabilités (SRP) :
 * - Déconnexion côté client via BetterAuth
 * - Redirection vers la page de connexion
 *
 * @returns {Object} Fonctions liées à l'authentification
 * @property {Function} logout - Déconnecte l'utilisateur et redirige vers /sign-in
 *
 * @example
 * ```tsx
 * const { logout } = useLogout()
 *
 * return (
 *   <Button onClick={logout}>Se déconnecter</Button>
 * )
 * ```
 */
export function useLogout (): { logout: () => Promise<void> } {
  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   * Utilise window.location.href pour forcer un rechargement complet
   */
  const logout = async (): Promise<void> => {
    try {
      await authClient.signOut()
      window.location.href = '/sign-in'
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Redirection même en cas d'erreur pour déconnecter côté client
      window.location.href = '/sign-in'
    }
  }

  return {
    logout
  }
}
