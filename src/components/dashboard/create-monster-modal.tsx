'use client'

import { memo, useCallback } from 'react'
import CreateMonsterForm from '@/components/forms/create-monster-form'
import { type CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'

/**
 * Props du composant CreateMonsterModal
 */
interface CreateMonsterModalProps {
  /** Indique si le modal est ouvert */
  isOpen: boolean
  /** Callback appelé à la fermeture du modal */
  onClose: () => void
  /** Callback appelé à la soumission du formulaire */
  onSubmit: (values: CreateMonsterFormValues) => void
}

/**
 * Modal de création de monstre
 *
 * Responsabilités (SRP) :
 * - Gestion de l'affichage modal (overlay, animations)
 * - Gestion de la fermeture (click overlay, bouton)
 * - Orchestration du formulaire de création
 *
 * Accessibilité :
 * - Utilise role="dialog" et aria-modal
 * - Fermeture au click sur l'overlay
 * - Labellisé avec aria-labelledby
 *
 * Optimisation (OCP) :
 * - Composant mémoïsé avec React.memo
 * - Callbacks mémoïsés avec useCallback
 * - Rendu conditionnel early return
 *
 * @param {CreateMonsterModalProps} props - Props du composant
 * @returns {React.ReactNode | null} Modal ou null si fermé
 *
 * @example
 * ```tsx
 * <CreateMonsterModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={(values) => createMonster(values)}
 * />
 * ```
 */
const CreateMonsterModal = memo(function CreateMonsterModal ({
  isOpen,
  onClose,
  onSubmit
}: CreateMonsterModalProps): React.ReactNode {
  // Early return si le modal est fermé (optimisation)
  if (!isOpen) return null

  /**
   * Gère le click sur l'overlay pour fermer le modal
   * Ne ferme que si le click est directement sur l'overlay (pas sur le contenu)
   */
  const handleOverlayClick = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  /**
   * Gère la soumission du formulaire
   * Ferme le modal après soumission réussie
   */
  const handleSubmit = useCallback((values: CreateMonsterFormValues): void => {
    onSubmit(values)
    onClose()
  }, [onSubmit, onClose])

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md px-4'
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='create-monster-title'
    >
      {/* Grille pixel-art en overlay */}
      <div
        className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none'
        style={{ imageRendering: 'pixelated' }}
      />

      <div className='relative w-full max-w-2xl rounded-2xl bg-slate-900/95 backdrop-blur-sm p-8 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-in fade-in zoom-in-95 duration-300'>
        {/* Pixel corners décoratifs */}
        <div className='absolute -top-2 -left-2 w-4 h-4 bg-yellow-500' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute -top-2 -right-2 w-4 h-4 bg-yellow-500' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-500' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-500' style={{ imageRendering: 'pixelated' }} />

        {/* Header du modal - Style pixel art gaming */}
        <div className='mb-8 relative'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-1'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 rounded-lg shadow-lg mb-3'>
                <span className='text-lg'>✨</span>
                <span className='text-sm font-bold text-slate-900 uppercase tracking-wider'>Nouvelle créature</span>
              </div>
              <h2
                className='text-3xl font-bold text-yellow-400 pixel-text'
                id='create-monster-title'
              >
                Donnez vie à votre monstre !
              </h2>
            </div>
            <button
              onClick={onClose}
              type='button'
              aria-label='Fermer le modal'
              className='w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-500 text-white rounded-lg border-2 border-slate-700 hover:border-red-400 transition-all duration-200 text-xl font-bold'
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formulaire de création */}
        <CreateMonsterForm
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
})

export type { CreateMonsterFormValues }
export default CreateMonsterModal
