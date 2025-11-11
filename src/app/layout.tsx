import type { Metadata } from 'next'
import { Jersey_10, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import SwRegister from '@/components/SwRegister'
import { MonstersAutoUpdater } from '@/components/monsters'
import { getServerSessionSafely } from '@/lib/auth'
import { headers } from 'next/headers'
import { ThemeProvider } from '@/components/theme'

const jersey10 = Jersey_10({
  variable: '--font-jersey10',
  subsets: ['latin'],
  weight: '400'
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  appleWebApp: {
    title: 'Tamagotcho'
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png' },
      { url: '/icon0.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/apple-icon.png' }]
  }
}

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.ReactNode> {
  // Récupération de la session utilisateur pour le cron auto-updater
  const session = await getServerSessionSafely(async () => new Headers(await headers()))

  const userId = session?.user?.id ?? null

  return (
    <html lang='fr' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('tamagotcho-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body
        className={`${jersey10.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* Système de mise à jour automatique des monstres */}
          {/* Se déclenche toutes les 1-3 minutes pour dégrader les stats */}
          <MonstersAutoUpdater
            userId={userId}
            minInterval={60000} // 1 minute minimum
            maxInterval={180000} // 3 minutes maximum
            enabled={userId !== null}
            verbose
          />

          {children}
          <SwRegister />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
