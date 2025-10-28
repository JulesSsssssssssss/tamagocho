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
export function useLogout () {
  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   * Utilise window.location.href pour forcer un rechargement complet
   */
  const logout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  return {
    logout
  }
}
