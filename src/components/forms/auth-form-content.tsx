'use client'

import { useState, memo, useCallback } from 'react'
import SignUpForm from './signup-form'
import SignInForm from './signin-form'
import GitHubSignInButton from './github-signin-button'
import Button from '../button'

/**
 * Optimisation : Mémoïsé avec React.memo (pas de props, état local uniquement)
 * Note: Composant client avec gestion d'état toggle Sign-In/Sign-Up
 */
const AuthFormContent = memo(function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  /**
   * Optimisation: useCallback pour éviter re-renders de SignInForm/SignUpForm
   */
  const handleError = useCallback((errorMsg: string) => {
    setError(errorMsg)
  }, [])

  const handleToggleForm = useCallback(() => {
    setError('')
    setIsSignIn(prev => !prev)
  }, [])

  return (
    <div className='space-y-6'>
      {/* Error display */}
      {(error.length > 0) && (
        <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl animate-pulse'>
          <div className='flex items-center'>
            <span className='text-red-400 mr-2'>⚠️</span>
            <p className='text-red-700 text-sm font-medium'>{error}</p>
          </div>
        </div>
      )}

      {/* GitHub Sign-In Button - Style pixel-art gaming */}
      <div className='space-y-4'>
        <GitHubSignInButton />

        {/* Separator - Style pixel-art */}
        <div className='relative flex items-center justify-center py-4'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t-2 border-dashed border-gray-600' />
          </div>
          <div className='relative bg-slate-900 px-4'>
            <span className='text-gray-400 text-sm font-bold uppercase tracking-wider'>
              OU
            </span>
          </div>
        </div>
      </div>

      {/* Form container with smooth transition */}
      <div className='transition-all duration-300 ease-in-out'>
        {isSignIn
          ? (
            <div className='animate-in fade-in duration-300'>
              <SignInForm onError={handleError} />
            </div>
            )
          : (
            <div className='animate-in fade-in duration-300'>
              <SignUpForm onError={handleError} />
            </div>
            )}
      </div>

      {/* Toggle button */}
      <div className='text-center pt-4 border-t-2 border-dashed border-gray-600'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={handleToggleForm}
        >
          {isSignIn ? '🆕 Créer un compte' : '🔐 J\'ai déjà un compte'}
        </Button>
      </div>
    </div>
  )
})

export default AuthFormContent
