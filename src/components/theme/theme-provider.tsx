'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Type du thème
 */
export type Theme = 'light' | 'dark'

/**
 * Interface du contexte de thème
 */
interface ThemeContextType {
  /** Thème actuel */
  theme: Theme
  /** Fonction pour changer le thème */
  setTheme: (theme: Theme) => void
  /** Fonction pour toggle le thème */
  toggleTheme: () => void
}

/**
 * Contexte du thème
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Props du ThemeProvider
 */
interface ThemeProviderProps {
  children: React.ReactNode
  /** Thème par défaut */
  defaultTheme?: Theme
}

/**
 * ThemeProvider - Gestion du thème dark/light avec persistance
 *
 * Responsabilités (SRP):
 * - Gérer l'état du thème (dark/light)
 * - Persister le choix dans localStorage
 * - Appliquer la classe 'dark' sur le document
 * - Fournir le contexte aux composants enfants
 *
 * Fonctionnalités:
 * - Détection de la préférence système (prefers-color-scheme)
 * - Persistance dans localStorage
 * - Toggle facile entre dark/light
 * - Support SSR (hydration safe)
 *
 * @example
 * ```tsx
 * // Dans layout.tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Dans un composant
 * const { theme, toggleTheme } = useTheme()
 * ```
 */
export function ThemeProvider ({
  children,
  defaultTheme = 'light'
}: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const savedTheme = localStorage.getItem('tamagotcho-theme') as Theme | null

    if (savedTheme !== null) {
      setThemeState(savedTheme)
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setThemeState(prefersDark ? 'dark' : 'light')
    }

    setMounted(true)
  }, [])

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    if (mounted) {
      localStorage.setItem('tamagotcho-theme', theme)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme)
  }

  const toggleTheme = (): void => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Toujours rendre le provider, même pendant l'hydration
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook pour utiliser le contexte de thème
 *
 * @throws {Error} Si utilisé en dehors d'un ThemeProvider
 * @returns {ThemeContextType} Contexte du thème
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme()
 * ```
 */
export function useTheme (): ThemeContextType {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
