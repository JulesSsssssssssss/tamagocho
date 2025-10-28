import { useState } from 'react'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
  name: string
}

function SignUpForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Partial<Credentials>>({})

  const validateForm = (): boolean => {
    const errors: Partial<Credentials> = {}

    if (credentials.name === '') {
      errors.name = 'Name is required'
    }

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

    void authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      callbackURL: '/dashboard'
    }, {
      onRequest: (ctx) => {
        console.log('🔄 Tentative d\'inscription...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('✅ Inscription réussie:', ctx)
        setIsLoading(false)
        onError('') // Clear error on success
      },
      onError: (ctx) => {
        console.error('❌ Erreur d\'inscription:', {
          error: ctx.error,
          fullContext: ctx
        })
        setIsLoading(false)

        // Gestion améliorée des erreurs
        let errorMessage = 'Une erreur est survenue lors de l\'inscription'

        if (ctx?.error?.message != null && ctx.error.message !== '') {
          errorMessage = ctx.error.message
        } else if (ctx?.error?.status === 409) {
          errorMessage = 'Cet email est déjà utilisé'
        } else if (ctx?.error?.status === 400) {
          errorMessage = 'Données invalides. Vérifiez vos informations.'
        } else if (ctx?.error?.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.'
        } else if (ctx?.error != null) {
          // Essayer d'extraire plus d'infos de l'erreur
          errorMessage = JSON.stringify(ctx.error)
        }

        console.error('📝 Message d\'erreur affiché:', errorMessage)
        onError(errorMessage)
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          🆕 Créer un compte
        </h2>
        <p className='text-gray-600 text-sm'>
          Rejoignez l'aventure Tamagotcho ! 🎆
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-4' onSubmit={handleSubmit}>
        <InputField
          label="Nom d'utilisateur"
          type='text'
          name='name'
          value={credentials.name}
          error={validationErrors.name}
          onChangeText={(text: string) => {
            setCredentials({ ...credentials, name: text })
            setValidationErrors({ ...validationErrors, name: undefined })
          }}
        />
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
          {isLoading ? '🔄 Création...' : '🎆 Créer mon compte'}
        </Button>
      </form>
    </div>
  )
}

export default SignUpForm
