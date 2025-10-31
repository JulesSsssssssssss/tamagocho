'use client'

import { useState } from 'react'
import PixelButton from '@/components/ui/pixel-button'
import PixelInput from '@/components/ui/pixel-input'
import type { NewsletterFormData } from '@/shared/types/components'

export default function NewsletterSection (): React.ReactNode {
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
    <section id='newsletter' className='relative overflow-hidden bg-gradient-to-r from-yellow-600 via-blue-600 to-yellow-600 dark:from-yellow-700 dark:via-blue-700 dark:to-yellow-700 py-20 text-white transition-colors duration-300'>
      {/* Effet pixel-art décoratif */}
      <div className='absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20' />
      
      <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
        <h2 className='text-3xl md:text-4xl font-bold'>Rejoignez notre communauté ! 💌</h2>
        <p className='text-lg text-white/90 max-w-2xl mx-auto'>
          Inscrivez-vous à notre newsletter et recevez <strong className='text-yellow-200 dark:text-yellow-100'>10% de réduction</strong> sur votre premier achat in-app.
        </p>
        
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
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
            <PixelButton 
              type='submit' 
              size='lg' 
              variant='primary'
              icon='✉️'
            >
              S'inscrire
            </PixelButton>
          </div>
        </form>
        
        <p className='text-sm text-white/70'>* Offre valable pour les nouveaux utilisateurs uniquement.</p>
      </div>
    </section>
  )
}
