import { getMonsterById } from '@/actions/monsters/monsters.actions'
import { CreatureContent } from '@/components/creature'
import { redirect } from 'next/navigation'

/**
 * Page serveur pour afficher les détails d'une créature
 *
 * Cette page est un Server Component qui :
 * - Valide et extrait l'ID depuis les paramètres dynamiques
 * - Charge les données côté serveur pour un affichage instantané
 * - Passe les données au composant client pour les interactions
 *
 * @param params - Paramètres de route dynamique contenant l'ID de la créature
 * @returns Composant React rendant la page de détail de créature
 *
 * @example
 * // URL: /creature/123abc
 * // params = { id: ['123abc'] }
 */
async function CreaturePage ({
  params
}: {
  params: Promise<{ id: string[] }>
}): Promise<React.ReactNode> {
  // Next.js 15: params est une Promise
  const resolvedParams = await params

  // Validation: id doit être un tableau avec au moins un élément
  if (!Array.isArray(resolvedParams.id) || resolvedParams.id.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-moccaccino-50 to-lochinvar-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-moccaccino-700 mb-4'>
            ID de créature invalide
          </h1>
          <p className='text-gray-600'>
            L&apos;URL doit contenir un ID de créature valide.
          </p>
        </div>
      </div>
    )
  }

  // Extraction de l'ID (premier élément du tableau)
  const creatureId = resolvedParams.id[0]

  // Chargement des données côté serveur pour affichage instantané
  const creature = await getMonsterById(creatureId)

  // Redirection vers dashboard si la créature n'existe pas
  if (creature === null) {
    redirect('/dashboard')
  }

  // Le composant client gère l'affichage avec les données pré-chargées
  return <CreatureContent creatureId={creatureId} initialCreature={creature} />
}

export default CreaturePage
