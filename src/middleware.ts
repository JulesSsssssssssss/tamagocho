import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Configuration du runtime
 * Utilise Node.js runtime au lieu de Edge runtime pour supporter MongoDB/BetterAuth
 */
export const runtime = 'nodejs'

/**
 * Middleware Next.js pour la gestion des redirections intelligentes
 *
 * Responsabilités (SRP) :
 * 1. Redirection intelligente sur / selon l'état de connexion
 * 2. Protection des routes authentifiées
 * 3. Redirection des pages d'auth si déjà connecté
 *
 * Règles de redirection (selon spec Feature 2.1) :
 * - / → reste sur / si non connecté (landing page)
 * - / → /app (dashboard) si connecté
 * - /sign-in, /sign-up → /app si déjà connecté
 * - Routes protégées → /sign-in si non authentifié
 *
 * @param {NextRequest} request - Requête Next.js
 * @returns {Promise<NextResponse>} Réponse avec redirection ou next()
 */
export async function middleware (request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  try {
    // Récupération de la session utilisateur
    const session = await auth.api.getSession({
      headers: request.headers
    })

    const isAuthenticated = session !== null && session !== undefined

    // Routes d'authentification
    const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

    // Routes protégées nécessitant une authentification
    const isProtectedRoute = pathname.startsWith('/app') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/creature') ||
      pathname.startsWith('/shop') ||
      pathname.startsWith('/wallet')

    // 🔹 Règle 1 : Redirection intelligente sur la home page "/"
    if (pathname === '/') {
      if (isAuthenticated) {
        // Si connecté → redirection vers /app (dashboard)
        return NextResponse.redirect(new URL('/app', request.url))
      }
      // Si non connecté → reste sur / (landing page)
      return NextResponse.next()
    }

    // 🔹 Règle 2 : /sign-in et /sign-up → /app si déjà connecté
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/app', request.url))
    }

    // 🔹 Règle 3 : Routes protégées → /sign-in si non authentifié
    if (isProtectedRoute && !isAuthenticated) {
      const signInUrl = new URL('/sign-in', request.url)
      // Ajout du paramètre callbackUrl pour rediriger après connexion
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // 🔹 Règle 4 : Alias /app → /dashboard
    if (pathname === '/app') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Toutes les autres routes : pas de redirection
    return NextResponse.next()
  } catch (error) {
    // En cas d'erreur de session (session expirée, corruption, etc.)
    console.error('Middleware error:', error)

    // Si on est sur une route protégée et qu'il y a une erreur de session
    // On redirige vers /sign-in
    const isProtectedRoute = pathname.startsWith('/app') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/creature') ||
      pathname.startsWith('/shop') ||
      pathname.startsWith('/wallet')

    if (isProtectedRoute) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('error', 'session_expired')
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Pour les autres routes, on laisse passer
    return NextResponse.next()
  }
}

/**
 * Configuration du middleware
 *
 * Matcher : définit sur quelles routes le middleware s'applique
 * - Exclut : /api, /_next/static, /_next/image, /favicon.ico, /public
 * - Inclut : toutes les autres routes
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - API routes (/api/*)
     * - Static files (/_next/static, /_next/image)
     * - Favicon et assets publics
     * - Extensions de fichiers (.ico, .png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)'
  ]
}
