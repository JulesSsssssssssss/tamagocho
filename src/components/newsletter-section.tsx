'use client'

import { useState } from 'react'
import Button from '@/components/button'
import type { NewsletterFormData } from '@/shared/types/components'

export default function NewsletterSection (): React.ReactNode {
  const [formData, setFormData] = useState<NewsletterFormData>({ email: '' })

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ email: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log('Newsletter subscription:', formData.email)
    setFormData({ email: '' })
  }

  return (
    <section id='newsletter' className='relative overflow-hidden bg-gradient-to-r from-moccaccino-500 via-fuchsia-blue-500 to-lochinvar-500 py-20 text-white'>
      <div className='absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]' />
      <div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
        <h2 className='text-3xl md:text-4xl font-bold'>Rejoignez notre communauté !</h2>
        <p className='text-lg text-white/90 max-w-2xl mx-auto'>
          Inscrivez-vous à notre newsletter et recevez <strong>10% de réduction</strong> sur votre premier achat in-app.
        </p>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
          <input
            type='email'
            value={formData.email}
            onChange={handleEmailChange}
            placeholder='Votre adresse email'
            required
            className='flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-base placeholder:text-white/70 shadow-inner focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60'
          />
          <Button type='submit' size='lg' variant='outline' className='border-white/40 bg-white/10 text-white hover:bg-white/20'>
            S'inscrire
          </Button>
        </form>
        <p className='text-sm text-white/70'>* Offre valable pour les nouveaux utilisateurs uniquement.</p>
      </div>
    </section>
  )
}
