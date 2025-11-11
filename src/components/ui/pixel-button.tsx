import type React from 'react'

/**
 * Variantes du bouton pixel-art gaming
 */
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'

/**
 * Tailles du bouton
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props du composant PixelButton
 */
interface PixelButtonProps {
  /** Contenu du bouton */
  children: React.ReactNode
  /** Fonction appelée au clic */
  onClick?: () => void
  /** Type HTML du bouton */
  type?: 'button' | 'submit' | 'reset'
  /** Variante de style du bouton */
  variant?: ButtonVariant
  /** Taille du bouton */
  size?: ButtonSize
  /** État désactivé */
  disabled?: boolean
  /** Classes CSS additionnelles */
  className?: string
  /** Emoji icône à gauche */
  icon?: string
  /** Largeur complète */
  fullWidth?: boolean
  /** Effet de chargement */
  loading?: boolean
}

/**
 * Retourne les classes CSS pour la variante du bouton
 */
function getVariantClasses (variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
  }

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-700 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 active:from-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    secondary: 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-800 text-white hover:from-blue-500 hover:to-blue-600 active:from-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)]',
    success: 'bg-gradient-to-br from-green-500 to-green-600 border-green-700 text-white hover:from-green-600 hover:to-green-700 active:from-green-700 shadow-green-200',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 border-red-700 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 shadow-red-200',
    warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-700 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 active:from-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    ghost: 'bg-slate-800/50 border-yellow-500/30 text-yellow-400 hover:bg-slate-700/50 hover:border-yellow-500/50 active:bg-slate-600/50 shadow-none backdrop-blur-sm'
  }

  return variants[variant]
}

/**
 * Retourne les classes CSS pour la taille du bouton
 */
function getSizeClasses (size: ButtonSize): string {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  return sizes[size]
}

/**
 * Composant PixelButton - Bouton au style pixel-art gaming
 *
 * Responsabilités (SRP):
 * - Affichage d'un bouton interactif cohérent avec le design system
 * - Gestion des différentes variantes de style (primary, secondary, etc.)
 * - Gestion des états (hover, active, disabled, loading)
 *
 * Design System:
 * - Style: Pixel Art Gaming
 * - Bordures: 4px épaisses
 * - Effets: scale, shadow sur hover/active
 * - Couleurs: moccaccino, lochinvar, fuchsia-blue
 *
 * @example
 * ```tsx
 * <PixelButton variant="primary" icon="🎮" onClick={handleClick}>
 *   Jouer
 * </PixelButton>
 * ```
 */
export default function PixelButton ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  fullWidth = false,
  loading = false
}: PixelButtonProps): React.ReactElement {
  const baseClasses = 'font-bold border-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2'
  const variantClasses = getVariantClasses(variant, disabled || loading)
  const sizeClasses = getSizeClasses(size)
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
    >
      {loading
        ? (
          <>
            <span className='animate-spin'>⚙️</span>
            <span>Chargement...</span>
          </>
          )
        : (
          <>
            {icon !== undefined && <span className='text-xl'>{icon}</span>}
            <span>{children}</span>
          </>
          )}
    </button>
  )
}
