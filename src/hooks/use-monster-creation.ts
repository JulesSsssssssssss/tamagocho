import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'
import { createMonster } from '@/actions/monsters/monsters.actions'

/**
 * Hook personnalisé pour gérer la logique de création d'un monstre
 *
 * Responsabilités (SRP) :
 * - Gestion de l'état du modal de création
 * - Gestion de la transition pendant la soumission
 * - Orchestration de la création et du rafraîchissement
 *
 * @returns {Object} État et fonctions pour la création de monstre
 * @property {boolean} isModalOpen - État d'ouverture du modal
 * @property {boolean} isPending - État de la transition (création en cours)
 * @property {Function} openModal - Ouvre le modal de création
 * @property {Function} closeModal - Ferme le modal de création
 * @property {Function} handleSubmit - Soumet le formulaire de création
 *
 * @example
 * ```tsx
 * const { isModalOpen, isPending, openModal, closeModal, handleSubmit } = useMonsterCreation()
 *
 * return (
 *   <>
 *     <Button onClick={openModal} disabled={isPending}>Créer</Button>
 *     <CreateMonsterModal
 *       isOpen={isModalOpen}
 *       onClose={closeModal}
 *       onSubmit={handleSubmit}
 *     />
 *   </>
 * )
 * ```
 */
export function useMonsterCreation () {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  /**
   * Ouvre le modal de création de monstre
   */
  const openModal = (): void => {
    setIsModalOpen(true)
  }

  /**
   * Ferme le modal de création de monstre
   */
  const closeModal = (): void => {
    setIsModalOpen(false)
  }

  /**
   * Gère la soumission du formulaire de création de monstre
   * Effectue la création côté serveur et rafraîchit la page en cas de succès
   *
   * @param {CreateMonsterFormValues} values - Données du formulaire validées
   */
  const handleSubmit = (values: CreateMonsterFormValues): void => {
    startTransition(() => {
      void createMonster(values)
        .then(() => {
          router.refresh()
          closeModal()
        })
        .catch((error) => {
          console.error('Failed to create monster', error)
          // TODO: Ajouter un toast d'erreur pour l'utilisateur
        })
    })
  }

  return {
    isModalOpen,
    isPending,
    openModal,
    closeModal,
    handleSubmit
  }
}
