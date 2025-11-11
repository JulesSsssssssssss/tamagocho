'use client'

import React from 'react'
import { useTheme } from './theme-provider'

/**
 * Props du ThemeToggle
 */
interface ThemeToggleProps {
  /** Variante du bouton */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Taille du bouton */
  size?: 'sm' | 'md' | 'lg'
  /** Classes CSS additionnelles */
  className?: string
}

/**
 * ThemeToggle - Bouton pour basculer entre dark/light mode
 *
 * Responsabilités (SRP):
 * - Afficher un bouton avec emoji selon le thème
 * - Toggle le thème au clic
 * - Style pixel-art cohérent avec le design system
 *
 * Fonctionnalités:
 * - Emoji dynamique : 🌙 (dark mode) / ☀️ (light mode)
 * - Animation smooth lors du changement
 * - Style pixel-art avec bordures épaisses
 * - Accessible (aria-label)
 *
 * @example
 * ```tsx
 * <ThemeToggle variant="ghost" size="sm" />
 * ```
 */
export function ThemeToggle ({
  variant = 'ghost',
  size = 'md',
  className = ''
}: ThemeToggleProps): React.ReactElement {
  const { theme, toggleTheme } = useTheme()

  // Déterminer l'emoji et le label selon le thème
  const emoji = theme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'

  // Classes de base pixel-art
  const baseClasses = 'rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center'

  // Variantes de style
  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-br from-moccaccino-500 to-moccaccino-600 text-white border-4 border-moccaccino-700 hover:from-moccaccino-600 hover:to-moccaccino-700 hover:scale-105 shadow-lg',
    secondary: 'bg-gradient-to-br from-lochinvar-500 to-lochinvar-600 text-white border-4 border-lochinvar-700 hover:from-lochinvar-600 hover:to-lochinvar-700 hover:scale-105 shadow-lg',
    ghost: 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-800 dark:text-white border-3 border-slate-300 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:scale-105'
  }

  // Tailles
  const sizeClasses: Record<string, string> = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-3xl'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button
      onClick={toggleTheme}
      className={classes}
      aria-label={label}
      title={label}
      type='button'
    >
      <span className='transition-transform duration-300 hover:rotate-12'>
        {emoji}
      </span>
    </button>
  )
}
