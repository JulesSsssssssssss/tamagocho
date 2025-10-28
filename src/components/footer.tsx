import Link from 'next/link'
import type { FooterLinkGroup } from '@/shared/types/components'

function FooterLinkGroupComponent ({ title, links }: FooterLinkGroup): React.ReactNode {
  return (
    <div>
      <h3 className='text-lg font-semibold text-white'>{title}</h3>
      <ul className='mt-4 space-y-2 text-gray-400'>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className='transition-colors hover:text-white'>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer (): React.ReactNode {
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
    <footer className='bg-gray-900 text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid gap-10 md:grid-cols-4'>
          <div className='md:col-span-2 space-y-4'>
            <Link href='/' className='flex items-center gap-3 text-2xl font-bold text-moccaccino-400'>
              <span>🐾</span>
              <span>Tamagocho</span>
            </Link>
            <p className='max-w-md text-gray-400'>
              L'expérience Tamagotchi nouvelle génération : adoptez, soignez et regardez grandir votre créature virtuelle adorée.
            </p>
          </div>

          {linkGroups.map((group) => (
            <FooterLinkGroupComponent key={group.title} {...group} />
          ))}
        </div>

        <div className='mt-12 border-t border-white/10 pt-8 text-center text-gray-400'>
          <p>© {currentYear} Tamagocho. Tous droits réservés. Créé avec ❤️ pour My Digital School.</p>
        </div>
      </div>
    </footer>
  )
}
