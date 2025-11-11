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
    <div className='min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Pixel grid background effect - Style gaming */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40' />

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
          <div className='mb-6 bg-red-500/10 border-4 border-red-500 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] backdrop-blur-sm p-6 transform hover:scale-105 transition-transform duration-200'>
            <div className='flex items-start gap-3'>
              <span className='text-3xl'>⚠️</span>
              <div>
                <p className='text-red-400 font-bold text-sm mb-1'>❌ {errorMessage}</p>
                {callbackUrl !== undefined && (
                  <p className='text-red-300 text-xs font-mono bg-red-950/30 px-2 py-1 rounded border border-red-700 mt-2'>
                    → Redirection : {callbackUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main card - Style pixel-art gaming avec bordures jaunes */}
        <div className='bg-slate-900/90 backdrop-blur-sm border-4 border-yellow-500 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.4)] p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300'>
          {/* Decorative top bar - Style gaming jaune/bleu */}
          <div className='absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-500 via-blue-500 to-yellow-500' />

          {/* Corner decorations - Style pixel jaune/bleu */}
          <div className='absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-yellow-500 rounded-tl' />
          <div className='absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-blue-500 rounded-tr' />
          <div className='absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-blue-500 rounded-bl' />
          <div className='absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-yellow-500 rounded-br' />

          {/* Welcome message - Style gaming */}
          <div className='text-center mb-8 mt-2'>
            <div className='text-6xl mb-4 animate-bounce'>🎮</div>
            <h1 className='text-3xl font-black bg-gradient-to-r from-yellow-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]'>
              Bienvenue chez Tamagotcho !
            </h1>
            <p className='text-gray-300 font-semibold text-sm flex items-center justify-center gap-2'>
              <span>Vos petits monstres vous attendent</span>
              <span className='text-xl'>👹✨</span>
            </p>
          </div>

          <AuthFormContent />
        </div>

        {/* Fun quote below the card - Style pixel-art */}
        <div className='text-center mt-6 bg-slate-800/50 backdrop-blur-sm border-2 border-yellow-500/30 rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]'>
          <p className='text-gray-300 font-medium text-sm flex items-center justify-center gap-2'>
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
