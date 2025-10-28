'use client'

import { useState, type FormEvent } from 'react'
import Button from './button'
import { Input } from './ui/input'

export default function NewsletterForm (): React.ReactNode {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsSubmitting(true)
    // Ici, vous pourrez ajouter la logique d'inscription à la newsletter
    console.log('Newsletter signup submitted:', email)

    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false)
      setEmail('')
      alert('Merci pour votre inscription ! 🎉')
    }, 1000)
  }

  return (
    <form className='max-w-md mx-auto' onSubmit={handleSubmit}>
      <div className='flex flex-col sm:flex-row gap-3'>
        <Input
          type='email'
          placeholder='votre@email.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 h-12 px-4 text-base'
          required
        />
        <Button
          type='submit'
          variant='secondary'
          size='lg'
          disabled={isSubmitting}
          className='bg-white text-bermuda-600 hover:bg-white/90 font-bold px-8 h-12 text-base'
        >
          {isSubmitting ? 'Envoi...' : "S'inscrire ✨"}
        </Button>
      </div>
    </form>
  )
}
