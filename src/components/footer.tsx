import { memo } from 'react'
import Link from 'next/link'
import type { FooterLinkGroup } from '@/shared/types/components'

/**
 * Optimisation : Mémoïsé avec React.memo (composant purement présentationnel)
 */
const FooterLinkGroupComponent = memo(function FooterLinkGroupComponent ({ title, links }: FooterLinkGroup): React.ReactNode {
  return (
    <div>
      <h3 className='text-lg font-semibold text-yellow-400 dark:text-yellow-300'>{title}</h3>
      <ul className='mt-4 space-y-2 text-gray-400 dark:text-gray-500'>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='transition-all duration-300 hover:text-yellow-400 dark:hover:text-yellow-300 hover:translate-x-1 inline-block'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.title === nextProps.title &&
  prevProps.links.length === nextProps.links.length
)

/**
 * Optimisation : Mémoïsé avec React.memo (contenu statique)
 */
const Footer = memo(function Footer (): React.ReactNode {
  const linkGroups: FooterLinkGroup[] = [
    {
      title: 'Liens utiles',
      links: [
        { label: 'Comment jouer', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Communauté', href: '#' }
      ]
    },
    {
      title: 'Légal',
      links: [
        { label: "Conditions d'utilisation", href: '#' },
        { label: 'Politique de confidentialité', href: '#' },
        { label: 'Mentions légales', href: '#' },
        { label: 'CGV', href: '#' }
      ]
    }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className='relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-t-4 border-yellow-500 dark:border-yellow-600 transition-colors duration-300 shadow-[0_-10px_30px_rgba(234,179,8,0.2)] overflow-hidden'>
      {/* Décoration pixel-art en haut */}
      <div className='h-2 bg-gradient-to-r from-yellow-500 via-blue-500 to-yellow-500' />

      {/* Effet de grille pixel-art */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30' />

      {/* Particules décoratives */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-20 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute bottom-20 right-20 w-4 h-4 bg-blue-400/10 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
      </div>

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid gap-10 md:grid-cols-4'>
          <div className='md:col-span-2 space-y-4'>
            <Link
              href='/'
              className='inline-flex items-center gap-3 text-2xl font-bold text-yellow-400 dark:text-yellow-300 hover:scale-105 transition-transform duration-300'
            >
              <span className='text-3xl'>🐾</span>
              <span>Tamagocho</span>
            </Link>
            <p className='max-w-md text-gray-400 dark:text-gray-500'>
              L'expérience Tamagotchi nouvelle génération : adoptez, soignez et regardez grandir votre créature virtuelle adorée. 🎮
            </p>

            {/* Réseaux sociaux */}
            <div className='flex gap-4 pt-4'>
              <a href='#' className='w-10 h-10 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 border-2 border-yellow-500/30 dark:border-yellow-500/40 flex items-center justify-center text-xl hover:bg-yellow-500 hover:scale-110 transition-all duration-300' style={{ imageRendering: 'pixelated' }}>
                🐦
              </a>
              <a href='#' className='w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border-2 border-blue-500/30 dark:border-blue-500/40 flex items-center justify-center text-xl hover:bg-blue-500 hover:scale-110 transition-all duration-300' style={{ imageRendering: 'pixelated' }}>
                📷
              </a>
              <a href='#' className='w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 border-2 border-purple-500/30 dark:border-purple-500/40 flex items-center justify-center text-xl hover:bg-purple-500 hover:scale-110 transition-all duration-300' style={{ imageRendering: 'pixelated' }}>
                💬
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <FooterLinkGroupComponent key={group.title} {...group} />
          ))}
        </div>

        <div className='mt-12 border-t border-white/10 dark:border-white/5 pt-8 text-center text-gray-400 dark:text-gray-600'>
          <p>© {currentYear} Tamagocho. Tous droits réservés. Créé avec ❤️ pour My Digital School.</p>
        </div>
      </div>
    </footer>
  )
})

export default Footer
