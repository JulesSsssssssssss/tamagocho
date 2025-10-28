'use client'

import { memo, useCallback } from 'react'
import Button from '../button'
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
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
      aria-labelledby='create-monster-title'
    >
      <div className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-moccaccino-100 animate-in fade-in zoom-in-95 duration-300'>
        {/* Header du modal */}
        <div className='mb-6 flex items-center justify-between gap-4'>
          <h2
            className='text-2xl font-bold text-gray-900'
            id='create-monster-title'
          >
            Créer une nouvelle créature
          </h2>
          <Button
            onClick={onClose}
            size='sm'
            type='button'
            variant='ghost'
            aria-label='Fermer le modal'
          >
            ✕
          </Button>
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
