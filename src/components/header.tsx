'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from './button'

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
    <header className='fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-lg'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-2 text-2xl font-bold text-moccaccino-600'>
          <span>🐾</span>
          <span>Tamagocho</span>
        </Link>
        <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600'>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className='transition-colors hover:text-moccaccino-600'>
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          size='lg'
          className='px-6 py-3 text-base font-semibold shadow-lg shadow-moccaccino-100 hover:translate-y-px'
          onClick={() => router.push('/sign-in')}
        >
          Créer mon monstre
        </Button>
      </div>
    </header>
  )
}
