import AuthFormContent from '@/components/forms/auth-form-content'
import { connectToDatabase } from '@/db'

/**
 * Page de connexion/inscription
 *
 * Responsabilités :
 * - Affichage des formulaires d'authentification
 * - Affichage des messages d'erreur (session expirée, etc.)
 * - Gestion du paramètre callbackUrl pour redirection post-connexion
 *
 * @param {Object} props - Props de la page
 * @param {Object} props.searchParams - Paramètres de recherche URL
 * @returns {Promise<React.ReactNode>} Page de connexion
 */
async function SignInPage ({
  searchParams
}: {
  searchParams: Promise<{ error?: string, callbackUrl?: string }>
}): Promise<React.ReactNode> {
  await connectToDatabase()

  const params = await searchParams
  const errorType = params.error
  const callbackUrl = params.callbackUrl

  // Messages d'erreur selon le type
  const errorMessages: Record<string, string> = {
    session_expired: '⏰ Votre session a expiré. Veuillez vous reconnecter.',
    unauthorized: '🔒 Vous devez être connecté pour accéder à cette page.',
    authentication_failed: '❌ Échec de l\'authentification. Veuillez réessayer.'
  }

  const errorMessage = errorType !== undefined ? errorMessages[errorType] : undefined
  return (
    <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 via-fuchsia-blue-50 to-lochinvar-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Pixel grid background effect */}
      <div className='absolute inset-0 opacity-5' style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, currentColor 19px, currentColor 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, currentColor 19px, currentColor 20px)',
        backgroundSize: '20px 20px'
      }} />

      {/* Animated floating monsters - Style pixel art */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-20 left-10 text-6xl animate-bounce filter drop-shadow-lg'>🥺</div>
        <div className='absolute top-32 right-20 text-5xl animate-pulse filter drop-shadow-lg'>👾</div>
        <div className='absolute bottom-40 left-20 text-4xl animate-bounce filter drop-shadow-lg' style={{ animationDelay: '1s' }}>🧸</div>
        <div className='absolute bottom-20 right-10 text-5xl animate-pulse filter drop-shadow-lg' style={{ animationDelay: '2s' }}>🦄</div>
        <div className='absolute top-1/2 left-5 text-3xl animate-bounce filter drop-shadow-lg' style={{ animationDelay: '0.5s' }}>🎀</div>
        <div className='absolute top-1/3 right-5 text-4xl animate-pulse filter drop-shadow-lg' style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Main card container - Style pixel-art gaming */}
      <div className='w-full max-w-md relative z-10'>
        {/* Error message banner - Style pixel-art */}
        {errorMessage !== undefined && (
          <div className='mb-6 bg-red-100 border-4 border-red-500 rounded-xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-200'>
            <div className='flex items-start gap-3'>
              <span className='text-3xl'>⚠️</span>
              <div>
                <p className='text-red-700 font-bold text-sm mb-1'>❌ {errorMessage}</p>
                {callbackUrl !== undefined && (
                  <p className='text-red-600 text-xs font-mono bg-red-50 px-2 py-1 rounded border border-red-300 mt-2'>
                    → Redirection : {callbackUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main card - Style pixel-art gaming avec bordures épaisses */}
        <div className='bg-white border-4 border-moccaccino-300 rounded-2xl shadow-2xl p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300'>
          {/* Decorative top bar - Style gaming */}
          <div className='absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-moccaccino-500 via-fuchsia-blue-500 to-lochinvar-500' />
          
          {/* Corner decorations - Style pixel */}
          <div className='absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-moccaccino-500 rounded-tl' />
          <div className='absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-lochinvar-500 rounded-tr' />
          <div className='absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-fuchsia-blue-500 rounded-bl' />
          <div className='absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-moccaccino-500 rounded-br' />

          {/* Welcome message - Style gaming */}
          <div className='text-center mb-8 mt-2'>
            <div className='text-6xl mb-4 animate-bounce'>🎮</div>
            <h1 className='text-3xl font-black bg-gradient-to-r from-moccaccino-600 via-fuchsia-blue-600 to-lochinvar-600 bg-clip-text text-transparent mb-2 drop-shadow-sm'>
              Bienvenue chez Tamagotcho !
            </h1>
            <p className='text-gray-700 font-semibold text-sm flex items-center justify-center gap-2'>
              <span>Vos petits monstres vous attendent</span>
              <span className='text-xl'>👹✨</span>
            </p>
          </div>

          <AuthFormContent />
        </div>

        {/* Fun quote below the card - Style pixel-art */}
        <div className='text-center mt-6 bg-white/50 backdrop-blur-sm border-2 border-moccaccino-200 rounded-xl px-4 py-3 shadow-lg'>
          <p className='text-gray-700 font-medium text-sm flex items-center justify-center gap-2'>
            <span className='text-xl'>💬</span>
            <span className='italic'>"Un monstre par jour éloigne l'ennui pour toujours !"</span>
            <span className='text-xl'>🎭</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
