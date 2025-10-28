import { useState } from 'react'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignInForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Partial<Credentials>>({})

  const validateForm = (): boolean => {
    const errors: Partial<Credentials> = {}

    if (credentials.email === '') {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Invalid email format'
    }

    if (credentials.password === '') {
      errors.password = 'Password is required'
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    if (!validateForm()) {
      onError('Please fix the errors above')
      return
    }

    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/dashboard'
    }, {
      onRequest: (ctx) => {
        console.log('Signing in...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed in:', ctx)
        setIsLoading(false)
      },
      onError: (ctx) => {
        console.error('Sign in error:', ctx)
        setIsLoading(false)
        const errorMessage = (ctx?.error?.message != null && ctx.error.message !== '') ? ctx.error.message : 'Une erreur est survenue lors de la connexion'
        onError(errorMessage)
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          🔐 Connexion
        </h2>
        <p className='text-gray-600 text-sm'>
          Retrouvez vos petits compagnons ! 👾
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-4' onSubmit={handleSubmit}>
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          error={validationErrors.email}
          onChangeText={(text: string) => {
            setCredentials({ ...credentials, email: text })
            setValidationErrors({ ...validationErrors, email: undefined })
          }}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          error={validationErrors.password}
          onChangeText={(text: string) => {
            setCredentials({ ...credentials, password: text })
            setValidationErrors({ ...validationErrors, password: undefined })
          }}
        />
        <Button
          type='submit'
          size='lg'
          disabled={isLoading}
          variant='default'
        >
          {isLoading ? '🔄 Connexion...' : '🎮 Se connecter'}
        </Button>
      </form>
    </div>
  )
}

export default SignInForm
