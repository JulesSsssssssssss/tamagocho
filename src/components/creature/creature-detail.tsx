'use client'

import { memo, useEffect, useState } from 'react'
import type { DBMonster } from '@/shared/types/monster'
import CreatureHeader from './creature-header'
import CreatureAvatar from './creature-avatar'
import CreatureInfo from './creature-info'
import CreatureStats from './creature-stats'
import CreatureXpBar from './creature-xp-bar'
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
  // État local pour le monstre actuel (mis à jour par polling)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(creature)

  // Parse des traits pour MonsterTraitsDisplay
  const traits = JSON.parse(currentMonster.traits)

  // Fonction pour récupérer les données du monstre
  const fetchMonster = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${creature._id}`)
      if (response.ok) {
        const updatedMonster: DBMonster = await response.json()
        setCurrentMonster(updatedMonster)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du monstre :', error)
    }
  }

  // Polling pour rafraîchir les données du monstre toutes les 1 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchMonster()
    }, 1000)

    return () => { clearInterval(interval) }
  }, [creature._id])

  // Callback après une action - force le rafraîchissement immédiat
  const handleActionComplete = (): void => {
    void fetchMonster()
    if (onRefresh !== undefined) {
      onRefresh()
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      {/* Effet de grille en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none' />

      {/* Particules flottantes */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-2 h-2 bg-fuchsia-blue-400 rounded-full animate-pulse opacity-40' />
        <div className='absolute top-40 right-20 w-3 h-3 bg-lochinvar-400 rounded-full animate-pulse opacity-30' />
        <div className='absolute bottom-32 left-1/4 w-2 h-2 bg-moccaccino-400 rounded-full animate-pulse opacity-35' />
        <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-fuchsia-blue-300 rounded-full animate-pulse opacity-25' />
      </div>

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        {/* Container principal avec max-width */}
        <div className='max-w-7xl mx-auto space-y-4 md:space-y-6'>
          {/* En-tête avec nom et niveau */}
          <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg'>
            <CreatureHeader
              name={currentMonster.name}
              level={currentMonster.level}
            />
          </div>

          {/* Grid principal - 2 colonnes sur grand écran */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
            {/* Colonne gauche - Avatar et XP */}
            <div className='lg:col-span-1 space-y-4 md:space-y-6'>
              {/* Avatar animé */}
              <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200 shadow-lg relative overflow-hidden aspect-square'>
                {/* Effet de lueur derrière l'avatar */}
                <div className='absolute inset-0 bg-gradient-to-t from-fuchsia-blue-500/5 via-transparent to-transparent' />
                <div className='relative z-10 w-full h-full flex items-center justify-center'>
                  <CreatureAvatar
                    traitsJson={currentMonster.traits}
                    state={currentMonster.state}
                  />
                </div>
              </div>

              {/* Barre XP */}
              <div className='bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg overflow-hidden'>
                <CreatureXpBar
                  level={currentMonster.level}
                  xp={currentMonster.xp}
                  xpToNextLevel={currentMonster.xpToNextLevel}
                />
              </div>
            </div>

            {/* Colonne droite - Stats, Actions, Infos */}
            <div className='lg:col-span-2 space-y-4 md:space-y-6'>
              {/* Stats et Actions */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
                {/* Statistiques */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg'>
                  <h3 className='text-base md:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
                    <span className='text-xl md:text-2xl'>📊</span>
                    Statistiques
                  </h3>
                  <CreatureStats
                    hunger={currentMonster.hunger}
                    energy={currentMonster.energy}
                    happiness={currentMonster.happiness}
                  />
                </div>

                {/* Actions */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg'>
                  <CreatureActions
                    creatureId={currentMonster._id}
                    onActionComplete={handleActionComplete}
                  />
                </div>
              </div>

              {/* Traits et Informations */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
                {/* Traits caractéristiques */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg'>
                  <h3 className='text-base md:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2'>
                    <span className='text-xl md:text-2xl'>✨</span>
                    Caractéristiques
                  </h3>
                  <MonsterTraitsDisplay traits={traits} />
                </div>

                {/* Informations temporelles */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg'>
                  <CreatureInfo
                    createdAt={currentMonster.createdAt}
                    updatedAt={currentMonster.updatedAt}
                  />
                </div>
              </div>

              {/* Message gaming */}
              <div className='bg-gradient-to-r from-moccaccino-100/80 via-fuchsia-blue-100/80 to-lochinvar-100/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-moccaccino-200 shadow-lg'>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center'>
                  <span className='text-2xl md:text-3xl'>🎮</span>
                  <p className='text-xs md:text-sm text-slate-800 font-medium'>
                    <strong className='text-moccaccino-700'>Prends soin de ton monstre !</strong> Utilise les bonnes actions pour gagner de l'XP et monter de niveau.
                  </p>
                  <span className='text-2xl md:text-3xl'>⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
