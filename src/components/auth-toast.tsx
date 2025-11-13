/**
 * Composants de notification pour l'authentification
 * Style pixel art gaming pour les messages de succès et d'erreur
 */

interface AuthSuccessToastProps {
  message: string
  emoji?: string
}

interface AuthErrorToastProps {
  message: string
}

/**
 * Toast de succès pour l'authentification
 */
export function AuthSuccessToast ({ message, emoji = '🎉' }: AuthSuccessToastProps): React.ReactNode {
  return (
    <div className='relative flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 pointer-events-none' style={{ imageRendering: 'pixelated' }} />

      {/* Icône animée avec effet pixel */}
      <div className='relative z-10'>
        <div className='w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-pulse border-3 border-emerald-300'>
          <span className='text-3xl animate-bounce'>{emoji}</span>
        </div>
        {/* Effet de brillance */}
        <div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-sm opacity-75 animate-pulse' style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Contenu texte - Style rétro gaming */}
      <div className='flex flex-col gap-1 z-10'>
        <p className='text-emerald-100 font-black text-base font-mono tracking-wide leading-tight' style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          {message}
        </p>
      </div>

      {/* Particules décoratives pixel art */}
      <div className='absolute top-2 right-2 w-2 h-2 bg-emerald-400/50 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.2s' }} />
      <div className='absolute bottom-3 right-4 w-2 h-2 bg-emerald-300/40 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
      
      {/* Confettis */}
      <div className='absolute top-1 left-[20%] w-2 h-2 bg-yellow-400 animate-bounce' style={{ animationDelay: '0s', animationDuration: '1s', imageRendering: 'pixelated' }} />
      <div className='absolute top-1 left-[80%] w-2 h-2 bg-pink-400 animate-bounce' style={{ animationDelay: '0.3s', animationDuration: '1.2s', imageRendering: 'pixelated' }} />
    </div>
  )
}

/**
 * Toast d'erreur pour l'authentification
 */
export function AuthErrorToast ({ message }: AuthErrorToastProps): React.ReactNode {
  return (
    <div className='relative flex items-center gap-4 p-4 bg-gradient-to-br from-red-900 via-red-800 to-red-900'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 pointer-events-none' style={{ imageRendering: 'pixelated' }} />

      {/* Icône d'erreur avec effet pixel */}
      <div className='relative z-10'>
        <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse border-3 border-red-400'>
          <span className='text-3xl'>⚠️</span>
        </div>
        {/* Effet de brillance */}
        <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-300 rounded-sm opacity-75 animate-pulse' style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Contenu texte - Style rétro gaming */}
      <div className='flex flex-col gap-1 z-10 flex-1'>
        <p className='text-red-100 font-black text-base font-mono tracking-wide leading-tight' style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          {message}
        </p>
      </div>

      {/* Particules décoratives pixel art */}
      <div className='absolute top-2 right-2 w-2 h-2 bg-red-400/50 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.2s' }} />
      <div className='absolute bottom-3 right-4 w-2 h-2 bg-red-300/40 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
    </div>
  )
}

/**
 * Toast d'information pour l'authentification
 */
export function AuthInfoToast ({ message }: { message: string }): React.ReactNode {
  return (
    <div className='relative flex items-center gap-4 p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900'>
      {/* Effet de grille pixel art en arrière-plan */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 pointer-events-none' style={{ imageRendering: 'pixelated' }} />

      {/* Icône avec effet pixel */}
      <div className='relative z-10'>
        <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse border-3 border-blue-300'>
          <span className='text-3xl'>🚀</span>
        </div>
        {/* Effet de brillance */}
        <div className='absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-sm opacity-75 animate-pulse' style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* Contenu texte - Style rétro gaming */}
      <div className='flex flex-col gap-1 z-10'>
        <p className='text-blue-100 font-black text-base font-mono tracking-wide leading-tight' style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          {message}
        </p>
      </div>

      {/* Particules décoratives pixel art */}
      <div className='absolute top-2 right-2 w-2 h-2 bg-blue-400/50 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.2s' }} />
      <div className='absolute bottom-3 right-4 w-2 h-2 bg-blue-300/40 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
    </div>
  )
}
