'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Bouton d'authentification GitHub
 *
 * Utilise Better Auth pour l'authentification OAuth GitHub
 * selon la documentation: https://www.better-auth.com/docs/authentication/github
 *
 * Responsabilités :
 * - Déclencher le flux OAuth GitHub
 * - Afficher l'état de chargement pendant la redirection
 * - Gérer les erreurs potentielles
 */
export default function GitHubSignInButton (): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleGitHubSignIn = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError('')

      console.log('🚀 Démarrage de l\'authentification GitHub...')

      // Toast d'information
      toast.info('🚀 Redirection vers GitHub...', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Authentification GitHub selon la doc Better Auth
      // https://www.better-auth.com/docs/authentication/github
      // La redirection vers GitHub se fait automatiquement
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard' // Redirection après authentification
      })

      console.log('✅ Redirection vers GitHub initiée')
    } catch (err) {
      setIsLoading(false)
      const errorMsg = 'Échec de la connexion avec GitHub. Veuillez réessayer.'
      setError(errorMsg)
      console.error('❌ Erreur GitHub sign-in:', err)
      
      // Toast d'erreur
      toast.error(`❌ ${errorMsg}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  }

  return (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={() => {
          void handleGitHubSignIn()
        }}
        disabled={isLoading}
        className='w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-slate-500 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95'
      >
        {/* GitHub Icon */}
        <svg
          className='w-6 h-6 fill-white group-hover:fill-gray-100 transition-colors'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
        </svg>

        {/* Button text */}
        <span className='font-bold text-white text-base'>
          {isLoading ? '🔄 Redirection...' : '🚀 Continuer avec GitHub'}
        </span>
      </button>

      {/* Error message */}
      {error.length > 0 && (
        <div className='bg-red-500/10 border-2 border-red-500 rounded-lg px-3 py-2 animate-pulse'>
          <p className='text-red-400 text-xs font-medium text-center'>
            ⚠️ {error}
          </p>
        </div>
      )}
    </div>
  )
}
