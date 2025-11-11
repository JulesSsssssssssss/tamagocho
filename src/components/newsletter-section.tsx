'use client'

import { useState, memo } from 'react'
import PixelButton from '@/components/ui/pixel-button'
import PixelInput from '@/components/ui/pixel-input'
import type { NewsletterFormData } from '@/shared/types/components'

/**
 * NewsletterSection - Section newsletter avec thème pixel art
 *
 * Design System:
 * - Gradient: from-slate-800 via-purple-900 to-slate-800
 * - Grille pixel art en background
 * - Particules pixelisées décoratives
 * - Input: border-4 border-yellow-500 avec backdrop-blur
 * - Button: PixelButton variant primary avec glow
 * - Typographie: font-mono pour heading
 *
 * Responsabilités (SRP):
 * - Affichage du formulaire newsletter
 * - Gestion de l'état du formulaire
 * - Soumission du formulaire
 *
 * Optimisation : Mémoïsé avec React.memo (pas de props = stable)
 * Note: Contient un état interne, mais le composant ne re-render
 * que sur changement d'état interne, pas sur re-render parent
 *
 * @returns {React.ReactNode} Section newsletter pixel art
 */
const NewsletterSection = memo(function NewsletterSection (): React.ReactNode {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '' })

  const handleEmailChange = (text: string): void => {
    setFormData({ email: text })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log('Newsletter subscription:', formData.email)
    setFormData({ email: '' })
  }

  return (
    <section
      id='newsletter'
      className='relative overflow-hidden bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 py-20'
    >
      {/* Grille pixel-art en arrière-plan */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30'
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Particules pixel-art décoratives */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-10 left-10 w-4 h-4 bg-yellow-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated' }}
        />
        <div
          className='absolute bottom-10 right-10 w-3 h-3 bg-purple-400/30 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }}
        />
        <div
          className='absolute top-1/2 left-1/4 w-5 h-5 bg-yellow-400/20 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/25 rounded-sm animate-pulse'
          style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }}
        />
      </div>

      <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
        {/* Titre avec style pixel art */}
        <h2
          className='text-3xl md:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight'
          style={{
            textShadow: '0 0 30px rgba(234, 179, 8, 0.5), 0 0 60px rgba(234, 179, 8, 0.3)',
            imageRendering: 'pixelated'
          }}
        >
          REJOIGNEZ NOTRE COMMUNAUTÉ ! 💌
        </h2>

        {/* Description */}
        <p className='text-lg text-gray-300 max-w-2xl mx-auto font-mono'>
          Inscrivez-vous à notre newsletter et recevez{' '}
          <strong className='text-yellow-400 font-bold'>10% de réduction</strong>{' '}
          sur votre premier achat in-app.
        </p>

        {/* Formulaire avec style pixel art */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4'
        >
          <div className='flex-1'>
            <PixelInput
              label='Email'
              type='email'
              name='newsletter-email'
              value={formData.email}
              onChangeText={handleEmailChange}
              placeholder='votre@email.com'
              required
              icon='📧'
            />
          </div>
          <div className='flex items-end'>
            <PixelButton type='submit' size='lg' variant='primary' icon='✉️'>
              S'inscrire
            </PixelButton>
          </div>
        </form>

        {/* Note légale */}
        <p className='text-sm text-gray-400 font-mono pt-2'>
          * Offre valable pour les nouveaux utilisateurs uniquement.
        </p>
      </div>
    </section>
  )
})

export default NewsletterSection
