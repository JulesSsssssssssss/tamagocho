'use client'

import { memo } from 'react'
import type { DBMonster } from '@/shared/types/monster'
import CreatureHeader from './creature-header'
import CreatureAvatar from './creature-avatar'
import CreatureInfo from './creature-info'
import CreatureStats from './creature-stats'
import CreatureActions from './creature-actions'
import MonsterTraitsDisplay from '../monsters/monster-traits-display'

/**
 * Props du composant CreatureDetail
 */
interface CreatureDetailProps {
  /** Données complètes de la créature */
  creature: DBMonster
  /** Callback pour rafraîchir les données après une action */
  onRefresh?: () => void
}

/**
 * Composant principal d'affichage des détails d'une créature
 * 
 * Responsabilités (SRP) :
 * - Composition des sous-composants de la page créature
 * - Organisation de la mise en page
 * 
 * Architecture (OCP) :
 * - Extensible par ajout de nouveaux sous-composants
 * - Chaque section est indépendante
 * 
 * Composition :
 * - CreatureHeader : En-tête avec nom/niveau
 * - CreatureAvatar : Avatar animé du monstre
 * - CreatureStats : Barres de progression (hunger, energy, happiness)
 * - CreatureActions : Boutons d'interaction
 * - MonsterTraitsDisplay : Traits caractéristiques
 * - CreatureInfo : Informations temporelles
 * 
 * Optimisation :
 * - Composant mémoïsé
 * - Sous-composants mémoïsés individuellement
 * 
 * @param {CreatureDetailProps} props - Props du composant
 * @returns {React.ReactNode} Page de détails de la créature
 * 
 * @example
 * ```tsx
 * const creature = await getMonsterById(id)
 * return <CreatureDetail creature={creature} onRefresh={refresh} />
 * ```
 */
const CreatureDetail = memo(function CreatureDetail ({
  creature,
  onRefresh
}: CreatureDetailProps): React.ReactNode {
  // Parse des traits pour MonsterTraitsDisplay
  const traits = JSON.parse(creature.traits)

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4'>
      <div className='w-full max-w-3xl mx-auto space-y-6'>
        {/* En-tête avec nom, niveau et bouton retour */}
        <CreatureHeader
          name={creature.name}
          level={creature.level}
        />

        {/* Avatar animé avec état émotionnel */}
        <CreatureAvatar
          traitsJson={creature.traits}
          state={creature.state}
        />

        {/* Statistiques et Actions - Grille 2 colonnes sur desktop */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Statistiques */}
          <CreatureStats
            hunger={creature.hunger}
            energy={creature.energy}
            happiness={creature.happiness}
          />

          {/* Actions d'interaction */}
          <CreatureActions
            creatureId={creature._id}
            onActionComplete={onRefresh}
          />
        </div>

        {/* Grille responsive pour les infos et traits */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Traits caractéristiques */}
          <div className='bg-white rounded-3xl p-6 shadow-lg ring-1 ring-white/80'>
            <h3 className='text-lg font-semibold text-slate-900 mb-4'>
              ✨ Caractéristiques
            </h3>
            <MonsterTraitsDisplay traits={traits} />
          </div>

          {/* Informations temporelles */}
          <CreatureInfo
            createdAt={creature.createdAt}
            updatedAt={creature.updatedAt}
          />
        </div>

        {/* Message d'encouragement */}
        <div className='bg-gradient-to-r from-lochinvar-50/50 via-fuchsia-blue-50/30 to-moccaccino-50/50 rounded-3xl p-6 text-center ring-1 ring-lochinvar-100/50'>
          <p className='text-sm text-slate-600'>
            🎮 <strong>Prends soin de ton monstre !</strong> Utilise les boutons d'interaction pour 
            modifier ses statistiques et découvrir tous ses états émotionnels.
          </p>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
