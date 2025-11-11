'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useCallback } from 'react'
import PixelButton from './ui/pixel-button'

/**
 * Navigation items pour la landing page
 */
const navigationItems: Array<{ href: string, label: string, icon: string }> = [
  { href: '#hero', label: 'ACCUEIL', icon: '🏠' },
  { href: '#benefits', label: 'AVANTAGES', icon: '⭐' },
  { href: '#monsters', label: 'CRÉATURES', icon: '🐾' },
  { href: '#actions', label: 'ACTIONS', icon: '🎮' }
]

/**
 * Header - Navbar pixel art gaming simple et épurée
 *
 * Design System:
 * - Background: slate-900/95 avec backdrop-blur-lg
 * - Border: border-b-4 border-yellow-500 avec glow
 * - Logo: font-mono avec text-shadow glow
 * - Nav links: font-mono uppercase avec hover effects
 * - CTA: PixelButton variant primary
 * - Pixel corners: 2x2px yellow-400
 *
 * Responsabilités (SRP):
 * - Navigation principale du site
 * - CTA vers sign-in
 * - Branding (logo)
 *
 * Optimisation: Mémoïsé avec React.memo
 *
 * @returns {React.ReactNode} Header pixel art
 */
const Header = memo(function Header (): React.ReactNode {
  const router = useRouter()

  const handleSignInClick = useCallback(() => {
    router.push('/sign-in')
  }, [router])

  return (
    <header
      className='fixed inset-x-0 top-0 z-50 border-b-4 border-yellow-500 bg-slate-900/95 backdrop-blur-lg'
      style={{
        boxShadow: '0 0 30px rgba(234, 179, 8, 0.3)',
        imageRendering: 'pixelated'
      }}
    >
      {/* Pixel corners décoratifs */}
      <div className='absolute top-0 left-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
      <div className='absolute top-0 right-0 w-2 h-2 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

      {/* Grille pixel-art subtile */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none'
        style={{ imageRendering: 'pixelated' }}
      />

      <div className='relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo avec style pixel art */}
        <Link
          href='/'
          className='flex items-center gap-2 transition-transform duration-300 hover:scale-105 group'
        >
          <span
            className='text-3xl transition-transform duration-300 group-hover:scale-110'
            style={{ imageRendering: 'pixelated' }}
          >
            🐾
          </span>
          <span
            className='text-2xl font-black font-mono tracking-tight text-yellow-400'
            style={{
              textShadow: '0 0 15px rgba(234, 179, 8, 0.6)',
              imageRendering: 'pixelated'
            }}
          >
            TAMAGOCHO
          </span>
        </Link>

        {/* Navigation desktop simple */}
        <nav className='hidden md:flex items-center gap-2'>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider text-gray-300 transition-all duration-300 hover:bg-yellow-500/10 hover:text-yellow-400 hover:scale-105'
              style={{ imageRendering: 'pixelated' }}
            >
              <span className='text-sm'>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* CTA avec PixelButton */}
        <div className='flex items-center'>
          <PixelButton
            size='md'
            variant='primary'
            onClick={handleSignInClick}
            icon='🚀'
          >
            COMMENCER
          </PixelButton>
        </div>
      </div>
    </header>
  )
})

export default Header
