'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PixelButton from './ui/pixel-button'
import { ThemeToggle } from './theme'

const navigationItems: Array<{ href: string, label: string }> = [
  { href: '#hero', label: 'Accueil' },
  { href: '#benefits', label: 'Avantages' },
  { href: '#monsters', label: 'Créatures' },
  { href: '#actions', label: 'Actions' },
  { href: '#newsletter', label: 'Newsletter' }
]

export default function Header (): React.ReactNode {
  const router = useRouter()

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b-4 border-yellow-500 dark:border-yellow-600 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-colors duration-300'>
      {/* Décoration pixel-art du header */}
      <div className='absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-500 via-blue-500 to-yellow-500'></div>
      
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-2 text-2xl font-bold text-yellow-400 dark:text-yellow-300 hover:scale-105 transition-transform duration-300'>
          <span className='text-3xl'>🐾</span>
          <span>Tamagocho</span>
        </Link>
        
        <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-300 dark:text-gray-400'>
          {navigationItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className='px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20 hover:text-yellow-400 dark:hover:text-yellow-300 hover:scale-105'
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className='flex items-center gap-3'>
          <ThemeToggle variant='ghost' size='sm' />
          <PixelButton
            size='md'
            variant='primary'
            onClick={() => router.push('/sign-in')}
            icon='🎮'
          >
            Créer mon monstre
          </PixelButton>
        </div>
      </div>
    </header>
  )
}
