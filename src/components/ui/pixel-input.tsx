import type React from 'react'

/**
 * Props du composant PixelInput
 */
interface PixelInputProps {
  /** Label du champ */
  label: string
  /** Type d'input HTML */
  type?: 'text' | 'email' | 'password' | 'number'
  /** Nom du champ */
  name: string
  /** Valeur actuelle */
  value: string
  /** Callback appelé lors du changement */
  onChangeText: (text: string) => void
  /** Message d'erreur */
  error?: string
  /** Placeholder */
  placeholder?: string
  /** Icône emoji */
  icon?: string
  /** Requis */
  required?: boolean
  /** Désactivé */
  disabled?: boolean
  /** Autocomplétion */
  autoComplete?: string
}

/**
 * Composant PixelInput - Input au style pixel-art gaming
 *
 * Responsabilités (SRP):
 * - Affichage d'un champ de saisie cohérent avec le design system
 * - Gestion des états (focus, error, disabled)
 * - Validation visuelle via bordures colorées
 *
 * Design System:
 * - Style: Pixel Art Gaming
 * - Bordures: 3px épaisses
 * - Focus: bordure colorée + shadow
 * - Couleurs: moccaccino pour focus, red pour erreur
 *
 * @example
 * ```tsx
 * <PixelInput
 *   label="Email"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChangeText={setEmail}
 *   icon="📧"
 *   error={errors.email}
 * />
 * ```
 */
export default function PixelInput ({
  label,
  type = 'text',
  name,
  value,
  onChangeText,
  error,
  placeholder,
  icon,
  required = false,
  disabled = false,
  autoComplete
}: PixelInputProps): React.ReactElement {
  const hasError = error !== undefined && error !== ''

  return (
    <div className='w-full'>
      {/* Label avec emoji */}
      <label
        htmlFor={name}
        className='flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'
      >
        {icon !== undefined && <span className='text-lg'>{icon}</span>}
        <span>{label}</span>
        {required && <span className='text-red-500'>*</span>}
      </label>

      {/* Input field - Style pixel-art */}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => { onChangeText(e.target.value) }}
        placeholder={placeholder ?? label}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3 
          border-3 rounded-xl 
          font-medium text-gray-900 
          placeholder:text-gray-400 
          transition-all duration-200
          ${hasError
            ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-moccaccino-500 focus:ring-4 focus:ring-moccaccino-200'
          }
          ${disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100'
            : 'hover:border-moccaccino-300'
          }
          focus:outline-none
          shadow-sm
        `}
      />

      {/* Message d'erreur - Style pixel-art */}
      {hasError && (
        <div className='mt-2 flex items-start gap-2 bg-red-50 border-2 border-red-300 rounded-lg px-3 py-2'>
          <span className='text-lg'>⚠️</span>
          <p className='text-red-700 text-sm font-medium'>{error}</p>
        </div>
      )}
    </div>
  )
}
